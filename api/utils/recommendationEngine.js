/**
 * Recommendation Engine
 * Purpose: Generate fix-first recommendations based on risk factors
 * Prioritizes high-impact, low-cost improvements
 */

import { QUESTION_WEIGHTS, PILLARS } from './scoringEngine.js';

// Question metadata with remediation guidance
export const QUESTION_METADATA = {
  q1: {
    question: 'Regular phishing awareness training for staff',
    pillar: 'human',
    impact: 'HIGH',
    cost: 'LOW',
    recommendation: {
      title: 'Implement Monthly Phishing Awareness Training',
      actions: [
        'Schedule 15-minute monthly security briefings',
        'Use free resources from SABRIC or StaySafeOnline',
        'Focus on South African threats: invoice fraud, CEO impersonation',
        'Make training relevant to roles (finance, HR, IT)',
      ],
      timeframe: '30 days to launch',
      resources: ['SABRIC Cybersecurity Hub', 'KnowBe4 free resources'],
    },
  },
  q2: {
    question: 'Phishing simulations conducted in last 12 months',
    pillar: 'human',
    impact: 'HIGH',
    cost: 'LOW',
    recommendation: {
      title: 'Run Quarterly Phishing Simulations',
      actions: [
        'Use free tools like Gophish (self-hosted)',
        'Test with realistic SA scenarios (SARS, banking, courier)',
        'Track click rates without punishing staff',
        'Use results to tailor training content',
      ],
      timeframe: '60 days to first test',
      resources: ['Gophish (open-source)', 'PhishMe simulators'],
    },
  },
  q3: {
    question: 'Safe reporting culture for suspicious emails',
    pillar: 'human',
    impact: 'MEDIUM',
    cost: 'FREE',
    recommendation: {
      title: 'Create Simple Phishing Reporting Process',
      actions: [
        'Set up dedicated email: security@yourdomain (or alias)',
        'Add "Report Phishing" button to email client (if possible)',
        'Acknowledge every report within 24 hours',
        'Never punish staff for reporting false positives',
      ],
      timeframe: '7 days to implement',
      resources: ['Email alias setup', 'Internal communication campaign'],
    },
  },
  q4: {
    question: 'Controls/training updated after incidents',
    pillar: 'human',
    impact: 'MEDIUM',
    cost: 'FREE',
    recommendation: {
      title: 'Establish Incident Review Process',
      actions: [
        'Document every phishing incident (template: who, what, impact)',
        'Review monthly: what worked, what failed',
        'Update training content based on real attacks',
        'Share lessons learned (anonymized) with all staff',
      ],
      timeframe: 'Immediate',
      resources: ['Incident response template'],
    },
  },
  q5: {
    question: 'Unique passwords enforced (policy or manager)',
    pillar: 'human',
    impact: 'HIGH',
    cost: 'LOW',
    recommendation: {
      title: 'Deploy Password Manager Organization-Wide',
      actions: [
        'Choose Bitwarden (free for small teams) or similar',
        'Mandate use for all work accounts',
        'Provide setup training (30 minutes per user)',
        'Block password reuse at system level if possible',
      ],
      timeframe: '30 days to full deployment',
      resources: ['Bitwarden', 'LastPass', 'KeePass'],
    },
  },
  q6: {
    question: 'SPF configured',
    pillar: 'infrastructure',
    impact: 'HIGH',
    cost: 'FREE',
    recommendation: {
      title: 'Configure SPF Record Immediately',
      actions: [
        'Add TXT record to DNS: "v=spf1 include:_spf.yourmailprovider.com ~all"',
        'Ask your email provider for exact SPF string',
        'Test with dmarcian.com or mxtoolbox.com',
        'Update within 24-48 hours (DNS propagation)',
      ],
      timeframe: '24-48 hours',
      resources: ['dmarcian.com', 'MXToolbox SPF checker'],
    },
  },
  q7: {
    question: 'DKIM enabled',
    pillar: 'infrastructure',
    impact: 'HIGH',
    cost: 'FREE',
    recommendation: {
      title: 'Enable DKIM Email Signing',
      actions: [
        'Contact your email provider (Microsoft 365, Google Workspace, etc.)',
        'Request DKIM activation and DNS records',
        'Add provided TXT records to your domain DNS',
        'Verify with mail-tester.com',
      ],
      timeframe: '48 hours',
      resources: ['Email provider documentation', 'mail-tester.com'],
    },
  },
  q8: {
    question: 'DMARC enabled',
    pillar: 'infrastructure',
    impact: 'CRITICAL',
    cost: 'FREE',
    recommendation: {
      title: 'Deploy DMARC Policy (Start with Monitoring)',
      actions: [
        'Add DNS TXT record: "_dmarc.yourdomain.com" → "v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com"',
        'Start with p=none to monitor without blocking',
        'Review reports weekly for 30 days',
        'Graduate to p=quarantine, then p=reject',
      ],
      timeframe: '1 hour to enable monitoring',
      resources: ['DMARC.org', 'dmarcian.com'],
    },
  },
  q9: {
    question: 'DMARC policy enforced (quarantine/reject)',
    pillar: 'infrastructure',
    impact: 'CRITICAL',
    cost: 'FREE',
    recommendation: {
      title: 'Enforce DMARC Policy to Quarantine/Reject',
      actions: [
        'After 30 days of p=none, upgrade to p=quarantine',
        'Monitor for legitimate email blocks (check rua reports)',
        'Fix any SPF/DKIM failures identified',
        'Final step: upgrade to p=reject for full protection',
      ],
      timeframe: '90 days (gradual escalation)',
      resources: ['DMARC monitoring tools', 'Email authentication reports'],
    },
  },
  q10: {
    question: 'MFA enforced on email accounts',
    pillar: 'infrastructure',
    impact: 'CRITICAL',
    cost: 'FREE',
    recommendation: {
      title: 'Mandate MFA for All Email Accounts',
      actions: [
        'Enable MFA in Microsoft 365, Google Workspace, or email provider',
        'Use authenticator apps (Microsoft/Google Authenticator)',
        'Enforce at admin level (disable bypass options)',
        'Provide user training: setup takes 5 minutes per person',
      ],
      timeframe: '14 days to full enforcement',
      resources: ['Microsoft Authenticator', 'Google Authenticator'],
    },
  },
  q11: {
    question: 'Phone verification for banking changes',
    pillar: 'financial',
    impact: 'CRITICAL',
    cost: 'FREE',
    recommendation: {
      title: 'Implement Phone Verification for Banking Changes',
      actions: [
        'Policy: All banking detail changes require phone confirmation',
        'Call back using independently verified number (not from email)',
        'Use pre-approved contact list (updated annually)',
        'Document every verification (date, time, who called)',
      ],
      timeframe: 'Immediate policy change',
      resources: ['Policy template', 'Verification log spreadsheet'],
    },
  },
  q12: {
    question: 'Dual approval for payments > R10,000',
    pillar: 'financial',
    impact: 'HIGH',
    cost: 'FREE',
    recommendation: {
      title: 'Require Dual Approval for Large Payments',
      actions: [
        'Set banking threshold at R10,000 (adjust for your risk)',
        'Require two authorized signatories (different people)',
        'Use banking app with dual authorization',
        'Review high-value payments weekly',
      ],
      timeframe: 'Immediate (update banking mandates)',
      resources: ['Bank authorization forms', 'Payment approval matrix'],
    },
  },
  q13: {
    question: 'Cross-channel verification for requests',
    pillar: 'financial',
    impact: 'HIGH',
    cost: 'FREE',
    recommendation: {
      title: 'Verify Financial Requests on Second Channel',
      actions: [
        'Email request → verify by phone call',
        'WhatsApp request → verify by email or in-person',
        'Never act on urgent payment requests without verification',
        'Train staff: "If it\'s urgent, it\'s suspicious"',
      ],
      timeframe: 'Immediate policy + training',
      resources: ['Verification protocol document', 'Staff awareness poster'],
    },
  },
};

