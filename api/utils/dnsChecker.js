/**
 * DNS Verification Utility
 * Purpose: Check SPF, DKIM, DMARC records for email security assessment
 * Uses native Node.js dns.promises module (zero external dependencies)
 */

import dns from 'dns/promises';

// DNS timeout configuration (5 seconds per spec)
const DNS_TIMEOUT = 5000;

/**
 * Wraps DNS query with timeout
 * @param {Promise} promise - DNS query promise
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Resolved or timed out promise
 */
function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DNS query timeout')), timeout)
    ),
  ]);
}

/**
 * Check SPF record
 * @param {string} domain - Domain to check
 * @returns {Promise<{exists: boolean, valid: boolean, record?: string, error?: string}>}
 */
export async function checkSPF(domain) {
  try {
    const records = await withTimeout(dns.resolveTxt(domain), DNS_TIMEOUT);
    
    // Find SPF record (v=spf1)
    const spfRecord = records
      .flat()
      .find((record) => record.startsWith('v=spf1'));

    if (!spfRecord) {
      return { exists: false, valid: false };
    }

    // CRITICAL FIX: SPF validation should check for proper termination
    // Valid SPF must contain 'all' mechanism (with qualifier: +all, -all, ~all, ?all)
    // This indicates how to handle emails that don't match SPF rules
    const hasValidTermination = spfRecord.includes('all');

    return {
      exists: true,
      valid: hasValidTermination,
      record: spfRecord,
    };
  } catch (error) {
    // NODATA, NOTFOUND, TIMEOUT
    return {
      exists: false,
      valid: false,
      error: error.code === 'ENODATA' || error.code === 'ENOTFOUND' 
        ? 'No SPF record found' 
        : error.message,
    };
  }
}

/**
 * Check DKIM records using common selectors
 * @param {string} domain - Domain to check
 * @returns {Promise<{exists: boolean, valid: boolean, selectors?: string[], error?: string}>}
 */
export async function checkDKIM(domain) {
  // Common DKIM selectors used by email providers
  const selectors = [
    'default',
    'selector1',
    'selector2',
    'google',
    'k1',
    's1',
    'dkim',
    'mail',
  ];

  const foundSelectors = [];
  
  try {
    // Check all selectors in parallel
    const results = await Promise.allSettled(
      selectors.map((selector) =>
        withTimeout(
          dns.resolveTxt(`${selector}._domainkey.${domain}`),
          DNS_TIMEOUT
        ).then(() => selector)
      )
    );

    // Collect successful selectors
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        foundSelectors.push(result.value);
      }
    });

    if (foundSelectors.length === 0) {
      return { exists: false, valid: false };
    }

    // CRITICAL FIX: Add confidence level - DKIM check is presence-only
    // We're checking for DKIM record existence, not validating signatures
    // This is a security limitation - we can't verify actual email signatures
    return {
      exists: true,
      valid: true,
      selectors: foundSelectors,
      confidence: 'presence-only', // Cannot validate actual email signatures
    };
  } catch (error) {
    return {
      exists: false,
      valid: false,
      error: error.message,
    };
  }
}

/**
 * Check DMARC record
 * @param {string} domain - Domain to check
 * @returns {Promise<{exists: boolean, valid: boolean, policy?: string, record?: string, error?: string}>}
 */
export async function checkDMARC(domain) {
  try {
    const records = await withTimeout(
      dns.resolveTxt(`_dmarc.${domain}`),
      DNS_TIMEOUT
    );

    // DMARC record should start with v=DMARC1
    const dmarcRecord = records
      .flat()
      .find((record) => record.startsWith('v=DMARC1'));

    if (!dmarcRecord) {
      return { exists: false, valid: false };
    }

    // Extract policy (p=none|quarantine|reject)
    const policyMatch = dmarcRecord.match(/p=(none|quarantine|reject)/i);
    const policy = policyMatch ? policyMatch[1].toLowerCase() : 'none';

    return {
      exists: true,
      valid: true,
      policy,
      record: dmarcRecord,
    };
  } catch (error) {
    return {
      exists: false,
      valid: false,
      error: error.code === 'ENODATA' || error.code === 'ENOTFOUND'
        ? 'No DMARC record found'
        : error.message,
    };
  }
}

/**
 * Perform all DNS checks for a domain
 * @param {string} domain - Domain to check
 * @returns {Promise<{spf: object, dkim: object, dmarc: object}>}
 */
export async function performDNSChecks(domain) {
  const [spf, dkim, dmarc] = await Promise.all([
    checkSPF(domain),
    checkDKIM(domain),
    checkDMARC(domain),
  ]);

  return { spf, dkim, dmarc };
}
