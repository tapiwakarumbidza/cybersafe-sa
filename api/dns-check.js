/**
 * API Endpoint: /api/dns-check
 * Purpose: Verify SPF, DKIM, DMARC for a domain
 * Method: POST
 * Input: { domain: "example.co.za" }
 * Output: { spf: {...}, dkim: {...}, dmarc: {...} }
 */

import { validateDomain, sanitizeDomain } from './utils/domainValidator.js';
import { performDNSChecks } from './utils/dnsChecker.js';
import { checkRateLimit, getClientIP } from './utils/rateLimiter.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CRITICAL: Rate limiting to prevent DNS abuse
  const clientIP = getClientIP(req);
  const rateLimit = checkRateLimit(clientIP, 'dns-check');

  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many DNS checks. Please try again later.',
      retryAfter, // seconds until rate limit resets
    });
  }

  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Sanitize and validate domain
    const cleanDomain = sanitizeDomain(domain);
    const validation = validateDomain(cleanDomain);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Perform DNS checks
    const dnsResults = await performDNSChecks(validation.normalized);

    // Return results
    res.status(200).json({
      domain: validation.normalized,
      ...dnsResults,
    });
  } catch (error) {
    console.error('DNS check error:', error);
    res.status(500).json({
      error: 'DNS check failed',
      message: error.message,
    });
  }
}
