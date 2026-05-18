import { publicDb } from '../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  const official = await publicDb
    .from('officials')
    .select('*')
    .eq('id', id)
    .single();

  res.status(200).json(official);
}
