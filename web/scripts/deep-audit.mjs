import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("🚀 Initializing Deep Site Audit...");
console.log(`📂 Project Root: ${projectRoot}`);

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────

// Recursively get files in a directory matching extensions
function getFiles(dir, extensions = [".tsx", ".ts", ".js", ".jsx"]) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        results = results.concat(getFiles(filePath, extensions));
      }
    } else {
      if (extensions.includes(path.extname(file))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

// Check if file exists in variations (ts, tsx, js, jsx)
function resolveImportPath(dir, importName) {
  const extensions = [".tsx", ".ts", ".js", ".jsx", "/page.tsx", "/page.ts", "/page.js", "/index.tsx", "/index.ts", "/index.js"];
  // If it's alias import
  if (importName.startsWith("@/")) {
    const relativePart = importName.slice(2);
    const targetPath = path.join(projectRoot, relativePart);
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) return targetPath;
    for (const ext of extensions) {
      const full = targetPath + ext;
      if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
    }
    return null;
  }
  // Relative path
  const targetPath = path.resolve(dir, importName);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) return targetPath;
  for (const ext of extensions) {
    const full = targetPath + ext;
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  return null;
}

// ─── 1. ROUTE DISCOVERY & EXPANSION ──────────────────────────────────
console.log("🔍 Scanning routes...");

const appDir = path.join(projectRoot, "app");
const pageFiles = getFiles(appDir).filter(f => f.endsWith("page.tsx") || f.endsWith("page.js"));

const routesMap = new Map(); // route -> file path
const apiRoutesMap = new Map(); // api route -> file path

pageFiles.forEach((file) => {
  const relPath = path.relative(appDir, file);
  // Remove Next.js route groups like (protected), (auth), [something], page.tsx
  let route = "/" + relPath.replace(/\\/g, "/");
  route = route.replace(/\/page\.(tsx|js)$/, "");
  route = route.replace(/\/\([^)]+\)/g, ""); // Remove (protected) groups

  if (route === "/page.tsx" || route === "/page.js" || route === "") {
    route = "/";
  }

  routesMap.set(route, file);
});

// Discover API routes
const apiFiles = getFiles(appDir).filter(f => f.includes(`${path.sep}api${path.sep}`) && (f.endsWith("route.ts") || f.endsWith("route.js")));
apiFiles.forEach((file) => {
  const relPath = path.relative(appDir, file);
  let route = "/" + relPath.replace(/\\/g, "/");
  route = route.replace(/\/route\.(ts|js)$/, "");
  route = route.replace(/\/\([^)]+\)/g, "");
  apiRoutesMap.set(route, file);
});

console.log(`ℹ️ Found ${routesMap.size} static/dynamic page routes.`);
console.log(`ℹ️ Found ${apiRoutesMap.size} API routes.`);

// Dynamic Slugs Expansion
// Read locations
let locations = [];
try {
  const locFile = path.join(projectRoot, "lib/locations.ts");
  const content = fs.readFileSync(locFile, "utf8");
  const regex = /id:\s*["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    locations.push(match[1]);
  }
} catch (e) {
  console.warn("⚠️ Failed to parse locations.ts:", e.message);
}

// Read blog posts
let blogs = [];
let blogFullData = [];
const scanBlogFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const postRegex = /{\s*slug:\s*["']([^"']+)["'](?:,[\s\S]*?content:\s*`([\s\S]*?)`)?/g;
    let match;
    while ((match = postRegex.exec(content)) !== null) {
      blogs.push(match[1]);
      if (match[2]) {
        blogFullData.push({ slug: match[1], content: match[2] });
      }
    }
  } catch (e) {
    console.warn(`⚠️ Failed to parse ${path.basename(filePath)}:`, e.message);
  }
};
scanBlogFile(path.join(projectRoot, "lib/blog-data.ts"));
scanBlogFile(path.join(projectRoot, "lib/new-blog-data.ts"));

