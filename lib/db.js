import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const publicDb = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;
export const adminDb = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;

export async function searchOfficials(query) {
  const { data, error } = await publicDb
    .from('officials')
    .select('id, name, party, state_code, office_title, bio_text')
    .textSearch('name', query, { config: 'english' })
    .eq('is_active', true)
    .limit(20);
  if (error) console.error('Search error:', error);
  return data || [];
}

export async function getOfficial(id) {
  const { data, error } = await publicDb
    .from('officials')
    .select('*')
    .eq('id', id)
    .single();
  if (error) console.error('Fetch error:', error);
  return data;
}

export async function getOfficialVotes(officialId, limit = 50) {
  const { data, error } = await publicDb
    .from('votes')
    .select('*, bills(bill_number, title, status)')
    .eq('official_id', officialId)
    .eq('published_at', null, { not: true })
    .order('vote_date', { ascending: false })
    .limit(limit);
  if (error) console.error('Votes error:', error);
  return data || [];
}

export async function getOfficialDonations(officialId, limit = 50) {
  const { data, error } = await publicDb
    .from('donations')
    .select('*')
    .eq('recipient_official_id', officialId)
    .eq('published_at', null, { not: true })
    .order('contribution_date', { ascending: false })
    .limit(limit);
  if (error) console.error('Donations error:', error);
  return data || [];
}

export async function getDonationSummary(officialId) {
  const { data, error } = await publicDb
    .from('donations')
    .select('amount_cents, industry_category')
    .eq('recipient_official_id', officialId)
    .eq('published_at', null, { not: true });

  if (error || !data) return { total: 0, byIndustry: {} };

  const total = data.reduce((sum, d) => sum + (d.amount_cents || 0), 0);
  const byIndustry = {};
  data.forEach(d => {
    if (d.industry_category) {
      byIndustry[d.industry_category] = (byIndustry[d.industry_category] || 0) + (d.amount_cents || 0);
    }
  });

  return { total, byIndustry };
}

export async function getReviewQueue() {
  const { data, error } = await adminDb
    .from('review_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  if (error) console.error('Review queue error:', error);
  return data || [];
}

export async function approveReviewItem(id) {
  const { error } = await adminDb
    .from('review_queue')
    .update({ status: 'approved', published_at: new Date().toISOString() })
    .eq('id', id);
  if (error) console.error('Approval error:', error);
  return !error;
}
