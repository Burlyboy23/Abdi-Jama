import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import JobManagement from '@/components/employer/JobManagement';
import { Job } from '@/types';

export default function EmployerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect if not logged in or not an employer
    if (status === 'unauthenticated') {
      router.push('/login?returnUrl=/employer/dashboard');
    } else if (status === 'authenticated' && session.user.role !== 'employer') {
      router.push('/');
    }
  }, [status, session, router]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      if (status !== 'authenticated' || session?.user.role !== 'employer') return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/employer/jobs');
        
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const data = await response.json();
        setJobs(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load your jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [status, session]);
  
  const handleUpdateJob = async (id: number, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/employer/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_published: isPublished }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update job');
      }
      
      // Update job in local state
      setJobs(jobs.map(job => 
        job.id === id ? { ...job, is_published: isPublished } : job
      ));
    } catch (err) {
      console.error('Error updating job:', err);
      alert('Failed to update job. Please try again.');
    }
  };
  
  const handleDeleteJob = async (id: number) => {
    try {
      const response = await fetch(`/api/employer/jobs/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      
      // Remove job from local state
      setJobs(jobs.filter(job => job.id !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job. Please try again.');
    }
  };
  
  if (status === 'loading' || (status === 'authenticated' && session?.user.role !== 'employer')) {
    return (
      <Layout title="Employer Dashboard - Canawide">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout title="Employer Dashboard - Canawide">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Employer Dashboard</h1>
          <Link href="/employer/jobs/new" className="btn btn-primary">
            Post New Job
          </Link>
        </div>
        
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="card-title mb-4">Your Posted Jobs</h2>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading your jobs...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                <p className="mb-0">{error}</p>
                <button 
                  className="btn btn-outline-danger mt-2"
                  onClick={() => router.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <JobManagement 
                jobs={jobs} 
                onUpdateJob={handleUpdateJob} 
                onDeleteJob={handleDeleteJob} 
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}