/**
 * Generate prioritized recommendations based on risk assessment
 * @param {Object} assessment - Risk assessment from scoringEngine
 * @returns {Array} Sorted recommendations (high-impact first)
 */
export function generateRecommendations(assessment) {
  const { questionResponses } = assessment;
  const recommendations = [];

  // Identify failing questions (risk value = 100)
  for (const [questionId, riskValue] of Object.entries(questionResponses)) {
    if (riskValue === 100) {
      const metadata = QUESTION_METADATA[questionId];
      if (metadata) {
        recommendations.push({
          questionId,
          ...metadata,
          weight: QUESTION_WEIGHTS[questionId],
        });
      }
    }
  }

  // Sort by impact, then by weight (descending)
  const impactOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  recommendations.sort((a, b) => {
    const impactDiff = impactOrder[b.impact] - impactOrder[a.impact];
    if (impactDiff !== 0) return impactDiff;
    return b.weight - a.weight;
  });

  return recommendations;
}

/**
 * Get top 3 fix-first recommendations
 * @param {Object} assessment - Risk assessment
 * @returns {Array} Top 3 recommendations
 */
export function getTopRecommendations(assessment) {
  const allRecommendations = generateRecommendations(assessment);
  return allRecommendations.slice(0, 3);
}

/**
 * Generate executive summary
 * @param {Object} assessment - Risk assessment
 * @returns {Object} Summary with key insights
 */
export function generateExecutiveSummary(assessment) {
  const { totalScore, riskLevel, pillarBreakdown } = assessment;
  const recommendations = generateRecommendations(assessment);

  // Find weakest pillar
  const pillars = Object.entries(pillarBreakdown);
  const weakestPillar = pillars.reduce((max, curr) =>
    curr[1] > max[1] ? curr : max
  );

  // Count critical issues
  const criticalIssues = recommendations.filter(
    (r) => r.impact === 'CRITICAL'
  ).length;

  return {
    overallRisk: riskLevel,
    totalScore,
    weakestArea: weakestPillar[0],
    weakestAreaScore: weakestPillar[1],
    criticalIssues,
    totalIssues: recommendations.length,
    quickWins: recommendations.filter((r) => r.cost === 'FREE').length,
    estimatedFixTime: calculateEstimatedFixTime(recommendations),
  };
}

/**
 * Calculate estimated time to fix top issues
 * @param {Array} recommendations - All recommendations
 * @returns {string} Estimated time (e.g., "2-4 weeks")
 */
function calculateEstimatedFixTime(recommendations) {
  const top3 = recommendations.slice(0, 3);
  
  // Extract timeframes and estimate total (rough heuristic)
  const hasImmediate = top3.some((r) =>
    r.recommendation.timeframe.toLowerCase().includes('immediate')
  );
  const hasSlow = top3.some((r) =>
    parseInt(r.recommendation.timeframe) >= 30
  );

  if (hasImmediate && !hasSlow) return '1-2 weeks';
  if (hasSlow) return '4-8 weeks';
  return '2-4 weeks';
}
