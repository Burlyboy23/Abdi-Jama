import { useState } from 'react';
import Link from 'next/link';
import { Job } from '@/types';

interface JobManagementProps {
  jobs: Job[];
  onUpdateJob: (id: number, isPublished: boolean) => Promise<void>;
  onDeleteJob: (id: number) => Promise<void>;
}

export default function JobManagement({ jobs, onUpdateJob, onDeleteJob }: JobManagementProps) {
  const [processing, setProcessing] = useState<number | null>(null);
  
  const handleTogglePublish = async (job: Job) => {
    setProcessing(job.id);
    try {
      await onUpdateJob(job.id, !job.is_published);
    } finally {
      setProcessing(null);
    }
  };
  
  const handleDeleteJob = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    
    setProcessing(id);
    try {
      await onDeleteJob(id);
    } finally {
      setProcessing(null);
    }
  };
  
  if (jobs.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="mb-4">You haven't posted any jobs yet.</p>
        <Link href="/employer/jobs/new" className="btn btn-primary">
          Post Your First Job
        </Link>
      </div>
    );
  }
  
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Location</th>
            <th>Applications</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.location}</td>
              <td>
                <Link 
                  href={`/employer/jobs/${job.id}/applications`}
                  className="btn btn-sm btn-outline-primary"
                >
                  View Applications
                </Link>
              </td>
              <td>
                <span className={`badge ${job.is_published ? 'bg-success' : 'bg-secondary'}`}>
                  {job.is_published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td>
                <div className="btn-group">
                  <button
                    className={`btn btn-sm ${job.is_published ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                    onClick={() => handleTogglePublish(job)}
                    disabled={processing === job.id}
                  >
                    {processing === job.id ? 'Processing...' : job.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link 
                    href={`/employer/jobs/${job.id}/edit`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={processing === job.id}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}