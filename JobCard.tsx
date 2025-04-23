import Link from 'next/link';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const getJobTypeBadge = (jobType: string) => {
    switch (jobType) {
      case 'general_labour':
        return 'General Labour';
      case 'construction':
        return 'Construction';
      case 'warehouse':
        return 'Warehouse';
      case 'logistics':
        return 'Logistics';
      case 'other':
      default:
        return 'Other';
    }
  };

  return (
    <div className="card job-card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{job.title}</h5>
          <span className="badge-job-type">{getJobTypeBadge(job.job_type)}</span>
        </div>
        
        <h6 className="card-subtitle mb-3 text-muted">{job.company}</h6>
        
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-geo-alt me-2"></i>
            <span>{job.location}</span>
          </div>
          <div className="d-flex align-items-center">
            <i className="bi bi-currency-dollar me-2"></i>
            <span className="job-pay">{formatCurrency(job.pay)}/hour</span>
          </div>
        </div>
        
        <p className="card-text mb-4">
          {job.description.length > 120 
            ? job.description.substring(0, 120) + '...' 
            : job.description}
        </p>
        
        <div className="d-grid">
          <Link 
            href={`/jobs/${job.id}`} 
            className="btn btn-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}