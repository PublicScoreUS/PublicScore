import { getOfficial, getOfficialVotes, getOfficialDonations, getDonationSummary } from '../../lib/db';

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  if (!params || !params.id) {
    return { notFound: true };
  }

  const official = await getOfficial(params.id);
  if (!official) {
    return { notFound: true };
  }

  const votes = await getOfficialVotes(params.id, 10);
  const donations = await getOfficialDonations(params.id, 10);
  const donationSummary = await getDonationSummary(params.id);

  return {
    props: { official, votes, donations, donationSummary },
    revalidate: 3600
  };
}

export default function OfficialDetail({ official, votes, donations, donationSummary }) {
  if (!official) return <p>Official not found.</p>;

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <h1>{official.name}</h1>
      <p><strong>Office:</strong> {official.office_title} - {official.state_code}</p>
      <p><strong>Party:</strong> {official.party}</p>
      {official.bio_text && <p>{official.bio_text}</p>}

      <section style={{ marginTop: '2rem' }}>
        <h2>Campaign Finance</h2>
        <p><strong>Total Donations:</strong> ${(donationSummary.total / 100).toLocaleString()}</p>
        {Object.keys(donationSummary.byIndustry).length > 0 && (
          <div>
            <h3>By Industry</h3>
            <ul>
              {Object.entries(donationSummary.byIndustry).map(([industry, amount]) => (
                <li key={industry}>{industry}: ${(amount / 100).toLocaleString()}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {votes.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <h2>Recent Votes</h2>
          <ul>
            {votes.map(vote => (
              <li key={vote.id}>
                <strong>{vote.bills?.title || 'Bill'}</strong>: {vote.vote_type}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
