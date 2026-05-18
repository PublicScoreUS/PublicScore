import { publicDb } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { q } = req.query;
  if (!q || q.length < 1) return res.status(400).json([]);

  try {
    const { data } = await publicDb
      .from('officials')
      .select('id, name, office_title, state_code, party')
      .ilike('name', `${q}%`)
      .eq('is_active', true)
      .limit(10);

    res.status(200).json(data || []);
  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json([]);
  }
}
