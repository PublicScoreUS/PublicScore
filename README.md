# PublicScore.us

A modern, searchable public accountability platform built with Next.js, PostgreSQL, and Supabase.

**Mission**: Research public office without spin. Facts without bias. Accountability without agenda.

## Features (MVP)

- ✅ Searchable directory of 540+ elected officials (House, Senate, Governors)
- ✅ Voting records and bill tracking
- ✅ Campaign finance data (donations, PACs, donor breakdown)
- ✅ Official profile pages with sourced information
- ✅ Mobile-responsive design
- ✅ SEO optimized (static site generation)
- ✅ Automated data syncing from ProPublica and FEC APIs
- ✅ Simple admin dashboard for content review

## Tech Stack

- **Frontend**: Next.js 14, React, CSS Modules
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **Search**: PostgreSQL Full-Text Search
- **Hosting**: Netlify
- **Cron Jobs**: GitHub Actions
- **Deployment**: Automatic (git push → deploy)

## Quick Start

### Prerequisites
- Node.js 18+
- Git
- Supabase account (free)
- ProPublica API key (free)
- Netlify account (free)

### Setup

```bash
# Clone the repository
git clone https://github.com/PublicScoreUS/PublicScore
cd PublicScore

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your API keys

# Run locally
npm run dev
```

Visit `http://localhost:3000`

### Deploy

1. Push to GitHub
2. Connect to Netlify
3. Set environment variables
4. Deploy

## Project Structure

```
PublicScore/
├── .github/workflows/     # GitHub Actions
├── components/           # React components
├── lib/                  # Database utilities
├── pages/                # Next.js pages
│   ├── index.js
│   ├── search.js
│   ├── api/
│   │   ├── search.js
│   │   ├── autocomplete.js
│   │   └── sync/votes.js
│   └── officials/[id].js
├── public/              # Static files
├── styles/              # CSS modules
├── netlify.toml        # Netlify config
├── next.config.js      # Next.js config
├── package.json
└── README.md
```

## Data Sources

- **Voting Records**: ProPublica Congress API (free)
- **Campaign Finance**: FEC.gov API (free)
- **Official Info**: Congress.gov, Senate.gov
- **Bills**: Congress.gov API

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY    # Supabase public key
SUPABASE_SERVICE_ROLE_KEY        # Supabase service key
PROPUBLICA_API_KEY               # ProPublica Congress API
FEC_API_KEY                      # Federal Election Commission API
ADMIN_TOKEN                      # Admin authentication secret
CRON_SECRET                      # Cron job authentication
ANTHROPIC_API_KEY               # Claude API (optional)
```

## Roadmap

### MVP (30-45 days) ✅
- [x] Homepage and search
- [x] Official profiles
- [x] Voting records
- [x] Campaign finance basics
- [x] Automated data sync
- [x] Mobile responsive

### Phase 2 (Month 2-3)
- [ ] State legislatures
- [ ] Media outlet profiles
- [ ] Advanced comparison tool
- [ ] Government spending
- [ ] AI-assisted summaries

### Phase 3 (Month 4+)
- [ ] Local officials
- [ ] Promise tracking
- [ ] Accountability indexes
- [ ] Public API
- [ ] Browser extension

## License

MIT - See LICENSE file

---

**Built with ❤️ for public accountability and transparency.**
