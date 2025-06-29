import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteBioSample, fetchBioSamples } from '../api/biosample';
import type { BioSample } from '../types/biosample';
import { confirmDeleteSample, getErrorMessage } from '../utils';
import SampleCard from './SampleCard';

export default function BioSampleList() {
  const [samples, setSamples] = useState<BioSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSamples();
  }, []);

  const loadSamples = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBioSamples();
      setSamples(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, location: string) => {
    if (!confirmDeleteSample(location)) {
      return;
    }

    try {
      await deleteBioSample(id);
      setSamples(samples.filter(sample => sample.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading" role="status" aria-label="Loading samples">
          Loading biosamples...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">BioSamples</h1>
        <Link to="/create">
          <button aria-label="Create new biosample">
            + New Sample
          </button>
        </Link>
      </div>

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      {samples.length === 0 ? (
        <div className="empty-state">
          <h3>No samples yet</h3>
          <p>Get started by creating your first biosample.</p>
          <Link to="/create">
            <button>+ Create Sample</button>
          </Link>
        </div>
      ) : (
        <div className="biosample-grid">
          {samples.map((sample) => (
            <SampleCard 
              key={sample.id}
              sample={sample}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
} 