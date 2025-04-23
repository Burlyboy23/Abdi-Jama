import { useState } from 'react';
import { Job } from '@/types';

interface JobFormProps {
  initialData?: Partial<Job>;
  onSubmit: (data: Partial<Job>) => Promise<void>;
  submitLabel?: string;
}

export default function JobForm({ initialData = {}, onSubmit, submitLabel = 'Post Job' }: JobFormProps) {
  const [title, setTitle] = useState(initialData.title || '');
  const [company, setCompany] = useState(initialData.company || '');
  const [location, setLocation] = useState(initialData.location || '');
  const [pay, setPay] = useState(initialData.pay?.toString() || '');
  const [jobType, setJobType] = useState(initialData.job_type || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [contactEmail, setContactEmail] = useState(initialData.contact_email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !company || !location || !pay || !jobType || !description || !contactEmail) {
      setError('Please fill all required fields');
      return;
    }
    
    const payNumber = parseFloat(pay);
    if (isNaN(payNumber) || payNumber <= 0) {
      setError('Please enter a valid pay rate');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit({
        title,
        company,
        location,
        pay: payNumber,
        job_type: jobType as any,
        description,
        contact_email: contactEmail,
      });
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
      console.error(err);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}
      
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Job Title *</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="company" className="form-label">Company Name *</label>
        <input
          type="text"
          className="form-control"
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="location" className="form-label">Location *</label>
        <input
          type="text"
          className="form-control"
          id="location"
          placeholder="City, Province"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="pay" className="form-label">Pay Rate ($/hour) *</label>
        <input
          type="number"
          className="form-control"
          id="pay"
          value={pay}
          onChange={(e) => setPay(e.target.value)}
          disabled={isSubmitting}
          step="0.01"
          min="0"
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="jobType" className="form-label">Job Type *</label>
        <select
          className="form-select"
          id="jobType"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          disabled={isSubmitting}
          required
        >
          <option value="">Select job type</option>
          <option value="general_labour">General Labour</option>
          <option value="construction">Construction</option>
          <option value="warehouse">Warehouse</option>
          <option value="logistics">Logistics</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Job Description *</label>
        <textarea
          className="form-control"
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          required
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label htmlFor="contactEmail" className="form-label">Contact Email *</label>
        <input
          type="email"
          className="form-control"
          id="contactEmail"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </button>
      </div>
    </form>
  );
}