import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteBioSample, fetchBioSamples } from '../api/biosample';
import type { PaginatedBioSamples } from '../types/biosample';
import { confirmDeleteSample, getErrorMessage } from '../utils';
import SampleCard from './SampleCard';

export default function BioSampleList() {
  const [paginatedData, setPaginatedData] = useState<PaginatedBioSamples | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  useEffect(() => {
    loadSamples();
  }, [currentPage]);

  const loadSamples = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBioSamples(currentPage, pageSize);
      setPaginatedData(data);
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
      // Reload current page after deletion
      await loadSamples();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handlePreviousPage = () => {
    if (paginatedData?.has_prev) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (paginatedData?.has_next) {
      setCurrentPage(currentPage + 1);
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

  const samples = paginatedData?.items || [];

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

      {paginatedData && (
        <div className="pagination-info">
          <p>
            Showing {samples.length} of {paginatedData.total} samples 
            (Page {paginatedData.page} of {paginatedData.total_pages})
          </p>
        </div>
      )}

      {samples.length === 0 && !loading ? (
        <div className="empty-state">
          <h3>No samples yet</h3>
          <p>Get started by creating your first biosample.</p>
          <Link to="/create">
            <button>+ Create Sample</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="biosample-grid">
            {samples.map((sample) => (
              <SampleCard 
                key={sample.id}
                sample={sample}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {paginatedData && paginatedData.total_pages > 1 && (
            <div className="pagination-controls">
              <button 
                onClick={handlePreviousPage}
                disabled={!paginatedData.has_prev}
                aria-label="Previous page"
              >
                ← Previous
              </button>
              <span className="pagination-current">
                Page {paginatedData.page} of {paginatedData.total_pages}
              </span>
              <button 
                onClick={handleNextPage}
                disabled={!paginatedData.has_next}
                aria-label="Next page"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 