import { adminDb } from '../../../../lib/db';

const PROPUBLICA_API = 'https://api.propublica.org/congress/v1';

async function fetchProPublicaMembers() {
  const members = [];
  
  // Fetch Senate members
  try {
    const res = await fetch(`${PROPUBLICA_API}/members/senate/current.json`);
    const data = await res.json();
    if (data.results && data.results[0]) {
      members.push(...data.results[0].members);
    }
  } catch (err) {
    console.error('Error fetching Senate:', err);
  }

  // Fetch House members
  try {
    const res = await fetch(`${PROPUBLICA_API}/members/house/current.json`);
    const data = await res.json();
    if (data.results && data.results[0]) {
      members.push(...data.results[0].members);
    }
  } catch (err) {
    console.error('Error fetching House:', err);
  }

  return members;
}

function mapProPublicaToOfficial(member) {
  return {
    propublica_id: member.id,
    name: `${member.first_name} ${member.last_name}`,
    party: member.party,
    state_code: member.state,
    office_title: member.chamber === 'Senate' ? 'U.S. Senator' : 'U.S. Representative',
    bio_text: member.title || '',
    district: member.district ? member.district.toString() : null,
    is_active: member.in_office,
    photo_url: member.img_url || null
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!adminDb) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    console.log('Fetching ProPublica members...');
    const members = await fetchProPublicaMembers();
    console.log(`Fetched ${members.length} members`);

    // Map to our schema
    const officials = members.map(mapProPublicaToOfficial);

    // Insert with UPSERT to avoid duplicates
    const { data, error } = await adminDb
      .from('officials')
      .upsert(officials, { onConflict: 'propublica_id' });

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: `Synced ${officials.length} officials`,
      count: officials.length
    });
  } catch (err) {
    console.error('Sync error:', err);
    return res.status(500).json({ error: err.message });
  }
}
