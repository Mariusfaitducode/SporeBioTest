import type { BioSample } from '../types/biosample';
import { formatDate } from '../utils';

interface SampleInformationProps {
  sample: BioSample;
}

export default function SampleInformation({ sample }: SampleInformationProps) {
  return (
    <div className="card">
      <h2>Sample Information</h2>
      
      <div className="sample-info">
        <div className="sample-info-item">
          <span className="sample-info-label">Sample ID</span>
          <span className="sample-info-value">#{sample.id}</span>
        </div>
        <div className="sample-info-item">
          <span className="sample-info-label">Location</span>
          <span className="sample-info-value">{sample.sampling_location}</span>
        </div>
        <div className="sample-info-item">
          <span className="sample-info-label">Type</span>
          <span className="sample-info-value">{sample.type}</span>
        </div>
        <div className="sample-info-item">
          <span className="sample-info-label">Sampling Date</span>
          <time className="sample-info-value" dateTime={sample.sampling_date}>
            {formatDate(sample.sampling_date)}
          </time>
        </div>
        <div className="sample-info-item">
          <span className="sample-info-label">Operator</span>
          <span className="sample-info-value">{sample.sampling_operator}</span>
        </div>
      </div>
    </div>
  );
} 