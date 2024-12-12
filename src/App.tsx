import { useEffect, useState } from 'react';
import './App.css';
import { Input } from './components/ui/input';
import axios from 'axios';
import Fuse from 'fuse.js'; 
import ListContent from './pages/list-content';

function App() {
  const [query, setQuery] = useState<string>(''); 
  const [result, setResults] = useState<Celebrity[]>([]); 
  const [fuseResults, setFuseResults] = useState<Celebrity[]>([]); 
  const [suggestion, setSuggestion] = useState<string>(''); 

  type Response = {
    data: Celebrity[];
  };

  type Celebrity = {
    _id: string;
    title: string;
    slug: string;
    type: string;
    id_type: null;
    updated_at: string;
    created_at: string;
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    setQuery(value);
  };

  async function searchQueryApi(query: string): Promise<void> {
    if (!query) {
      setResults([]);
      setFuseResults([]);
      setSuggestion('');
      return;
    }

    try {
      const response = await axios.get<Response>(`${import.meta.env.VITE_API_URL}/celebrities-query?q=${encodeURIComponent(query)}`);
      setResults(response.data.data);
    } catch (error) {
      console.log("Failed to fetch search query", error);
    }
  }

 
  const fuseSearch = (query: string) => {
    if (query.length === 0) {
      setFuseResults(result); 
      setSuggestion('');
      return;
    }

    const fuse = new Fuse(result, {
      keys: ['title'], 
      includeScore: true,
      threshold: 0.3, 
    });

    const results = fuse.search(query);

    if (results.length > 0) {
      setFuseResults(results.map((item) => item.item));
      const bestMatch = results[0];
      if (bestMatch.score && bestMatch.score < 0.3) { 
        const suggestedTerm = bestMatch.item.title;
        if (suggestedTerm.toLowerCase() !== query.toLowerCase()) {
          setSuggestion(`Did you mean "${suggestedTerm}"?`);
        } else {
          setSuggestion('');
        }
      }
    } else {
      setFuseResults([]);
      setSuggestion('No results found. Please try again with different words.');
    }
  };

  useEffect(() => {
    if (query) {
      searchQueryApi(query); 
    } else {
      setResults([]);
      setFuseResults([]); 
      setSuggestion('');
    }
  }, [query]);

  useEffect(() => {
    fuseSearch(query);
  }, [result, query]);

  return (
    <>
      <div className="flex mx-auto max-w-screen-xl">
        <div className="flex flex-col mx-auto gap-[2rem]">
          <h1 className="text-2xl">Example Search with Fuse.js</h1>
          <div className='flex w-[20rem] mx-auto'>
            <Input onChange={handleChange} value={query} placeholder="Search..." />
          </div>

          <div>
            {suggestion && (
              <div className="text-gray-500 mt-2">{suggestion}</div>
            )}
          </div>

          <div>
            <ListContent results={fuseResults} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
