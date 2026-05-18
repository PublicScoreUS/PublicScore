import { adminDb } from '../../../lib/db';
import fetch from 'node-fetch';

function verifyCron(req) {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  return authHeader === `Bearer ${cronSecret}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!verifyCron(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await fetch(
      'https://api.propublica.org/congress/v1/119/votes/recent.json',
      { headers: { 'X-API-Key': process.env.PROPUBLICA_API_KEY } }
    );

    const data = await response.json();
    const votes = data.results || [];

    let inserted = 0, updated = 0, errors = [];

    for (const vote of votes) {
      try {
        const { error } = await adminDb.from('votes').upsert([
          {
            official_id: vote.member_id,
            bill_id: vote.bill_id,
            congress_number: 119,
            vote_position: vote.position?.toLowerCase() || 'abstain',
            vote_date: vote.date,
            source_url: vote.source_url || '',
            confidence_score: 95,
            synced_at: new Date().toISOString(),
            published_at: new Date().toISOString(),
          }
        ], { onConflict: 'official_id,bill_id,congress_number' });

        if (!error) inserted++;
      } catch (err) {
        errors.push(err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced voting records`,
      inserted,
      updated,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: error.message });
  }
}
