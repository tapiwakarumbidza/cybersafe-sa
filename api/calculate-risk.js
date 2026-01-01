/**
 * API Endpoint: /api/calculate-risk
 * Purpose: Compute final phishing risk score
 * Method: POST
 * Input: { userResponses: {...}, technicalChecks: {...} }
 * Output: { totalScore, riskLevel, pillarBreakdown }
 */

import { calculateRiskAssessment } from './utils/scoringEngine.js';
import { checkRateLimit, getClientIP } from './utils/rateLimiter.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting (less strict than DNS checks)
  const clientIP = getClientIP(req);
  const rateLimit = checkRateLimit(clientIP, 'calculate-risk');

  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many calculation requests. Please try again later.',
      retryAfter,
    });
  }

  try {
    const { userResponses, technicalChecks } = req.body;

    if (!userResponses) {
      return res.status(400).json({ error: 'User responses are required' });
    }

    // Validate userResponses structure
    const responseKeys = Object.keys(userResponses);
    const validKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q10', 'q11', 'q12', 'q13'];
    
    const invalidKeys = responseKeys.filter(k => !validKeys.includes(k));
    if (invalidKeys.length > 0) {
      return res.status(400).json({ 
        error: `Invalid question IDs: ${invalidKeys.join(', ')}` 
      });
    }

    // Validate all values are 0 or 100
    for (const [key, value] of Object.entries(userResponses)) {
      if (value !== 0 && value !== 100) {
        return res.status(400).json({
          error: `Invalid value for ${key}: must be 0 or 100`,
        });
      }
    }

    // CRITICAL FIX: Default Q6-Q9 to maximum risk if not provided
    // Risk-assumed doctrine: if no DNS checks, assume worst case
    const allResponses = { ...userResponses };
    
    if (!technicalChecks || Object.keys(technicalChecks).length === 0) {
      allResponses.q6 = 100;  // No SPF = full risk
      allResponses.q7 = 100;  // No DKIM = full risk
      allResponses.q8 = 100;  // No DMARC = full risk
      allResponses.q9 = 100;  // No enforcement = full risk
    } else {
      Object.assign(allResponses, technicalChecks);
    }

    // Calculate risk assessment with complete responses
    const assessment = calculateRiskAssessment(allResponses, null);

    // Return results (no storage, processed in-memory only)
    res.status(200).json(assessment);
  } catch (error) {
    console.error('Risk calculation error:', error);
    res.status(500).json({
      error: 'Risk calculation failed',
      message: error.message,
    });
  }
}
