import { useState } from 'react';
import { Job } from '@/types';

interface ApplicationFormProps {
  job: Job;
  onSubmit: (data: { name: string; email: string; phone: string }) => Promise<void>;
}

export default function ApplicationForm({ job, onSubmit }: ApplicationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone) {
      setError('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit({ name, email, phone });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="card shadow-sm p-4 mt-4">
        <div className="text-center">
          <div className="mb-3">
            <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
          </div>
          <h4>Application Submitted!</h4>
          <p className="mb-0">
            Thank you for your interest in this position. The employer will contact you if they wish to proceed with your application.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card shadow-sm p-4 mt-4">
      <h4 className="mb-4">I'm Interested in This Job</h4>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address *</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="form-label">Phone Number *</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}