import { Link, useNavigate } from 'react-router-dom';
import type { BioSample } from '../types/biosample';
import { formatDate } from '../utils';

interface SampleCardProps {
  sample: BioSample;
  onDelete: (id: number, location: string) => void;
}

export default function SampleCard({ sample, onDelete }: SampleCardProps) {
  const navigate = useNavigate();

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete(sample.id, sample.sampling_location);
  };

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/edit/${sample.id}`);
  };

  const handleViewDetails = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/biosample/${sample.id}`);
  };

  return (
    <Link to={`/biosample/${sample.id}`}>
        <article className="biosample-card">
        <h3>
            {sample.sampling_location}
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
            <button 
                className="secondary small" 
                onClick={handleViewDetails}
                aria-label={`View details for sample ${sample.id}`}
            >
                View Details
            </button>
            <button 
                className="secondary small" 
                onClick={handleEdit}
                aria-label={`Edit sample ${sample.id}`}
            >
                Edit
            </button>
            <button 
                className="danger small" 
                onClick={handleDelete}
                aria-label={`Delete sample ${sample.id}`}
            >
                Delete
            </button>
        </div>
        </article>
    </Link>
  );
} 