// Add concrete routes to our valid routes list
const allValidRoutes = new Set();
// Add standard pages
routesMap.forEach((_, route) => {
  if (!route.includes("[")) {
    allValidRoutes.add(route);
  }
});

// Expand PCOD locations
locations.forEach((loc) => {
  allValidRoutes.add(`/online-pcod-treatment/${loc}`);
});

// Expand Blogs
blogs.forEach((slug) => {
  allValidRoutes.add(`/blog/${slug}`);
});

// Also manually add prescription / admin dynamic roots that exist in DB,
// but since this is static checkout/test, we'll allow paths matching /prescription/* for now
console.log(`ℹ️ Total concrete routes (after expansion): ${allValidRoutes.size}`);

// ─── 2. STATIC CONTENT & LINK EXTRACTION ──────────────────────────────
console.log("🕵️ Analyzing pages and components for links, placeholders, and word counts...");

const placeholdersFound = [];
const thinPagesFound = [];
const internalLinksInCode = [];
const externalLinksInCode = [];
const apiRequestsInCode = [];

// Clean JSX tags to get word count
function cleanJSX(content) {
  let text = content;
  text = text.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''); // Comments
  text = text.replace(/import\s+[\s\S]*?\s+from\s+['"].*?['"];?/g, ''); // Imports
  text = text.replace(/(interface|type)\s+[\s\S]*?\{[\s\S]*?\}/g, ''); // TS Types
  text = text.replace(/className\s*=\s*(?:"[^"]*"|'[^']*'|{[\s\S]*?})/g, ''); // Classnames
  text = text.replace(/<[^>]+>/g, ' '); // HTML Tags
  text = text.replace(/[{}]/g, ' '); // Braces
  text = text.replace(/(export\s+const\s+metadata|export\s+async\s+function|export\s+default\s+function)[\s\S]*?\(/g, '');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

// Helper to scan a single file
function scanFile(filePath, isPageFile = false, associatedRoute = null) {
  const content = fs.readFileSync(filePath, "utf8");
  const fileDir = path.dirname(filePath);

  // Check placeholders
  const PLACEHOLDER_PATTERNS = [
    { pattern: /lorem\s+ipsum/i, name: "Lorem Ipsum" },
    { pattern: /todo/i, name: "TODO" },
    { pattern: /placeholder/i, name: "Placeholder" },
    { pattern: /dummy/i, name: "Dummy Text" },
    { pattern: /mock/i, name: "Mock Content/Data" },
    { pattern: /temp-image/i, name: "Temp Image Reference" },
  ];

  PLACEHOLDER_PATTERNS.forEach(({ pattern, name }) => {
    if (pattern.test(content)) {
      // Find lines
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        if (pattern.test(line)) {
          placeholdersFound.push({
            file: filePath,
            line: idx + 1,
            snippet: line.trim(),
            type: name
          });
        }
      });
    }
  });

  // Extract Links
  // Match href="/..." or href='...'
  const hrefRegex = /href\s*=\s*["']([^"']+)["']/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const link = match[1];
    if (link.startsWith("/")) {
      internalLinksInCode.push({ fromFile: filePath, link, route: associatedRoute });
    } else if (link.startsWith("http://") || link.startsWith("https://")) {
      externalLinksInCode.push({ fromFile: filePath, link });
    }
  }

  // Match router.push('/...')
  const pushRegex = /router\.push\(\s*["']([^"']+)["']/g;
  while ((match = pushRegex.exec(content)) !== null) {
    const link = match[1];
    if (link.startsWith("/")) {
      internalLinksInCode.push({ fromFile: filePath, link, route: associatedRoute });
    }
  }

  // Extract API Requests
  const fetchRegex = /(?:fetch|axios(?:\.get|\.post)?)\(\s*["']([^"']+)["']/g;
  while ((match = fetchRegex.exec(content)) !== null) {
    const url = match[1];
    if (url.startsWith("/api/")) {
      apiRequestsInCode.push({ fromFile: filePath, url });
    }
  }

  // Word count checking (only for actual pages)
  if (isPageFile && associatedRoute) {
    // Dynamic page files like blog/[slug]/page.tsx are audited separately via database/blog-data check,
    // but let's check static page templates.
    if (!associatedRoute.includes("[") && !associatedRoute.startsWith("/admin")) {
      let rawText = cleanJSX(content);
      
      // Also trace imports in this page file and scan them if they are local components
      const importRegex = /import\s+\w+\s+from\s+["']((\.\.?\/|@\/)[^"']+)["']/g;
      let impMatch;
      while ((impMatch = importRegex.exec(content)) !== null) {
        const resolved = resolveImportPath(fileDir, impMatch[1]);
        if (resolved) {
          rawText += " " + cleanJSX(fs.readFileSync(resolved, "utf8"));
        }
      }

      const wordCount = rawText.split(/\s+/).filter(w => w.length > 0).length;
      if (wordCount < 300) {
        thinPagesFound.push({
          route: associatedRoute,
          file: filePath,
          wordCount
        });
      }
    }
  }
}

// Scan all pages under app/
routesMap.forEach((filePath, route) => {
  scanFile(filePath, true, route);
});

// Scan all component files
const componentsDir = path.join(projectRoot, "components");
if (fs.existsSync(componentsDir)) {
  getFiles(componentsDir).forEach((file) => {
    scanFile(file, false);
  });
}

// Scans other folders like hooks or lib
const libDir = path.join(projectRoot, "lib");
if (fs.existsSync(libDir)) {
  getFiles(libDir).forEach((file) => {
    if (!file.endsWith("blog-data.ts")) { // blog-data is very large, skip scanning it for placeholders to avoid clutter
      scanFile(file, false);
    }
  });
}

// Audit blog content explicitly from blog-data
blogFullData.forEach((post) => {
  const plainBlogText = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainBlogText.split(' ').length;
  if (wordCount < 1800) {
    thinPagesFound.push({
      route: `/blog/${post.slug}`,
      file: "lib/blog-data.ts",
      wordCount,
      type: "Blog Post"
    });
  }
});

// ─── 3. BROKEN INTERNAL LINKS & APIS ──────────────────────────────────
console.log("🔗 Verifying internal links & API endpoints...");

const brokenInternalLinks = [];
internalLinksInCode.forEach(({ fromFile, link, route }) => {
  // Clean query strings or anchors
  const cleanLink = link.split("?")[0].split("#")[0];
  
  if (cleanLink === "") return; // Empty anchor/href
  
  // Allow exceptions for dynamic admin pages/prescription IDs or dynamic quiz routes
  if (cleanLink.startsWith("/prescription/") && cleanLink.split("/").length === 3) return;
  if (cleanLink.startsWith("/admin/") && cleanLink.includes("[")) return;
  if (cleanLink.startsWith("/api/")) return; // Checked separately

  if (!allValidRoutes.has(cleanLink) && cleanLink !== "/") {
    brokenInternalLinks.push({
      fromFile,
      target: link,
      sourceRoute: route
    });
  }
});

const brokenApiEndpoints = [];
apiRequestsInCode.forEach(({ fromFile, url }) => {
  const cleanUrl = url.split("?")[0];
  // Convert e.g. /api/leads/123 to route template /api/leads/[id]
  let matched = false;
  
  // Check exact matches
  if (apiRoutesMap.has(cleanUrl)) {
    matched = true;
  } else {
    // Check dynamic parameters replacement
    // Check if it matches any pattern like /api/leads/[id]
    apiRoutesMap.forEach((_, apiRoute) => {
      const regexStr = "^" + apiRoute.replace(/\[\w+\]/g, "[^/]+") + "$";
      const regex = new RegExp(regexStr);
      if (regex.test(cleanUrl)) {
        matched = true;
      }
    });
  }

  if (!matched) {
    brokenApiEndpoints.push({
      fromFile,
      url
    });
  }
});

// ─── 4. ORPHAN PAGES DETECTION (REACHABILITY) ──────────────────────────
console.log("🕸️ Analyzing route reachability (Orphan page detection)...");

const linkGraph = new Map(); // route -> set of out-links

// Initialize graph
routesMap.forEach((_, route) => {
  linkGraph.set(route, new Set());
});
blogs.forEach((slug) => {
  linkGraph.set(`/blog/${slug}`, new Set());
});
locations.forEach((loc) => {
  linkGraph.set(`/online-pcod-treatment/${loc}`, new Set());
});

// Populate link graph
internalLinksInCode.forEach(({ link, route }) => {
  const cleanLink = link.split("?")[0].split("#")[0];
  if (route && linkGraph.has(route) && linkGraph.has(cleanLink)) {
    linkGraph.get(route).add(cleanLink);
  }
});

// Layout / Navigation globally reachable routes
const globalNavRoutes = new Set([
  "/",
  "/about",
  "/services",
  "/blog",
  "/contact",
  "/privacy-policy",
  "/terms-conditions",
  "/refund-policy",
  "/disclaimer",
  "/pcod-ayurvedic-treatment-online",
  "/online-pcod-treatment",
  "/trust",
  "/mobile-app"
]);

// Run Reachability Check (BFS) starting from global navigation & homepage
const reachableRoutes = new Set(globalNavRoutes);

// Explicitly link dynamic pages to their index/directory pages
blogs.forEach((slug) => {
  if (linkGraph.has("/blog")) {
    linkGraph.get("/blog").add(`/blog/${slug}`);
  }
});
locations.forEach((loc) => {
  if (linkGraph.has("/online-pcod-treatment")) {
    linkGraph.get("/online-pcod-treatment").add(`/online-pcod-treatment/${loc}`);
  }
});

const queue = Array.from(globalNavRoutes);

while (queue.length > 0) {
  const current = queue.shift();
  const outLinks = linkGraph.get(current);
  if (outLinks) {
    outLinks.forEach((link) => {
      if (!reachableRoutes.has(link)) {
        reachableRoutes.add(link);
        queue.push(link);
      }
    });
  }
}

// Find orphans (defined in app/ but not reachable from home page/navigation)
const orphanPages = [];
routesMap.forEach((_, route) => {
  // Skip admin routes since they require auth and aren't linked publicly
  if (route.startsWith("/admin") || route.startsWith("/api")) return;
  // Skip dynamic route folders
  if (route.includes("[")) return;
  
  if (!reachableRoutes.has(route)) {
    orphanPages.push(route);
  }
});

// Check blog orphans (if any blogs are not in reachable set)
const orphanBlogs = [];
blogs.forEach((slug) => {
  const route = `/blog/${slug}`;
  if (!reachableRoutes.has(route)) {
    orphanBlogs.push(route);
  }
});

// Check location orphans
const orphanLocations = [];
locations.forEach((loc) => {
  const route = `/online-pcod-treatment/${loc}`;
  if (!reachableRoutes.has(route)) {
    orphanLocations.push(route);
  }
});

// ─── 5. EXTERNAL LINK CHECKING ──────────────────────────────────────
console.log("🌐 Performing checks on external links (checking first 30 unique links for speed)...");

const uniqueExternalLinks = Array.from(new Set(externalLinksInCode.map(item => item.link)))
  .filter(link => !link.includes("localhost") && !link.includes("127.0.0.1"));

const brokenExternalLinks = [];

function checkUrl(urlStr) {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlStr);
      const options = {
        method: "HEAD",
        timeout: 5000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      };

      const requester = url.protocol === "https:" ? https : http;
      const req = requester.request(url, options, (res) => {
        if (res.statusCode >= 400 && res.statusCode !== 405) { // 405 Method Not Allowed could just mean it doesn't support HEAD
          // Try again with GET
          options.method = "GET";
          const getReq = requester.request(url, options, (getRes) => {
            if (getRes.statusCode >= 400) {
              resolve({ url: urlStr, status: getRes.statusCode, err: null });
            } else {
              resolve(null);
            }
          });
          getReq.on("error", (e) => resolve({ url: urlStr, status: null, err: e.message }));
          getReq.end();
        } else {
          resolve(null);
        }
      });

      req.on("error", (e) => {
        // Try with GET on error
        options.method = "GET";
        const getReq = requester.request(url, options, (getRes) => {
          if (getRes.statusCode >= 400) {
            resolve({ url: urlStr, status: getRes.statusCode, err: null });
          } else {
            resolve(null);
          }
        });
        getReq.on("error", (err2) => resolve({ url: urlStr, status: null, err: err2.message }));
        getReq.end();
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({ url: urlStr, status: "TIMEOUT", err: "Request timed out" });
      });

      req.end();
    } catch (e) {
      resolve({ url: urlStr, status: null, err: e.message });
    }
  });
}

