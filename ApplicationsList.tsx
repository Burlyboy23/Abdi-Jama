import { useState } from 'react';
import { Application, Job } from '@/types';

interface ApplicationsListProps {
  applications: Application[];
  job: Job;
}

export default function ApplicationsList({ applications, job }: ApplicationsListProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExportCSV = () => {
    setIsExporting(true);
    
    try {
      // Create CSV content
      const csvHeader = ['Name', 'Email', 'Phone', 'Date Applied'].join(',');
      const csvRows = applications.map(app => {
        const date = new Date(app.created_at).toLocaleDateString();
        return [app.name, app.email, app.phone, date].join(',');
      });
      
      const csvContent = [csvHeader, ...csvRows].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `applications-job-${job.id}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  if (applications.length === 0) {
    return (
      <div className="alert alert-info">
        No applications received for this job yet.
      </div>
    );
  }
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Applicants ({applications.length})</h4>
        <button 
          className="btn btn-outline-primary"
          onClick={handleExportCSV}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date Applied</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.name}</td>
                <td>
                  <a href={`mailto:${app.email}`}>{app.email}</a>
                </td>
                <td>
                  <a href={`tel:${app.phone}`}>{app.phone}</a>
                </td>
                <td>{new Date(app.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}