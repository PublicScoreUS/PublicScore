const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const db = createClient(supabaseUrl, supabaseServiceKey);

async function fetchProPublicaMembers() {
  const members = [];
  
  try {
    const res = await fetch('https://api.propublica.org/congress/v1/members/senate/current.json');
    const data = await res.json();
    if (data.results && data.results[0]) members.push(...data.results[0].members);
  } catch (err) {
    console.error('Senate fetch error:', err);
  }

  try {
    const res = await fetch('https://api.propublica.org/congress/v1/members/house/current.json');
    const data = await res.json();
    if (data.results && data.results[0]) members.push(...data.results[0].members);
  } catch (err) {
    console.error('House fetch error:', err);
  }

  return members;
}

async function sync() {
  try {
    console.log('Fetching ProPublica members...');
    const members = await fetchProPublicaMembers();
    console.log(`Fetched ${members.length} members`);

    const officials = members.map(m => ({
      propublica_id: m.id,
      name: `${m.first_name} ${m.last_name}`,
      party: m.party,
      state_code: m.state,
      office_title: m.chamber === 'Senate' ? 'U.S. Senator' : 'U.S. Representative',
      bio_text: m.title || '',
      is_active: m.in_office
    }));

    const { error } = await db.from('officials').upsert(officials, { onConflict: 'propublica_id' });
    
    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log(`✓ Synced ${officials.length} officials`);
    }
  } catch (err) {
    console.error('Sync error:', err);
  }
}

sync();
