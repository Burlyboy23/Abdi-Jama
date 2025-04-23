import { useState, useCallback, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/layout/Layout';
import JobCard from '@/components/jobs/JobCard';
import JobFilter from '@/components/jobs/JobFilter';
import { Job, JobFilter as JobFilterType } from '@/types';

interface HomeProps {
  initialJobs: Job[];
}

export default function Home({ initialJobs }: HomeProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [filters, setFilters] = useState<JobFilterType>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.job_type) queryParams.append('job_type', filters.job_type);
      if (filters.min_pay) queryParams.append('min_pay', filters.min_pay.toString());
      if (filters.max_pay) queryParams.append('max_pay', filters.max_pay.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `/api/jobs${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  
  const handleFilterChange = (newFilters: JobFilterType) => {
    setFilters(newFilters);
  };
  
  return (
    <Layout>
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="text-center py-5">
              <h1 className="display-5 fw-bold mb-3">Find Blue-Collar Jobs in Canada</h1>
              <p className="lead mb-0">
                Connect with temporary job opportunities in general labour, construction, warehouse, and logistics
              </p>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-3 mb-4 mb-lg-0">
            <JobFilter onFilterChange={handleFilterChange} />
          </div>
          
          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading jobs...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                <p className="mb-0">{error}</p>
                <button 
                  className="btn btn-outline-danger mt-2"
                  onClick={fetchJobs}
                >
                  Try Again
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="alert alert-info">
                <p className="mb-0">No jobs found matching your criteria. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="row">
                {jobs.map((job) => (
                  <div key={job.id} className="col-md-6 mb-4">
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // When running server-side, we can directly access the database
    const pool = require('@/lib/db').default;
    const result = await pool.query(
      'SELECT * FROM jobs WHERE is_published = true ORDER BY created_at DESC LIMIT 10'
    );
    
    return {
      props: {
        initialJobs: JSON.parse(JSON.stringify(result.rows)),
      },
    };
  } catch (error) {
    console.error('Error fetching initial jobs:', error);
    return {
      props: {
        initialJobs: [],
      },
    };
  }
};