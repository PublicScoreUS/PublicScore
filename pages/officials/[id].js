import { getOfficial, getOfficialVotes, getOfficialDonations, getDonationSummary, publicDb } from '../../lib/db';
import Link from 'next/link';

export default function OfficialProfile({ official, votes, donations, summary }) {
  if (!official) return <div>Not found</div>;

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <Link href="/">← Back to home</Link>

      <h1>{official.name}</h1>
      <p><strong>{official.office_title}</strong> • {official.state_code} • {official.party}</p>

      {official.bio_text && <p>{official.bio_text}</p>}

      <section>
        <h2>Recent Votes ({votes.length})</h2>
        {votes.length === 0 ? (
          <p>No voting records found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Bill</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Vote</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {votes.map(vote => (
                <tr key={vote.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{vote.bills?.title || 'N/A'}</td>
                  <td style={{ padding: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{vote.vote_position}</td>
                  <td style={{ padding: '0.5rem' }}>{new Date(vote.vote_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Campaign Finance</h2>
        <p><strong>Total Raised:</strong> ${(summary?.total / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
        {summary?.byIndustry && Object.keys(summary.byIndustry).length > 0 && (
          <div>
            <h3>Top Industries</h3>
            <ul>
              {Object.entries(summary.byIndustry)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([industry, amount]) => (
                  <li key={industry}>{industry}: ${(amount / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}</li>
                ))}
            </ul>
          </div>
        )}
      </section>

      <hr />
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        Data sourced from ProPublica Congress API and FEC.gov. Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}

export async function getStaticProps({ params }) {
  const id = parseInt(params.id);
  const official = await getOfficial(id);
  const votes = await getOfficialVotes(id, 10);
  const donations = await getOfficialDonations(id, 50);
  const summary = await getDonationSummary(id);

  return {
    props: { official, votes, donations, summary },
    revalidate: 86400
  };
}

export async function getStaticPaths() {
  try {
    const { data: officials } = await publicDb
      .from('officials')
      .select('id')
      .eq('is_active', true)
      .limit(100);

    return {
      paths: (officials || []).map(o => ({ params: { id: o.id.toString() } })),
      fallback: 'blocking'
    };
  } catch (error) {
    return { paths: [], fallback: 'blocking' };
  }
}
