import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import JobForm from '@/components/jobs/JobForm';
import { Job } from '@/types';

export default function EditJob() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect if not logged in or not an employer
    if (status === 'unauthenticated') {
      router.push(`/login?returnUrl=/employer/jobs/${id}/edit`);
    } else if (status === 'authenticated' && session.user.role !== 'employer') {
      router.push('/');
    }
  }, [status, session, router, id]);
  
  useEffect(() => {
    const fetchJob = async () => {
      if (!id || status !== 'authenticated') return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/employer/jobs/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/employer/dashboard');
            return;
          }
          throw new Error('Failed to fetch job details');
        }
        
        const data = await response.json();
        setJob(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id, status, router]);
  
  const handleSubmit = async (jobData: Partial<Job>) => {
    const response = await fetch(`/api/employer/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update job');
    }
    
    router.push('/employer/dashboard');
  };
  
  if (status === 'loading' || loading || (status === 'authenticated' && session?.user.role !== 'employer')) {
    return (
      <Layout title="Edit Job - Canawide">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading job details...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }
  
  if (error) {
    return (
      <Layout title="Error - Canawide">
        <div className="container py-5">
          <div className="alert alert-danger">
            <p className="mb-0">{error}</p>
            <button 
              className="btn btn-outline-danger mt-2"
              onClick={() => router.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!job) {
    return null;
  }
  
  return (
    <Layout title="Edit Job - Canawide">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h1 className="card-title mb-4">Edit Job</h1>
                
                <JobForm 
                  initialData={job}
                  onSubmit={handleSubmit}
                  submitLabel="Update Job"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}