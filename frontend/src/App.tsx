import { useEffect, useState } from 'react';
import { fetchBioSamples } from './api/biosample';
import './App.css';
import type { BioSample } from './types/biosample';

function App() {
  const [samples, setSamples] = useState<BioSample[]>([]);

  useEffect(() => {
    fetchBioSamples().then(setSamples).catch(console.error);
  }, []);

  return (
    <div>
      <h1>BioSamples</h1>
      <ul>
        {samples.map((s) => (
          <li key={s.id}>
            {s.sampling_location} ({s.type}) – {s.sampling_operator}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
