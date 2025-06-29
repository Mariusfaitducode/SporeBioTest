import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteBioSample, fetchBioSamples } from '../api/biosample';
import type { BioSample } from '../types/biosample';

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
      setError(err instanceof Error ? err.message : 'Failed to load samples');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, location: string) => {
    const confirmMessage = `Are you sure you want to delete the sample from "${location}"? This action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await deleteBioSample(id);
      setSamples(samples.filter(sample => sample.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sample');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            <article key={sample.id} className="biosample-card">
              <h3>
                <Link to={`/biosample/${sample.id}`} aria-label={`View details for sample from ${sample.sampling_location}`}>
                  {sample.sampling_location}
                </Link>
              </h3>
              
              <div className="biosample-meta">
                <div className="biosample-meta-item">
                  <span className="biosample-meta-label">Type</span>
                  <div className="biosample-type">{sample.type}</div>
                </div>
                <div className="biosample-meta-item">
                  <span className="biosample-meta-label">Date</span>
                  <time className="biosample-meta-value" dateTime={sample.sampling_date}>
                    {formatDate(sample.sampling_date)}
                  </time>
                </div>
                <div className="biosample-meta-item">
                  <span className="biosample-meta-label">Operator</span>
                  <span className="biosample-meta-value">{sample.sampling_operator}</span>
                </div>
              </div>

              <div className="biosample-actions">
                <Link to={`/biosample/${sample.id}`}>
                  <button className="secondary small" aria-label={`View details for sample ${sample.id}`}>
                    View Details
                  </button>
                </Link>
                <Link to={`/edit/${sample.id}`}>
                  <button className="secondary small" aria-label={`Edit sample ${sample.id}`}>
                    Edit
                  </button>
                </Link>
                <button 
                  className="danger small" 
                  onClick={() => handleDelete(sample.id, sample.sampling_location)}
                  aria-label={`Delete sample ${sample.id}`}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
} 