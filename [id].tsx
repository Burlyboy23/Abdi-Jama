import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import ApplicationForm from '@/components/jobs/ApplicationForm';
import { Job } from '@/types';

interface JobDetailProps {
  job: Job;
}

export default function JobDetail({ job }: JobDetailProps) {
  const router = useRouter();
  
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
  
  const handleSubmitApplication = async (data: { name: string; email: string; phone: string }) => {
    const response = await fetch(`/api/jobs/${job.id}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit application');
    }
  };
  
  if (router.isFallback) {
    return (
      <Layout title="Loading...">
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
  
  return (
    <Layout title={`${job.title} at ${job.company} - Canawide`}>
      <div className="job-detail-header">
        <div className="container">
          <h1 className="mb-2">{job.title}</h1>
          <h5 className="text-muted mb-3">{job.company}</h5>
          
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex mb-2">
                <div className="me-4">
                  <i className="bi bi-geo-alt me-2"></i>
                  <span>{job.location}</span>
                </div>
                <div>
                  <i className="bi bi-tag me-2"></i>
                  <span>{getJobTypeBadge(job.job_type)}</span>
                </div>
              </div>
              <div>
                <i className="bi bi-currency-dollar me-2"></i>
                <span className="job-pay">{formatCurrency(job.pay)}/hour</span>
              </div>
            </div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <p className="mb-0">
                <strong>Contact:</strong> <a href={`mailto:${job.contact_email}`}>{job.contact_email}</a>
              </p>
              <p className="text-muted mb-0">
                <small>Posted: {new Date(job.created_at).toLocaleDateString()}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="mb-4">Job Description</h3>
                <div className="job-description">
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <ApplicationForm job={job} onSubmit={handleSubmitApplication} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  
  if (!id || Array.isArray(id)) {
    return {
      notFound: true,
    };
  }
  
  try {
    const pool = require('@/lib/db').default;
    const result = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND is_published = true',
      [id]
    );
    
    if (result.rows.length === 0) {
      return {
        notFound: true,
      };
    }
    
    return {
      props: {
        job: JSON.parse(JSON.stringify(result.rows[0])),
      },
    };
  } catch (error) {
    console.error('Error fetching job details:', error);
    return {
      notFound: true,
    };
  }
};