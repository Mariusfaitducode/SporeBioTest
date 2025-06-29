import { Link } from 'react-router-dom';
import type { BioSample } from '../types/biosample';
import { formatDate } from '../utils';

interface SampleCardProps {
  sample: BioSample;
  onDelete: (id: number, location: string) => void;
}

export default function SampleCard({ sample, onDelete }: SampleCardProps) {
  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    onDelete(sample.id, sample.sampling_location);
    event.preventDefault();
  };

  return (
    <Link to={`/biosample/${sample.id}`}>
        <article className="biosample-card">
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