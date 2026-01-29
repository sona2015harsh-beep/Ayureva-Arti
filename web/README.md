# Ayureva - Ayurvedic Women's Health Website

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sona2015harsh-4230s-projects/v0-ayurveda-health-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/DHhm8EsHv6A)

A modern, professional website for Dr. Arti Singh's Ayurvedic practice, specializing in women's health treatments including PCOS, PCOD, menstrual disorders, and fertility.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sona2015harsh-beep/Ayureva-Arti.git
   cd Ayureva-Arti
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your actual values:
   - `RESEND_API_KEY` - Get from [resend.com/api-keys](https://resend.com/api-keys)
   - `NEXT_PUBLIC_GA_ID` - Get from [Google Analytics](https://analytics.google.com)
   - `NEXT_PUBLIC_GOOGLE_VERIFICATION` - Get from [Google Search Console](https://search.google.com/search-console)

4. **Run development server**
   ```bash
   pnpm dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes | API key for email service (contact form) |
| `NEXT_PUBLIC_GA_ID` | Yes | Google Analytics tracking ID |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | No | Google Search Console verification code |

See `.env.example` for the template.

## 🛠️ Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## 🏗️ Tech Stack

- **Framework**: Next.js 15.5.9 (App Router)
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Email**: Resend API
- **Analytics**: Google Analytics 4
- **Deployment**: Vercel

## 📁 Project Structure

```
Ayureva-Arti/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── services/          # Services page
│   └── layout.tsx         # Root layout with metadata
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Site header
│   └── footer.tsx        # Site footer
├── actions/              # Server actions
│   └── contact-form.ts   # Contact form submission
├── lib/                  # Utilities
│   └── analytics.ts      # Analytics tracking
├── public/               # Static assets
└── styles/              # Global styles
```

## 🔒 Security

This project implements several security best practices:

- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ No exposed API keys or secrets
- ✅ Input validation with Zod
- ✅ Input sanitization with DOMPurify
- ✅ TypeScript for type safety
- ✅ Regular dependency updates

## 🚢 Deployment

The project is deployed on Vercel with automatic deployments from the `main` branch.

**Live URL**: [https://vercel.com/sona2015harsh-4230s-projects/v0-ayurveda-health-website](https://vercel.com/sona2015harsh-4230s-projects/v0-ayurveda-health-website)

## 📄 License

Private - © 2026 Ayureva by Dr. Arti Singh

## 🤝 Contributing

This is a private project. For issues or suggestions, please contact the development team.

---

**Built with** [v0.dev](https://v0.dev/chat/projects/DHhm8EsHv6A)
