import { adminDb } from '../../lib/db';

export default async function handler(req, res) {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    // Debug: Check if adminDb exists
    if (!adminDb) {
      return res.status(500).json({ 
        error: 'adminDb is null - environment variables not loaded',
        env: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓' : '✗',
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓' : '✗',
          serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗'
        }
      });
    }

    const { data, error } = await adminDb
      .from('officials')
      .select('*');
    
    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    res.status(200).json({
      officials: data || [],
      bills: [],
      query: q,
      debug: {
        rowsFound: data?.length || 0,
        adminDbConnected: true
      }
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}
