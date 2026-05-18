import { publicDb } from '../../lib/db';

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    const { data: officials, error: officialsError } = await publicDb
      .from('officials')
      .select('id, name, party, state_code, office_title')
      .ilike('name', `%${q}%`)
      .limit(20);

    const { data: bills, error: billsError } = await publicDb
      .from('bills')
      .select('id, bill_number, title, status')
      .ilike('title', `%${q}%`)
      .limit(20);

    if (officialsError || billsError) {
      console.error('Search error:', officialsError || billsError);
    }

    res.status(200).json({
      officials: officials || [],
      bills: bills || [],
      query: q,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message });
  }
}
