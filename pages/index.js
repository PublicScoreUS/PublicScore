import { publicDb } from '../lib/db';
import Search from '../components/Search';
import styles from '../styles/Home.module.css';

export default function Home({ stats }) {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>PublicScore</h1>
        <p className={styles.tagline}>Research public office without spin. Facts without bias. Accountability without agenda.</p>
        <Search />
        <div className={styles.suggestions}>
          <p>Try searching for:</p>
          <a href="/search?q=voting%20records">Voting Records</a>
          <a href="/search?q=campaign%20finance">Campaign Finance</a>
          <a href="/search?q=bills">Legislation</a>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats?.officials || 540}</div>
          <div className={styles.statLabel}>Elected Officials Tracked</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats?.votes || '50K+'}</div>
          <div className={styles.statLabel}>Voting Records</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats?.bills || '2K+'}</div>
          <div className={styles.statLabel}>Bills Indexed</div>
        </div>
      </section>

      <section className={styles.info}>
        <h2>What is PublicScore?</h2>
        <p>PublicScore is a neutral, searchable platform for public accountability. We organize publicly available information about politicians, voting records, campaign finance, and legislation.</p>
        <h3>Our Mission</h3>
        <p>We do not tell users what to think. We organize public information so users can think for themselves.</p>
      </section>

      <section className={styles.cta}>
        <h2>Start Researching</h2>
        <p>Search for politicians, bills, voting records, and campaign finance data.</p>
        <a href="/search" className={styles.button}>Search Now</a>
      </section>
    </main>
  );
}

export async function getStaticProps() {
  try {
    const { count: officials } = await publicDb
      .from('officials')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: votes } = await publicDb
      .from('votes')
      .select('*', { count: 'exact', head: true });

    const { count: bills } = await publicDb
      .from('bills')
      .select('*', { count: 'exact', head: true });

    return {
      props: {
        stats: {
          officials: officials || 540,
          votes: votes || '50K+',
          bills: bills || '2K+'
        }
      },
      revalidate: 3600
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      props: {
        stats: {
          officials: 540,
          votes: '50K+',
          bills: '2K+'
        }
      },
      revalidate: 3600
    };
  }
}
