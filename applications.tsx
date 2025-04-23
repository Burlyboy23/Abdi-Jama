import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import ApplicationsList from '@/components/employer/ApplicationsList';
import { Job, Application } from '@/types';

export default function JobApplications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect if not logged in or not an employer
    if (status === 'unauthenticated') {
      router.push(`/login?returnUrl=/employer/jobs/${id}/applications`);
    } else if (status === 'authenticated' && session.user.role !== 'employer') {
      router.push('/');
    }
  }, [status, session, router, id]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id || status !== 'authenticated') return;
      
      try {
        setLoading(true);
        
        // Fetch job details
        const jobResponse = await fetch(`/api/employer/jobs/${id}`);
        
        if (!jobResponse.ok) {
          if (jobResponse.status === 404) {
            router.push('/employer/dashboard');
            return;
          }
          throw new Error('Failed to fetch job details');
        }
        
        const jobData = await jobResponse.json();
        setJob(jobData);
        
        // Fetch applications
        const applicationsResponse = await fetch(`/api/employer/jobs/${id}/applications`);
        
        if (!applicationsResponse.ok) {
          throw new Error('Failed to fetch applications');
        }
        
        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, status, router]);
  
  if (status === 'loading' || loading || (status === 'authenticated' && session?.user.role !== 'employer')) {
    return (
      <Layout title="Applications - Canawide">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading applications...</p>
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
    <Layout title={`Applications for ${job.title} - Canawide`}>
      <div className="container py-4">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h1 className="mb-1">{job.title}</h1>
                <p className="text-muted mb-0">{job.company} • {job.location}</p>
              </div>
              <button
                className="btn btn-outline-secondary"
                onClick={() => router.back()}
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>
        
        <div className="card shadow-sm">
          <div className="card-body">
            <ApplicationsList job={job} applications={applications} />
          </div>
        </div>
      </div>
    </Layout>
  );
}