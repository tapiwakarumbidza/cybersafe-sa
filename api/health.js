/**
 * API Endpoint: /api/health
 * Purpose: Health check for monitoring
 * Method: GET
 */

export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return health status
  res.status(200).json({
    status: 'ok',
    version: '1.0',
    timestamp: new Date().toISOString(),
  });
}
