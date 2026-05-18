import { adminDb } from '../../lib/db';

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    const { data, error } = await adminDb
      .from('officials')
      .select('*');

    if (error) throw error;

    res.status(200).json({
      debug: { totalInDatabase: data?.length, query: q },
      officials: data || [],
      bills: []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
