import { adminDb } from '../../lib/db';

export default async function handler(req, res) {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    console.log('API called with q =', q);
    console.log('adminDb exists?', !!adminDb);
    
    const { data, error } = await adminDb
      .from('officials')
      .select('*');
    
    console.log('Query error:', error);
    console.log('Query returned data:', data?.length || 0, 'rows');
    
    if (error) throw error;

    res.status(200).json({
      debug: { totalInDatabase: data?.length, query: q, adminDbExists: !!adminDb },
      officials: data || [],
      bills: []
    });
  } catch (err) {
    console.error('API error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
