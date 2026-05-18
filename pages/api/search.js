import { adminDb } from '../../lib/db';

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || q.length < 1) {
    return res.status(400).json({ error: 'Missing query', officials: [], bills: [] });
  }

  try {
    // Test: get ALL officials first
    const { data: allOfficials, error: allError } = await adminDb
      .from('officials')
      .select('*')
      .limit(5);

    console.log('All officials:', allOfficials);
    console.log('All error:', allError);

    if (allError) throw allError;

    // Now filter locally
    const filtered = (allOfficials || []).filter(o => 
      o.name.toLowerCase().includes(q.toLowerCase())
    );

    res.status(200).json({
      officials: filtered,
      bills: [],
      query: q,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message, officials: [], bills: [] });
  }
}
