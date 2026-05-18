import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Search from '../components/Search';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState({ officials: [], bills: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError(null);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => {
        setResults(data || { officials: [], bills: [] });
        setLoading(false);
      })
      .catch(err => {
        console.error('Search error:', err);
        setError(err.message);
        setResults({ officials: [], bills: [] });
        setLoading(false);
      });
  }, [q]);

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <Search />
      <h2>Search Results for "{q}"</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (results?.officials?.length || 0) === 0 && (results?.bills?.length || 0) === 0 && (
        <p>No results found.</p>
      )}
      {(results?.officials?.length || 0) > 0 && (
        <section>
          <h3>Officials ({results.officials.length})</h3>
          {results.officials.map(official => (
            <Link key={official.id} href={`/officials/${official.id}`}>
              <a style={{ display: 'block', padding: '1rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                <strong>{official.name}</strong> - {official.office_title} ({official.state_code})
              </a>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
