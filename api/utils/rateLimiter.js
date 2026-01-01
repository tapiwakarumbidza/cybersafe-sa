/**
 * Rate Limiter Utility
 * Purpose: Prevent API abuse without external dependencies
 * Strategy: In-memory IP tracking with sliding window
 * Limitation: Resets on server restart (acceptable for serverless)
 */

// In-memory storage: { ip: { count: number, resetAt: timestamp } }
const requestTracker = new Map();

// Configuration
const RATE_LIMIT = {
  DNS_CHECK: {
    maxRequests: 10,      // Max 10 DNS checks
    windowMs: 60 * 1000,  // Per 60 seconds (1 minute)
  },
  CALCULATE_RISK: {
    maxRequests: 20,      // Max 20 calculations
    windowMs: 60 * 1000,  // Per 60 seconds
  },
};

/**
 * Check if request exceeds rate limit
 * @param {string} ip - Client IP address
 * @param {string} endpoint - Endpoint identifier ('dns-check' or 'calculate-risk')
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function checkRateLimit(ip, endpoint) {
  const now = Date.now();
  const config = RATE_LIMIT[endpoint.toUpperCase().replace('-', '_')];

  if (!config) {
    throw new Error(`Unknown endpoint: ${endpoint}`);
  }

  const key = `${ip}:${endpoint}`;
  const record = requestTracker.get(key);

  // No prior requests or window expired
  if (!record || now > record.resetAt) {
    requestTracker.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  // Within rate limit window
  if (record.count < config.maxRequests) {
    record.count++;
    requestTracker.set(key, record);

    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetAt: record.resetAt,
    };
  }

  // Rate limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetAt: record.resetAt,
  };
}

/**
 * Extract client IP from request (handles proxies)
 * @param {Object} req - Express/Vercel request object
 * @returns {string} Client IP address
 */
export function getClientIP(req) {
  // Vercel/Cloudflare proxies
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Direct connection
  return req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown';
}

/**
 * Cleanup expired entries (run periodically to prevent memory leak)
 * In serverless environments, this is less critical since processes are short-lived
 */
export function cleanupExpiredEntries() {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, record] of requestTracker.entries()) {
    if (now > record.resetAt) {
      requestTracker.delete(key);
      cleaned++;
    }
  }

  return cleaned;
}

// Auto-cleanup every 5 minutes (only in long-running processes)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}
