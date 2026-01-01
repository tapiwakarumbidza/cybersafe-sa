/**
 * Domain Validation Utility
 * Purpose: Validate domain names before DNS queries
 * No external dependencies - defensive security approach
 */

/**
 * Validates domain format and common TLDs
 * @param {string} domain - Domain to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateDomain(domain) {
  if (!domain || typeof domain !== 'string') {
    return { valid: false, error: 'Domain is required' };
  }

  // Normalize: trim and lowercase
  const normalized = domain.trim().toLowerCase();

  // Length check (RFC 1035: max 253 characters)
  if (normalized.length === 0 || normalized.length > 253) {
    return { valid: false, error: 'Domain length must be between 1-253 characters' };
  }

  // Basic format validation
  // CRITICAL FIX: Relaxed TLD length from 2-11 to 2-24 to support new gTLDs
  // Examples: .photography (11), .accountants (11), .international (13)
  const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,24}$/;
  
  if (!domainPattern.test(normalized)) {
    return { valid: false, error: 'Invalid domain format' };
  }

  // Check for consecutive dots or hyphens
  if (normalized.includes('..') || normalized.includes('--')) {
    return { valid: false, error: 'Domain cannot contain consecutive dots or hyphens' };
  }

  // Check label length (each part between dots must be <= 63 chars)
  const labels = normalized.split('.');
  
  // CRITICAL: Prevent DNS abuse via deeply nested domains
  // Example attack: a.a.a.a.a.a.a.a.a.a.example.com (expensive DNS resolution)
  const MAX_LABELS = 10;
  if (labels.length > MAX_LABELS) {
    return { 
      valid: false, 
      error: `Domain has too many subdomains (max ${MAX_LABELS} levels)` 
    };
  }
  
  for (const label of labels) {
    if (label.length > 63) {
      return { valid: false, error: 'Domain label exceeds 63 characters' };
    }
    if (label.startsWith('-') || label.endsWith('-')) {
      return { valid: false, error: 'Domain labels cannot start or end with hyphens' };
    }
  }

  // CRITICAL FIX: Removed TLD whitelist restriction
  // All domains passing format validation are now accepted
  // This prevents false negatives on valid but uncommon TLDs
  // Security note: DNS resolver will handle non-existent domains naturally

  return { valid: true, normalized };
}

/**
 * Sanitizes domain for DNS queries (removes protocol, path, etc.)
 * @param {string} input - User input that might contain URL
 * @returns {string} Clean domain
 */
export function sanitizeDomain(input) {
  if (!input) return '';
  
  let clean = input.trim().toLowerCase();
  
  // Remove protocol
  clean = clean.replace(/^https?:\/\//, '');
  
  // Remove www. prefix
  clean = clean.replace(/^www\./, '');
  
  // Remove path, query, fragment
  clean = clean.split('/')[0].split('?')[0].split('#')[0];
  
  // Remove port
  clean = clean.split(':')[0];
  
  return clean;
}
