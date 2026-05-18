import { publicDb } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { q } = req.query;
  if (!q || q.length < 2) return res.status(400).json({ error: 'Query too short' });

  try {
    const { data: officials } = await publicDb
      .from('officials')
      .select('id, name, party, state_code, office_title, bio_text')
      .textSearch('name', q, { config: 'english' })
      .eq('is_active', true)
      .limit(20);

    const { data: bills } = await publicDb
      .from('bills')
      .select('id, bill_number, title, status, summary')
      .textSearch('title', q, { config: 'english' })
      .eq('is_active', true)
      .limit(20);

    res.status(200).json({
      officials: officials || [],
      bills: bills || [],
      query: q,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}
