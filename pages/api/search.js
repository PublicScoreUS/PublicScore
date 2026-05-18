import { publicDb } from '../../lib/db';

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || q.length < 1) {
    return res.status(400).json({ error: 'Missing query', officials: [], bills: [] });
  }

  try {
    const searchTerm = `%${q.toLowerCase()}%`;
    
    const { data: officials, error } = await publicDb
      .from('officials')
      .select('*')
      .ilike('name', searchTerm);

    if (error) throw error;

    res.status(200).json({
      officials: officials || [],
      bills: [],
      query: q,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message, officials: [], bills: [] });
  }
}
