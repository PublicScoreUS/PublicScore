import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Autocomplete error:', error);
      }
    }, 300);

    setDebounceTimer(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSuggestions([]);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (id) => {
    setSuggestions([]);
    router.push(`/officials/${id}`);
  };

  return (
    <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search officials, bills, voting records..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #2E5090',
            borderRadius: '4px'
          }}
        />
      </form>

      {suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          zIndex: 100,
          maxHeight: 300,
          overflowY: 'auto'
        }}>
          {suggestions.map(suggestion => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.id)}
              style={{
                width: '100%',
                padding: '12px',
                textAlign: 'left',
                border: 'none',
                borderBottom: '1px solid #eee',
                background: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              <strong>{suggestion.name}</strong> - {suggestion.office_title} ({suggestion.state_code})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
