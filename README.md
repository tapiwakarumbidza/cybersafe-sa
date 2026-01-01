# CyberSafe-SA 🛡️

**Production-Ready Phishing Readiness Assessment Tool**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/cybersafe-sa)

A privacy-first web application that helps South African and New Zealand SMEs, NGOs, schools, and clinics assess their vulnerability to phishing attacks.

**Core Question:** *How likely is your organization to suffer financial or data loss due to phishing in the next 90 days?*

**Created by:** Tapiwa Karumbidza | **Date:** January 1, 2026

---

## 🎯 Key Features

- ✅ **13-Question Assessment** - Evaluates human, technical, and process controls
- ✅ **Automated DNS Verification** - Real-time SPF, DKIM, DMARC checks
- ✅ **Risk Scoring (0-100)** - Clear LOW/MEDIUM/HIGH risk levels
- ✅ **Prioritized Recommendations** - Sorted by impact, cost, and timeframe
- ✅ **Client-Side PDF Export** - Zero server-side data storage
- ✅ **POPIA Compliant** - Zero data retention, no tracking
- ✅ **Rate Limiting** - Built-in abuse protection (10 DNS/min per IP)
- ✅ **SA/NZ Context** - Tailored to BEC fraud, CEO impersonation, invoice scams

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server (with API support)
npm run dev

# Build for production
npm run build

# Test production build locally
npm run preview
```

**Development server:** `http://localhost:3000`  
**Production preview:** `http://localhost:4173`

---

## 📊 Scoring Model v2.1

| Pillar | Weight | Questions | Focus |
|--------|--------|-----------|-------|
| **Human Vulnerability** | 45% | Q1-Q5 | Training, simulations, reporting culture, password hygiene |
| **Email Infrastructure** | 35% | Q6-Q10 | SPF, DKIM, DMARC, DMARC enforcement, MFA |
| **Financial Process Controls** | 20% | Q11-Q13 | Banking verification, dual approval, cross-channel checks |

**Risk Levels:**
- **0-30 (LOW):** Strong controls in place
- **31-60 (MEDIUM):** Exploitable gaps exist
- **61-100 (HIGH):** Active vulnerability

**Scoring Logic:**
- Binary risk values: 0 (control present) or 100 (control missing)
- Weighted sum: `totalScore = Σ(weight × riskValue)`
- Uses `Math.ceil()` to overestimate risk (security principle)

---

## 🏗️ Architecture

### Frontend
- **React 18.3.1** + **Vite 5.0.8** - Fast HMR, modern build tooling
- **Tailwind CSS 3.3.6** - Utility-first styling with SA color palette
- **React Router 6.20.1** - Client-side routing
- **jsPDF 2.5.1** - Client-side PDF generation (zero server-side processing)

### Backend
- **Node.js Serverless Functions** - Vercel-compatible API endpoints
- **Native `dns.promises`** - Zero external dependencies for DNS queries
- **Express 4.18.2** - Local dev server only (not deployed)

### Security
- **Rate Limiting:** In-memory IP tracking (10 DNS/min, 20 calc/min)
- **Input Validation:** RFC 1035 compliance, label count limits
- **Domain Sanitization:** Strips protocols, paths, ports
- **Error Handling:** 5 HTTP status codes (200, 400, 405, 429, 500)

---

## 📁 Project Structure

```
cybersafe-sa/
├── api/                          # Serverless API routes
│   ├── calculate-risk.js         # Risk calculation endpoint
│   ├── dns-check.js              # DNS verification endpoint
│   ├── health.js                 # Health check endpoint
│   └── utils/                    # Backend utilities
│       ├── rateLimiter.js        # Rate limiting (10 DNS/min per IP)
│       ├── domainValidator.js    # Domain validation (RFC 1035)
│       ├── dnsChecker.js         # SPF/DKIM/DMARC verification
│       ├── scoringEngine.js      # Risk calculation (v2.1)
│       └── recommendationEngine.js # Prioritized recommendations
├── src/                          # React frontend
│   ├── pages/                    # Route components
│   │   ├── Landing.jsx           # Home page (domain input)
│   │   ├── Assessment.jsx        # 13-question form
│   │   ├── Results.jsx           # Risk score + PDF export
│   │   └── About.jsx             # Documentation + legal disclaimer
│   ├── components/
│   │   └── Layout.jsx            # Header/footer wrapper
│   ├── App.jsx                   # Route configuration
│   └── main.jsx                  # React entry point
├── server.js                     # Local dev server (Express + Vite)
├── vercel.json                   # Vercel deployment config
└── package.json                  # Dependencies
- **DNS Queries:** Native `dns.promises` module (no external APIs)
- **PDF Export:** jsPDF (client-side)
- **Database:** None (stateless by design)

## 📁 Project Structure

```
cybersafe-sa/
├── api/                    # Serverless API endpoints
│   ├── health.js          # Health check
│   ├── dns-check.js       # DNS verification
│   ├── calculate-risk.js  # Risk scoring
│   └── utils/             # Backend utilities
├── src/                   # React frontend
│   ├── components/        # Layout components
│   ├── pages/            # Page components
│   └── App.jsx           # Route configuration
├── vercel.json           # Vercel deployment config
└── package.json          # Dependencies
```

---

## 🔌 API Endpoints

### `GET /api/health`
Health check endpoint for monitoring

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-01T12:00:00.000Z",
  "service": "CyberSafe-SA API"
}
```

