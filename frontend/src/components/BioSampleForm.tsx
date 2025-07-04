import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createBioSample, fetchBioSample, updateBioSample } from '../api/biosample';
import type { BioSampleCreate } from '../types/biosample';
import { getErrorMessage, getTodayDateString } from '../utils';

export default function BioSampleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState<BioSampleCreate>({
    sampling_location: '',
    type: '',
    sampling_date: '',
    sampling_operator: ''
  });

  const [originalData, setOriginalData] = useState<BioSampleCreate | null>(null);
  const [useTodayDate, setUseTodayDate] = useState(true);
  const [originalUseTodayDate, setOriginalUseTodayDate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadSample(parseInt(id));
    }
  }, [id, isEdit]);

  const loadSample = async (sampleId: number) => {
    try {
      setLoading(true);
      const sample = await fetchBioSample(sampleId);
      const loadedData = {
        sampling_location: sample.sampling_location,
        type: sample.type,
        sampling_date: sample.sampling_date.split('T')[0]!,
        sampling_operator: sample.sampling_operator
      };
      
      setFormData(loadedData);
      setOriginalData(loadedData);
      setUseTodayDate(false); // In edit mode, use existing date
      setOriginalUseTodayDate(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Validation: check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.sampling_location.trim() !== '' &&
      formData.type !== '' &&
      formData.sampling_operator.trim() !== ''
    );
  };

  // Check if data has changed for update
  const hasDataChanged = () => {
    if (!isEdit || !originalData) return true;
    
    const currentDataToSend: BioSampleCreate = {
      sampling_location: formData.sampling_location,
      type: formData.type,
      sampling_operator: formData.sampling_operator
    };

    const originalDataToSend: BioSampleCreate = {
      sampling_location: originalData.sampling_location,
      type: originalData.type,
      sampling_operator: originalData.sampling_operator
    };

    // Add date only if not using today's date
    if (!useTodayDate && formData.sampling_date) {
      currentDataToSend.sampling_date = formData.sampling_date;
    }
    if (!originalUseTodayDate && originalData.sampling_date) {
      originalDataToSend.sampling_date = originalData.sampling_date;
    }

    // Compare all fields including the date option
    return (
      JSON.stringify(currentDataToSend) !== JSON.stringify(originalDataToSend) ||
      useTodayDate !== originalUseTodayDate
    );
  };

  const canSubmit = () => {
    if (!isFormValid()) return false;
    if (isEdit && !hasDataChanged()) return false;
    return true;
  };

  const getSubmitButtonText = () => {
    if (loading) {
      return isEdit ? 'Updating...' : 'Creating...';
    }
    
    if (!isFormValid()) {
      return 'Fill all required fields';
    }
    
    if (isEdit && !hasDataChanged()) {
      return 'No changes to save';
    }
    
    return isEdit ? 'Update Sample' : 'Create Sample';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit()) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      
      // Prepare data to send
      const dataToSend: BioSampleCreate = {
        sampling_location: formData.sampling_location,
        type: formData.type,
        sampling_operator: formData.sampling_operator
      };

      // Add date only if not using today's date
      if (!useTodayDate && formData.sampling_date) {
        dataToSend.sampling_date = formData.sampling_date;
      }
      
      if (isEdit && id) {
        await updateBioSample(parseInt(id), dataToSend);
        setSuccess('Sample updated successfully!');
        setTimeout(() => navigate(`/biosample/${id}`), 1500);
      } else {
        const newSample = await createBioSample(dataToSend);
        setSuccess('Sample created successfully!');
        setTimeout(() => navigate(`/biosample/${newSample.id}`), 1500);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateOptionChange = (useToday: boolean) => {
    setUseTodayDate(useToday);
    if (useToday) {
      setFormData(prev => ({ ...prev, sampling_date: '' }));
    }
  };

  const sampleTypes = [
    'water',
    'chocolate',
    'flour',
    'soil',
    'air',
    'food',
    'pharmaceutical',
    'cosmetic',
    'other'
  ];

  const today = getTodayDateString();

  return (
    <div className="container">
      <Link to={isEdit ? `/biosample/${id}` : '/'} className="back-button">
        ← Back
      </Link>

      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Edit Sample' : 'Create New Sample'}
        </h1>
      </div>

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="success" role="alert">
          {success}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="sampling_location" className="required">
              Sampling Location
            </label>
            <input
              type="text"
              id="sampling_location"
              name="sampling_location"
              value={formData.sampling_location}
              onChange={handleChange}
              placeholder="e.g., Lab Room 101, Field Site A"
              required
              aria-describedby="location-help"
            />
            <small id="location-help">
              Specify where the sample was collected from
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="type" className="required">
              Sample Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              aria-describedby="type-help"
            >
              <option value="">Select a type...</option>
              {sampleTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <small id="type-help">
              Choose the category that best describes your sample
            </small>
          </div>

          <div className="form-group">
            <legend>Sampling Date</legend>
            
            <div className="date-group" role="radiogroup">
              <div className="radio-option">
                <input
                  type="radio"
                  id="today-date"
                  name="dateOption"
                  checked={useTodayDate}
                  onChange={() => handleDateOptionChange(true)}
                />
                <label htmlFor="today-date">
                  Use today's date ({today})
                </label>
              </div>
              
              <div className="radio-option">
                <input
                  type="radio"
                  id="custom-sampling-date"
                  name="dateOption"
                  checked={!useTodayDate}
                  onChange={() => handleDateOptionChange(false)}
                />
                <label htmlFor="custom-sampling-date">
                  Specify a date
                </label>
              </div>
              {!useTodayDate && (
                <div>
                  <input
                    type="date"
                    id="sampling_date"
                    name="sampling_date"
                    value={formData.sampling_date}
                    onChange={handleChange}
                    required={!useTodayDate}
                  />
                </div>
              )}
            </div>

            {useTodayDate && (
              <small>
                Today's date ({today}) will be automatically used.
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="sampling_operator" className="required">
              Sampling Operator
            </label>
            <input
              type="text"
              id="sampling_operator"
              name="sampling_operator"
              value={formData.sampling_operator}
              onChange={handleChange}
              placeholder="e.g., Dr. Smith, Lab Tech 01"
              required
              aria-describedby="operator-help"
            />
            <small id="operator-help">
              Name or ID of the person who collected the sample
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={!canSubmit() || loading}
              className={!canSubmit() ? 'disabled' : ''}
            >
              {getSubmitButtonText()}
            </button>
            <Link to={isEdit ? `/biosample/${id}` : '/'}>
              <button type="button" className="secondary">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 