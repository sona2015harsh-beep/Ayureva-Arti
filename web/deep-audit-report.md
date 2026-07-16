# Ayureva Deep Site Audit Report

This report summarizes the results of the comprehensive static and dynamic checks run on the website codebase.

Audit Run Time: **7/16/2026, 5:53:22 PM**

---

## Executive Summary

| Category | Checked | Issues Found | Status |
| :--- | :--- | :--- | :--- |
| **Thin Pages** | 70 | 8 | ⚠️ Warning |
| **Placeholders** | All files | 50 | ⚠️ Warning |
| **Broken Internal Links** | 65 | 0 | ✅ Pass |
| **Broken APIs** | 18 | 0 | ✅ Pass |
| **Orphan Pages** | 144 | 2 | ⚠️ Warning |
| **Broken External Links** | 0 checked | 0 | ✅ Pass |

---

## 1. Thin Pages (Word Count Check)
Pages that have very low text content (static pages < 300 words, blogs < 1800 words).

Found **8** thin page(s):
- **[/ayurveda-suggestions](file:///Users/ashwanikumar/Ayureva-Arti/web/app/ayurveda-suggestions/page.tsx)**: 2 words 
- **[/blog](file:///Users/ashwanikumar/Ayureva-Arti/web/app/blog/page.tsx)**: 85 words 
- **[/booking-confirmed](file:///Users/ashwanikumar/Ayureva-Arti/web/app/booking-confirmed/page.tsx)**: 62 words 
- **[/download](file:///Users/ashwanikumar/Ayureva-Arti/web/app/download/page.tsx)**: 209 words 
- **[/online-pcod-treatment](file:///Users/ashwanikumar/Ayureva-Arti/web/app/online-pcod-treatment/page.tsx)**: 242 words 
- **[/blog/which-fruit-is-best-for-pcos-in-ayurveda](file://lib/blog-data.ts)**: 891 words (Blog Post)
- **[/blog/can-ayurveda-cure-pcod-permanently](file://lib/blog-data.ts)**: 716 words (Blog Post)
- **[/blog/is-ashwagandha-good-for-pcos](file://lib/blog-data.ts)**: 560 words (Blog Post)

---

## 2. Placeholders & TODOs
Instances of Lorem Ipsum, TODOs, mock data, or draft elements found in the code.

Found **50** instance(s):
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/coupons/page.tsx)** (Line 94): `Placeholder` -> `<input name="code" type="text" required placeholder="e.g. AYU20" className="w-fu`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/coupons/page.tsx)** (Line 118): `Placeholder` -> `<input name="usage_limit" type="number" min="1" placeholder="Unlimited" classNam`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/courses/[id]/page.tsx)** (Line 72): `Placeholder` -> `placeholder="Module Title (e.g., Chapter 1)"`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/leads/page.tsx)** (Line 264): `Placeholder` -> `placeholder="Search by student name or phone..."`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/leads/page.tsx)** (Line 445): `Placeholder` -> `placeholder="Write medical history summaries, consultation timings request, or f`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/leads/page.tsx)** (Line 456): `Placeholder` -> `placeholder="e.g. Sent pricing catalog on WhatsApp"`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/live-classes/page.tsx)** (Line 259): `Placeholder` -> `placeholder="Agenda or details about the class..."`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/notifications/page.tsx)** (Line 79): `Placeholder` -> `placeholder="e.g. Live Class Starting!"`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/notifications/page.tsx)** (Line 90): `Placeholder` -> `placeholder="Write your update here..."`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/notifications/page.tsx)** (Line 112): `Placeholder` -> `placeholder="Leave empty for ALL users"`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/[id]/page.tsx)** (Line 268): `TODO` -> `<p className="dark:text-gray-300">Today</p> {/* Todo: formatted date */}`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/[id]/page.tsx)** (Line 190): `Placeholder` -> `placeholder={['c', 'd'].includes(opt) ? "(Optional)" : "Required"}`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/[id]/page.tsx)** (Line 203): `Placeholder` -> `placeholder="Explain the answer..."`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/create/page.tsx)** (Line 75): `Placeholder` -> `placeholder="e.g., Ayurveda Basics Module Quiz"`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/create/page.tsx)** (Line 86): `Placeholder` -> `placeholder="Describe what this quiz covers..."`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/create/page.tsx)** (Line 123): `Placeholder` -> `placeholder="Optional (Leave empty for no limit)"`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/create/page.tsx)** (Line 142): `Placeholder` -> `placeholder="UUID of the video"`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/create/page.tsx)** (Line 156): `Placeholder` -> `placeholder="UUID of the module"`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/create/page.tsx)** (Line 169): `Placeholder` -> `placeholder="UUID of the course"`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/create/page.tsx)** (Line 101): `Mock Content/Data` -> `<option value="MOCK">Mock Test (Standalone)</option>`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/page.tsx)** (Line 11): `Mock Content/Data` -> `type: 'VIDEO' | 'MODULE' | 'SUBJECT' | 'MOCK';`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/page.tsx)** (Line 49): `Mock Content/Data` -> `case 'MOCK': return <Brain className="text-purple-500" />;`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/page.tsx)** (Line 58): `Mock Content/Data` -> `case 'MOCK': return 'Mock Test';`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/page.tsx)** (Line 68): `Mock Content/Data` -> `<h1 className="text-2xl font-bold dark:text-white">Quizzes & Mock Tests</h1>`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/page.tsx)** (Line 80): `Mock Content/Data` -> `{['ALL', 'MOCK', 'SUBJECT', 'MODULE', 'VIDEO'].map((type) => (`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/quizzes/page.tsx)** (Line 101): `Mock Content/Data` -> `<p className="mt-1 text-sm text-gray-500">Get started by creating a new quiz or `
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/(protected)/video-library/page.tsx)** (Line 110): `Placeholder` -> `placeholder="Search videos..."`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/login/page.tsx)** (Line 88): `Placeholder` -> `className="block w-full rounded-xl border-0 bg-white/5 py-3.5 pl-10 text-white s`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/login/page.tsx)** (Line 89): `Placeholder` -> `placeholder="Admin Email"`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/login/page.tsx)** (Line 104): `Placeholder` -> `className="block w-full rounded-xl border-0 bg-white/5 py-3.5 pl-10 text-white s`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/admin/login/page.tsx)** (Line 105): `Placeholder` -> `placeholder="Password"`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/blog/[slug]/page.tsx)** (Line 219): `Placeholder` -> `src={rp.image || "/placeholder-blog.jpg"}`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/download/page.tsx)** (Line 66): `Mock Content/Data` -> `Install the Ayureva mobile app directly on your Android device to access live cl`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/mobile-app/page.tsx)** (Line 10): `Mock Content/Data` -> `description: 'Master Ayurveda with Dr. Arti Singh. Access video lectures, mock t`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/mobile-app/page.tsx)** (Line 20): `Mock Content/Data` -> `"Smart Mock Tests with All India Ranking",`
- **[page.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/app/mobile-app/page.tsx)** (Line 70): `Mock Content/Data` -> `{/* Mobile Mockup Area */}`
- **[CallbackModal.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/CallbackModal.tsx)** (Line 90): `Placeholder` -> `<Input id="full_name" name="full_name" placeholder="Dr. John Doe" required />`
- **[CallbackModal.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/CallbackModal.tsx)** (Line 94): `Placeholder` -> `<Input id="phone_number" name="phone_number" type="tel" placeholder="+91 98765 4`
- **[CallbackModal.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/CallbackModal.tsx)** (Line 98): `Placeholder` -> `<Textarea id="message" name="message" placeholder="I have a query about AIAPGT C`
- **[consultation-popup.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/consultation-popup.tsx)** (Line 203): `Placeholder` -> `placeholder="Your First Name *"`
- **[consultation-popup.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/consultation-popup.tsx)** (Line 214): `Placeholder` -> `placeholder="Your Best Email Address *"`
- **[consultation-popup.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/consultation-popup.tsx)** (Line 225): `Placeholder` -> `placeholder="WhatsApp Number (For instant PDF delivery) *"`
- **[contact-section.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/contact-section.tsx)** (Line 363): `Placeholder` -> `<Input name="firstName" placeholder="Enter your first name" required disabled={i`
- **[contact-section.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/contact-section.tsx)** (Line 367): `Placeholder` -> `<Input name="lastName" placeholder="Enter your last name" required disabled={isS`
- **[contact-section.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/contact-section.tsx)** (Line 376): `Placeholder` -> `placeholder="Enter your email address"`
- **[contact-section.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/contact-section.tsx)** (Line 402): `Placeholder` -> `placeholder="e.g. 9876543210"`
- **[contact-section.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/contact-section.tsx)** (Line 415): `Placeholder` -> `placeholder="Please describe your health concerns, symptoms, or questions in det`
- **[input.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/ui/input.tsx)** (Line 11): `Placeholder` -> `"file:text-foreground placeholder:text-muted-foreground selection:bg-primary sel`
- **[select.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/ui/select.tsx)** (Line 22): `Placeholder` -> `"flex h-10 w-full items-center justify-between rounded-md border border-input bg`
- **[textarea.tsx](file:///Users/ashwanikumar/Ayureva-Arti/web/components/ui/textarea.tsx)** (Line 10): `Placeholder` -> `"border-input placeholder:text-muted-foreground focus-visible:border-ring focus-`

---

## 3. Broken Internal Links
Links targeting routes that do not exist or are empty.

✅ No broken internal links found.

---

## 4. Broken/Non-Implemented API Requests
Frontend requests targeting missing API endpoints.

✅ All API requests target valid backend handlers.

---

## 5. Orphan Pages
Pages that are defined but cannot be navigated to from the main page (`/`) or navigation headers/footers.

### Orphan Public Pages
Found **2** orphan page(s):
- **[/ayurveda-suggestions](file:///Users/ashwanikumar/Ayureva-Arti/web/app/ayurveda-suggestions/page.tsx)**
- **[/booking-confirmed](file:///Users/ashwanikumar/Ayureva-Arti/web/app/booking-confirmed/page.tsx)**

### Orphan Blogs (0 found)
✅ All blogs are reachable.


### Orphan pSEO Locations (0 found)
✅ All pSEO location pages are reachable.


---

## 6. Broken External Links
External resources that return non-200 codes (first 30 unique checked).

✅ No broken external links found in sample.