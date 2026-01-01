/**
 * Phishing Risk Scoring Engine
 * Purpose: Calculate phishing readiness score based on v2.1 model
 * 
 * Scoring Model:
 * - Pillar 1: Human Vulnerability (45%)
 * - Pillar 2: Email Infrastructure (35%)
 * - Pillar 3: Financial Process Controls (20%)
 * 
 * Risk Levels:
 * - 0-30: LOW (strong controls)
 * - 31-60: MEDIUM (exploitable gaps)
 * - 61-100: HIGH (active vulnerability)
 */

// Question weights as per v2.1 specification
export const QUESTION_WEIGHTS = {
  // Pillar 1: Human Vulnerability (45%)
  q1: 0.10,  // Regular phishing awareness training
  q2: 0.10,  // Phishing simulations in last 12 months
  q3: 0.08,  // Safe reporting culture
  q4: 0.09,  // Controls updated after incidents
  q5: 0.08,  // Unique passwords enforced

  // Pillar 2: Email Infrastructure (35%)
  q6: 0.07,  // SPF configured
  q7: 0.07,  // DKIM enabled
  q8: 0.09,  // DMARC enabled
  q9: 0.06,  // DMARC policy enforced (quarantine/reject)
  q10: 0.06, // MFA enforced on email accounts

  // Pillar 3: Financial Process Controls (20%)
  q11: 0.08, // Phone verification for banking changes
  q12: 0.06, // Dual approval for payments > R10,000
  q13: 0.06, // Cross-channel verification for requests
};

// Pillar definitions
export const PILLARS = {
  human: ['q1', 'q2', 'q3', 'q4', 'q5'],
  infrastructure: ['q6', 'q7', 'q8', 'q9', 'q10'],
  financial: ['q11', 'q12', 'q13'],
};

/**
 * Calculate total risk score
 * @param {Object} responses - Question responses (qX: 0 or 100)
 * @returns {number} Total risk score (0-100)
 */
export function calculateTotalScore(responses) {
  let totalScore = 0;

  for (const [questionId, riskValue] of Object.entries(responses)) {
    const weight = QUESTION_WEIGHTS[questionId];
    
    if (weight === undefined) {
      throw new Error(`Invalid question ID: ${questionId}`);
    }

    if (riskValue !== 0 && riskValue !== 100) {
      throw new Error(`Invalid risk value for ${questionId}: must be 0 or 100`);
    }

    totalScore += weight * riskValue;
  }

  // CRITICAL FIX: Use Math.ceil to overestimate risk (security principle)
  // Security tools should err on the side of caution
  return Math.ceil(totalScore);
}

/**
 * Calculate pillar-specific scores
 * @param {Object} responses - Question responses
 * @returns {Object} Pillar breakdown {human: X, infrastructure: Y, financial: Z}
 */
export function calculatePillarBreakdown(responses) {
  const breakdown = {};

  for (const [pillarName, questions] of Object.entries(PILLARS)) {
    let pillarScore = 0;

    for (const questionId of questions) {
      const riskValue = responses[questionId];
      const weight = QUESTION_WEIGHTS[questionId];

      if (riskValue !== undefined) {
        pillarScore += weight * riskValue;
      }
    }

    // Use Math.ceil for consistency with total score
    breakdown[pillarName] = Math.ceil(pillarScore);
  }

  return breakdown;
}

/**
 * Determine risk level from score
 * @param {number} score - Total risk score (0-100)
 * @returns {string} Risk level: LOW, MEDIUM, or HIGH
 */
export function determineRiskLevel(score) {
  if (score <= 30) return 'LOW';
  if (score <= 60) return 'MEDIUM';
  return 'HIGH';
}

/**
 * Convert DNS check results to risk values
 * @param {Object} dnsResults - Results from DNS checker
 * @returns {Object} Risk values for infrastructure questions
 */
export function dnsResultsToRiskValues(dnsResults) {
  const riskValues = {};

  // Q6: SPF configured
  riskValues.q6 = dnsResults.spf?.exists && dnsResults.spf?.valid ? 0 : 100;

  // Q7: DKIM enabled
  riskValues.q7 = dnsResults.dkim?.exists && dnsResults.dkim?.valid ? 0 : 100;

  // Q8: DMARC enabled
  riskValues.q8 = dnsResults.dmarc?.exists && dnsResults.dmarc?.valid ? 0 : 100;

  // Q9: DMARC policy enforced (quarantine/reject)
  const dmarcPolicy = dnsResults.dmarc?.policy;
  riskValues.q9 = 
    dmarcPolicy === 'quarantine' || dmarcPolicy === 'reject' ? 0 : 100;

  return riskValues;
}

/**
 * Main scoring function - calculates complete risk assessment
 * @param {Object} userResponses - User's answers (includes q1-q13)
 * @param {Object} dnsResults - Deprecated parameter (kept for backwards compatibility)
 * @returns {Object} Complete risk assessment
 */
export function calculateRiskAssessment(userResponses, dnsResults = null) {
  // All responses should already include q1-q13
  const allResponses = { ...userResponses };

  // Validate all questions are answered
  const requiredQuestions = Object.keys(QUESTION_WEIGHTS);
  const answeredQuestions = Object.keys(allResponses);
  
  const missingQuestions = requiredQuestions.filter(
    (q) => !answeredQuestions.includes(q)
  );

  if (missingQuestions.length > 0) {
    throw new Error(`Missing responses for: ${missingQuestions.join(', ')}`);
  }

  // Calculate scores
  const totalScore = calculateTotalScore(allResponses);
  const pillarBreakdown = calculatePillarBreakdown(allResponses);
  const riskLevel = determineRiskLevel(totalScore);

  return {
    totalScore,
    riskLevel,
    pillarBreakdown,
    questionResponses: allResponses,
  };
}

/**
 * Get human-readable pillar names and percentages
 * @returns {Object} Pillar metadata
 */
export function getPillarMetadata() {
  return {
    human: {
      name: 'Human Vulnerability',
      weight: 45,
      description: 'Staff awareness, training, and security culture',
    },
    infrastructure: {
      name: 'Email Infrastructure',
      weight: 35,
      description: 'Technical email security controls (SPF, DKIM, DMARC, MFA)',
    },
    financial: {
      name: 'Financial Process Controls',
      weight: 20,
      description: 'Verification procedures for financial transactions',
    },
  };
}