// Check first 30 external links to avoid long execution times
const linksToCheck = uniqueExternalLinks.slice(0, 30);
const checkPromises = linksToCheck.map(link => checkUrl(link));
const checkResults = await Promise.all(checkPromises);

checkResults.forEach(res => {
  if (res) {
    brokenExternalLinks.push(res);
  }
});

// ─── 6. GENERATE MARKDOWN REPORT ─────────────────────────────────────
console.log("📝 Generating deep-audit-report.md...");

const reportLines = [
  "# Ayureva Deep Site Audit Report",
  "",
  "This report summarizes the results of the comprehensive static and dynamic checks run on the website codebase.",
  "",
  `Audit Run Time: **${new Date().toLocaleString()}**`,
  "",
  "---",
  "",
  "## Executive Summary",
  "",
  "| Category | Checked | Issues Found | Status |",
  "| :--- | :--- | :--- | :--- |",
  `| **Thin Pages** | ${routesMap.size + blogs.length} | ${thinPagesFound.length} | ${thinPagesFound.length > 0 ? "⚠️ Warning" : "✅ Pass"} |`,
  `| **Placeholders** | All files | ${placeholdersFound.length} | ${placeholdersFound.length > 0 ? "⚠️ Warning" : "✅ Pass"} |`,
  `| **Broken Internal Links** | ${internalLinksInCode.length} | ${brokenInternalLinks.length} | ${brokenInternalLinks.length > 0 ? "❌ Fail" : "✅ Pass"} |`,
  `| **Broken APIs** | ${apiRequestsInCode.length} | ${brokenApiEndpoints.length} | ${brokenApiEndpoints.length > 0 ? "❌ Fail" : "✅ Pass"} |`,
  `| **Orphan Pages** | ${routesMap.size + blogs.length + locations.length} | ${orphanPages.length + orphanBlogs.length + orphanLocations.length} | ${orphanPages.length > 0 ? "⚠️ Warning" : "✅ Pass"} |`,
  `| **Broken External Links** | ${linksToCheck.length} checked | ${brokenExternalLinks.length} | ${brokenExternalLinks.length > 0 ? "⚠️ Warning" : "✅ Pass"} |`,
  "",
  "---",
  "",
  "## 1. Thin Pages (Word Count Check)",
  "Pages that have very low text content (static pages < 300 words, blogs < 1800 words).",
  "",
  thinPagesFound.length === 0 ? "✅ No thin pages found." : `Found **${thinPagesFound.length}** thin page(s):`,
  ...thinPagesFound.map(p => `- **[${p.route}](file://${routesMap.get(p.route) || p.file})**: ${p.wordCount} words ${p.type ? `(${p.type})` : ""}`),
  "",
  "---",
  "",
  "## 2. Placeholders & TODOs",
  "Instances of Lorem Ipsum, TODOs, mock data, or draft elements found in the code.",
  "",
  placeholdersFound.length === 0 ? "✅ No placeholders or TODOs found." : `Found **${placeholdersFound.length}** instance(s):`,
  ...placeholdersFound.map(p => `- **[${path.basename(p.file)}](file://${p.file})** (Line ${p.line}): \`${p.type}\` -> \`${p.snippet.substring(0, 80)}\``),
  "",
  "---",
  "",
  "## 3. Broken Internal Links",
  "Links targeting routes that do not exist or are empty.",
  "",
  brokenInternalLinks.length === 0 ? "✅ No broken internal links found." : `Found **${brokenInternalLinks.length}** broken link(s):`,
  ...brokenInternalLinks.map(l => `- In **[${path.basename(l.fromFile)}](file://${l.fromFile})**: link to \`${l.target}\` (Referred from route: \`${l.sourceRoute || "Components/Layout"}\`)`),
  "",
  "---",
  "",
  "## 4. Broken/Non-Implemented API Requests",
  "Frontend requests targeting missing API endpoints.",
  "",
  brokenApiEndpoints.length === 0 ? "✅ All API requests target valid backend handlers." : `Found **${brokenApiEndpoints.length}** broken API target(s):`,
  ...brokenApiEndpoints.map(a => `- In **[${path.basename(a.fromFile)}](file://${a.fromFile})**: request to \`${a.url}\``),
  "",
  "---",
  "",
  "## 5. Orphan Pages",
  "Pages that are defined but cannot be navigated to from the main page (`/`) or navigation headers/footers.",
  "",
  "### Orphan Public Pages",
  orphanPages.length === 0 ? "✅ No orphan public pages found." : `Found **${orphanPages.length}** orphan page(s):`,
  ...orphanPages.map(r => `- **[${r}](file://${routesMap.get(r)})**`),
  "",
  `### Orphan Blogs (${orphanBlogs.length} found)`,
  orphanBlogs.length === 0 ? "✅ All blogs are reachable." : "The following blog posts are not linked from any list or homepage:",
  ...orphanBlogs.slice(0, 10).map(r => `- \`${r}\``),
  orphanBlogs.length > 10 ? `...and ${orphanBlogs.length - 10} more.` : "",
  "",
  `### Orphan pSEO Locations (${orphanLocations.length} found)`,
  orphanLocations.length === 0 ? "✅ All pSEO location pages are reachable." : "The following location landing pages are not linked:",
  ...orphanLocations.slice(0, 10).map(r => `- \`${r}\``),
  orphanLocations.length > 10 ? `...and ${orphanLocations.length - 10} more.` : "",
  "",
  "---",
  "",
  "## 6. Broken External Links",
  "External resources that return non-200 codes (first 30 unique checked).",
  "",
  brokenExternalLinks.length === 0 ? "✅ No broken external links found in sample." : `Found **${brokenExternalLinks.length}** broken/suspicious link(s):`,
  ...brokenExternalLinks.map(l => `- **${l.url}** - Status: \`${l.status}\` | Error: \`${l.err || "None"}\``)
];

const auditReportContent = reportLines.join("\n");
const reportPath = path.join(projectRoot, "deep-audit-report.md");
console.log("DEBUG WRITING REPORT:");
console.log("typeof reportPath:", typeof reportPath, "value:", reportPath);
console.log("typeof auditReportContent:", typeof auditReportContent, "value length:", auditReportContent ? auditReportContent.length : "null/undefined");
fs.writeFileSync(reportPath, auditReportContent);
console.log(`✅ Audit Report written to ${reportPath}`);

console.log("\n=== AUDIT SUMMARY ===");
console.log(`Thin Pages: ${thinPagesFound.length}`);
console.log(`Placeholders: ${placeholdersFound.length}`);
console.log(`Broken Internal Links: ${brokenInternalLinks.length}`);
console.log(`Broken APIs: ${brokenApiEndpoints.length}`);
console.log(`Orphan Pages: ${orphanPages.length}`);
console.log(`Broken External Links: ${brokenExternalLinks.length}`);
console.log("=====================\n");