---

### `POST /api/dns-check`
Verify SPF, DKIM, DMARC records for a domain

**Request:**
```json
{
  "domain": "example.com"
}
```

**Response:**
```json
{
  "spf": {
    "exists": true,
    "valid": true,
    "record": "v=spf1 include:_spf.google.com ~all"
  },
  "dkim": {
    "exists": true,
    "valid": true,
    "selectors": ["google"],
    "confidence": "presence-only"
  },
  "dmarc": {
    "exists": true,
    "valid": true,
    "policy": "quarantine",
    "record": "v=DMARC1; p=quarantine; rua=mailto:admin@example.com"
  },
  "technicalChecks": {
    "q6": 0,
    "q7": 0,
    "q8": 0,
    "q9": 0
  }
}
```

**Rate Limit:** 10 requests/minute per IP

---

### `POST /api/calculate-risk`
Calculate phishing risk score based on assessment responses

**Request:**
```json
{
  "userResponses": {
    "q1": 0,
    "q2": 100,
    "q3": 0,
    "q4": 0,
    "q5": 0,
    "q10": 0,
    "q11": 100,
    "q12": 0,
    "q13": 0
  },
  "technicalChecks": {
    "q6": 0,
    "q7": 0,
    "q8": 0,
    "q9": 0
  }
}
```

**Response:**
```json
{
  "totalScore": 17,
  "riskLevel": "LOW",
  "pillarBreakdown": {
    "human": 10,
    "infrastructure": 0,
    "financial": 6
  },
  "questionResponses": {
    "q1": 0,
    "q2": 100,
    ...
  }
}
```

**Rate Limit:** 20 requests/minute per IP

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**See full deployment guide:** [`DEPLOYMENT.md`](./DEPLOYMENT.md)

---

### Manual Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy `dist/` folder to any static host (Netlify, Cloudflare Pages, etc.)

3. Deploy `api/` folder as serverless functions (AWS Lambda, Google Cloud Functions, etc.)

**Note:** Vercel auto-detects the project structure and handles both frontend + API.

---

## 🧪 Testing

### Manual API Testing

```bash
# Health check
curl https://your-app.vercel.app/api/health

# DNS check
curl -X POST https://your-app.vercel.app/api/dns-check \
  -H "Content-Type: application/json" \
  -d '{"domain":"google.com"}'

# Risk calculation
curl -X POST https://your-app.vercel.app/api/calculate-risk \
  -H "Content-Type: application/json" \
  -d '{"userResponses":{"q1":0,"q2":0,"q3":0,"q4":0,"q5":0,"q10":0,"q11":0,"q12":0,"q13":0},"technicalChecks":{"q6":0,"q7":0,"q8":0,"q9":0}}'
```

### Future: Automated Tests

```bash
# Run unit tests (coming soon)
npm test
```

**Planned test coverage:**
- `calculateTotalScore()` - Edge cases (29→LOW, 31→MEDIUM)
- `determineRiskLevel()` - Boundary testing
- `validateDomain()` - RFC compliance
- `checkRateLimit()` - Throttling logic

---

## 🔐 Security Features

### 1. Rate Limiting
- **DNS checks:** 10 requests/minute per IP
- **Risk calculations:** 20 requests/minute per IP
- **Implementation:** In-memory Map (resets per serverless instance)
- **Response:** HTTP 429 with `retryAfter` seconds

### 2. Input Validation
- **Domain format:** RFC 1035 compliance (max 253 chars, 63 per label)
- **Label count:** Max 10 subdomain levels (prevents `a.a.a.a.example.com` abuse)
- **Sanitization:** Strips protocols, www., paths, ports, query strings

