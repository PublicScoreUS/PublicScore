import { adminDb } from '../../lib/db';

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || q.length < 1) {
    return res.status(400).json({ error: 'Missing query', officials: [], bills: [] });
  }

  try {
    console.log('Search query:', q);
    console.log('adminDb:', adminDb ? 'connected' : 'null');
    
    const searchTerm = `%${q.toLowerCase()}%`;
    console.log('Search term:', searchTerm);
    
    const { data: officials, error } = await adminDb
      .from('officials')
      .select('*')
      .ilike('name', searchTerm);

    console.log('Query result:', { officials, error });

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
