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
    console.log('useEffect running, q =', q);
    
    if (!q) return;
    
    console.log('Calling API with query:', q);
    
    setLoading(true);
    setError(null);

    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => {
        console.log('API response:', data);
        setResults(data || { officials: [], bills: [] });
        setLoading(false);
      })
      .catch(err => {
        console.error('Search error:', err);
        setResults({ officials: [], bills: [] });
        setLoading(false);
      });
  }, [q]);

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
        <Search />
      </div>
      <h2>Search Results for "{q}"</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && results.officials.length === 0 && <p>No results found.</p>}
      {results.officials.map(official => (
        <div key={official.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h3><Link href={`/officials/${official.id}`}>{official.name}</Link></h3>
          <p>{official.office_title} - {official.state_code}</p>
        </div>
      ))}
    </main>
  );
}