### 3. DNS Query Protection
- **Timeout:** 5 seconds per query
- **Error handling:** Graceful failures (returns "not found" instead of crashing)
- **Parallel queries:** SPF/DKIM/DMARC checked simultaneously

### 4. Data Privacy
- **Zero storage:** No database, no logs, no session data
- **POPIA compliant:** No personal data collection
- **Client-side PDF:** Generated in browser (jsPDF), never sent to server
- **No tracking:** No analytics, no cookies, no fingerprinting

---

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (Express + Vite)
npm run dev
```

**Dev server features:**
- Hot module replacement (HMR)
- API routes available at `/api/*`
- No Vercel login required

---

### Environment Variables

This project has **zero secrets** (no database, no API keys).

If you add external services in the future:

```bash
# Add to Vercel
vercel env add VARIABLE_NAME
```

---

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Express + Vite dev server |
| `npm run dev:vite` | Start Vite only (no API routes) |
| `npm run dev:vercel` | Start Vercel dev server (requires login) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests (coming soon) |

---

## 📄 License

**MIT License** - Free to use, modify, and distribute.

See [`LICENSE`](./LICENSE) for details.

---

## 🙏 Acknowledgments

**Resources:**
- [SABRIC](https://www.sabric.co.za) - South African Banking Risk Information Centre
- [DMARC.org](https://dmarc.org) - Email authentication standards
- [RFC 7208](https://tools.ietf.org/html/rfc7208) - SPF specification
- [RFC 6376](https://tools.ietf.org/html/rfc6376) - DKIM specification
- [RFC 7489](https://tools.ietf.org/html/rfc7489) - DMARC specification

**Inspiration:**
- KnowBe4 Phishing Security Test
- NIST Cybersecurity Framework
- SANS Security Awareness Maturity Model

---

## 📞 Contact

**Creator:** Tapiwa Karumbidza  
**Project:** CyberSafe-SA  
**Date:** January 1, 2026

**Portfolio Project** - Built to demonstrate full-stack security engineering:
- Frontend development (React, Tailwind)
- Backend API design (RESTful, serverless)
- DNS verification (native Node.js)
- Security principles (rate limiting, input validation, error handling)
- Risk modeling (scoring engine v2.1)

---

## 🎯 Project Status

**Version:** 1.0.0  
**Status:** ✅ Production-Ready

**Completed:**
- [x] Full backend API (3 endpoints + 5 utilities)
- [x] Complete React frontend (4 pages + routing)
- [x] DNS verification (SPF, DKIM, DMARC)
- [x] Risk scoring engine (v2.1)
- [x] Recommendation engine
- [x] Client-side PDF export
- [x] Rate limiting (10 DNS/min, 20 calc/min)
- [x] Input validation (RFC 1035 + label count)
- [x] Error handling (5 HTTP status codes)
- [x] Creator attribution
- [x] Vercel deployment config

**Optional Enhancements:**
- [ ] Unit tests (5-10 core tests)
- [ ] Loading spinners (frontend UX)
- [ ] Error boundaries (React crash handling)
- [ ] Pillar score normalization (UX polish)
- [ ] Multi-language support (Afrikaans, Zulu, Xhosa)

---

**Built with 💚 by Tapiwa Karumbidza**
```json
{ "domain": "example.co.za" }
```

### `POST /api/calculate-risk`
Calculate phishing risk score from responses
```json
{
  "userResponses": { "q1": 0, "q2": 100, ... },
  "technicalChecks": { "q6": 0, "q7": 0, ... }
}
```

## 🔒 Privacy & POPIA Compliance

**What We DON'T Store:**
- ❌ Domain names
- ❌ Email addresses  
- ❌ Questionnaire responses
- ❌ Risk scores
- ❌ IP addresses

**How It Works:**
- All processing happens in-memory
- Data is never written to disk or database
- Results exist only in your browser
- PDF export is client-side only

## 🇿🇦 South African Threat Focus

Assessment tailored to common SA phishing patterns:
- Invoice Fraud
- CEO Impersonation
- SARS Scams
- WhatsApp Business Compromise
- Banking Credential Theft

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Deploy (zero configuration needed)

No environment variables required!

## 📚 Resources

- [SABRIC Cybersecurity Hub](https://www.sabric.co.za)
- [DMARC Resources](https://dmarc.org)
- [StaySafeOnline](https://www.staysafeonline.org)

## ⚖️ Legal

This tool is provided "as is" without warranty. Designed for defensive cybersecurity purposes only. Not a substitute for professional security audits.

## License

MIT License

---

**Built with ❤️ for South African organizations**

*Defensive Security | Zero Data Retention | POPIA Compliant*
