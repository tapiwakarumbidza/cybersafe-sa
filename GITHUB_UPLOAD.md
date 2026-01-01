# 🚀 GitHub Upload & Vercel Auto-Deploy Guide

**Project:** CyberSafe-SA  
**Created by:** Tapiwa Karumbidza  
**Date:** January 1, 2026

---

## ⚡ QUICK GITHUB UPLOAD (5 MINUTES)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `cybersafe-sa`
3. **Description:** `Production-ready phishing readiness assessment tool with DNS verification and risk scoring`
4. **Visibility:** Public (recommended for portfolio)
5. **DO NOT** initialize with README (we have one)
6. Click **"Create repository"**

---

### Step 2: Push Code to GitHub

Copy and run these commands in PowerShell:

```powershell
# Navigate to project directory
cd C:\Users\Tapiwa\Desktop\cybersafe-sa

# Stage all files
git add .

# Commit with message
git commit -m "Initial commit: Production-ready phishing readiness tool with rate limiting"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cybersafe-sa.git

# Push to GitHub
git push -u origin main
```

**If you get "master" instead of "main":**
```powershell
git branch -M main
git push -u origin main
```

---

### Step 3: Connect Vercel to GitHub (Recommended)

**Option A: Automatic Deployment (Best Practice)**

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub account
4. Find `cybersafe-sa` repository
5. Click **"Import"**
6. Vercel will auto-detect:
   - Framework: **Vite** ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `dist` ✅
   - API Routes: `/api/*` ✅
7. Click **"Deploy"**

**Benefits:**
- ✅ Every `git push` auto-deploys
- ✅ Preview deployments for branches
- ✅ Rollback to any commit
- ✅ No manual `vercel --prod` needed

---

**Option B: Manual CLI Deploy**

If you prefer manual control:

```powershell
# From project directory
vercel --prod
```

---

## 📋 POST-DEPLOYMENT VERIFICATION

Once deployed, test your production URL:

### 1. Frontend Check
```
Visit: https://cybersafe-sa.vercel.app
```
- ✅ Landing page loads
- ✅ Navigation works
- ✅ Footer shows "Made by Tapiwa Karumbidza"

### 2. API Health Check
```powershell
curl https://cybersafe-sa.vercel.app/api/health
```
**Expected:**
```json
{"status":"healthy","timestamp":"...","service":"CyberSafe-SA API"}
```

### 3. DNS Verification Test
```powershell
curl -X POST https://cybersafe-sa.vercel.app/api/dns-check `
  -H "Content-Type: application/json" `
  -d '{\"domain\":\"google.com\"}'
```
**Expected:** JSON with SPF/DKIM/DMARC results

### 4. Rate Limiting Test
```powershell
# Run 11 times to trigger rate limit
for ($i=1; $i -le 11; $i++) {
  curl -X POST https://cybersafe-sa.vercel.app/api/dns-check `
    -H "Content-Type: application/json" `
    -d '{\"domain\":\"test.com\"}'
  Write-Host "Request $i"
}
```
**Expected:** Last request returns `429` with rate limit error

---

## 🎯 GITHUB REPOSITORY SETUP

### Add These to Your GitHub Repo:

#### 1. Repository Description
```
Production-ready phishing readiness assessment tool for SMEs. Features DNS verification (SPF/DKIM/DMARC), 3-pillar risk scoring, rate limiting, and client-side PDF export. POPIA-compliant. Built with React + Node.js serverless functions.
```

#### 2. Repository Topics (Tags)
```
phishing-detection
cybersecurity
dns-verification
risk-assessment
react
nodejs
vercel
serverless
security-tools
popia-compliance
```

#### 3. Add Deployment Badge to README

Add this at the top of your README.md:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/cybersafe-sa)
![Production](https://img.shields.io/badge/status-production-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
```

---

## 🔗 PORTFOLIO LINKS

After deployment, add these to your portfolio:

**Live Demo:** https://cybersafe-sa.vercel.app  
**GitHub:** https://github.com/YOUR_USERNAME/cybersafe-sa  
**Documentation:** See README.md

**Portfolio Description:**
> CyberSafe-SA: Production-ready phishing readiness assessment tool deployed on Vercel. Features automated DNS verification (SPF/DKIM/DMARC), 3-pillar risk scoring engine (Human 45%, Infrastructure 35%, Financial 20%), IP-based rate limiting (10 DNS/min), and zero data retention (POPIA-compliant). Built with React 18, Vite 5, Node.js serverless functions, and native dns.promises (zero external dependencies). Handles 5-second DNS timeouts, uses Math.ceil for security-first scoring, and exports client-side PDFs.

---

## 🎉 SUCCESS CHECKLIST

Your project is **DEPLOYED** when:

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel connected to GitHub repo
- [ ] Deployment successful
- [ ] Production URL accessible
- [ ] Health endpoint returns 200
- [ ] DNS checks work
- [ ] Rate limiting triggers
- [ ] PDF export works
- [ ] Footer shows your name

---

## 🏆 WHAT YOU ACCOMPLISHED

You built and deployed:

✅ **Full-stack security assessment tool**  
✅ **3 API endpoints** with rate limiting  
✅ **5 backend utilities** (validators, checkers, engines)  
✅ **4 React pages** with routing  
✅ **DNS verification** (SPF/DKIM/DMARC)  
✅ **Risk scoring** (0-100 with Math.ceil bias)  
✅ **Zero data retention** (POPIA-compliant)  
✅ **Production deployment** (Vercel serverless)  

**Technologies:**
- React 18 + Vite 5 + Tailwind CSS 3
- Node.js serverless functions
- Native DNS queries (zero dependencies)
- In-memory rate limiting
- Client-side PDF generation

**Security Features:**
- Rate limiting (10 DNS/min per IP)
- Input validation (RFC 1035)
- Domain sanitization
- DNS timeout handling (5s)
- Math.ceil risk overestimation
- Error handling (5 HTTP codes)

---

## 📞 NEXT STEPS

1. **Push to GitHub** (commands above)
2. **Connect Vercel** (automatic deploys)
3. **Verify production** (run API tests)
4. **Add to portfolio** (live demo + GitHub link)
5. **Update LinkedIn** (post about project)

---

**Ready to push?**

Run these commands now:

```powershell
cd C:\Users\Tapiwa\Desktop\cybersafe-sa
git add .
git commit -m "Initial commit: Production-ready phishing readiness tool"
git remote add origin https://github.com/YOUR_USERNAME/cybersafe-sa.git
git push -u origin main
```

Then connect Vercel at: https://vercel.com/new

---

**Created by Tapiwa Karumbidza**  
January 1, 2026

🎉 **You did it. Ship it.**
