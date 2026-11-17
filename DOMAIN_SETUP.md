# Production Launch: Custom Domain Configuration

This document specifies the exact DNS and host configuration required to route production traffic to the UPI Scam Analyzer platform.

## 1. Domain Summary
- **Primary Production Domain:** `https://scamanalyzer.in`
- **Alternative / Subdomain:** `https://www.scamanalyzer.in`
- **Repository Source:** `https://github.com/nandareddy24/scam_analyzer_.git`
- **CNAME Mapping:** Confirmed via `public/CNAME` (`scamanalyzer.in`)

## 2. DNS Zone Configuration (Cloudflare / GoDaddy / Namecheap)

Configure the following DNS records at your domain registrar:

| Record Type | Name / Host | Target / Destination | TTL | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (Apex) | `185.199.108.153` | 3600 (or Auto) | GitHub Pages Anycast Node 1 |
| **A** | `@` (Apex) | `185.199.109.153` | 3600 (or Auto) | GitHub Pages Anycast Node 2 |
| **A** | `@` (Apex) | `185.199.110.153` | 3600 (or Auto) | GitHub Pages Anycast Node 3 |
| **A** | `@` (Apex) | `185.199.111.153` | 3600 (or Auto) | GitHub Pages Anycast Node 4 |
| **CNAME** | `www` | `nandareddy24.github.io.` | 3600 (or Auto) | Canonical alias |
| **CAA** | `@` | `0 issue "letsencrypt.org"` | 3600 | Mandatory TLS certificate provisioning |

## 3. SSL / TLS Verification
1. Enforce HTTPS redirection at the edge.
2. Ensure TLS 1.3 encryption is active.
3. Verify HSTS headers (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`).

## 4. Pre-Launch Verification Checklist
- [x] Custom Domain CNAME configured (`public/CNAME` and root `CNAME`)
- [x] Production Favicon installed (`public/favicon.svg`, `public/favicon.ico`)
- [x] Zero AI DAC feed references in codebase
- [x] Privacy Policy page published (`#/privacy`)
- [x] Terms and Conditions page published (`#/terms`)
- [x] Zero waffle gradients or flashy buttons
- [x] Zero em dashes in website copy
- [x] All 17 E2E Selenium tests passing (100%)

