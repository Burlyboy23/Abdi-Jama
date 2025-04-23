import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  if (session.user.role !== 'employer') {
    return res.status(403).json({ message: 'Forbidden - Employer access only' });
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const userId = parseInt(session.user.id);
  const jobId = parseInt(req.query.id as string);
  
  if (isNaN(jobId)) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }
  
  try {
    // Verify job ownership
    const jobCheck = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND user_id = $2',
      [jobId, userId]
    );
    
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found or not owned by you' });
    }
    
    // Get applications for this job
    const result = await pool.query(
      'SELECT * FROM applications WHERE job_id = $1 ORDER BY created_at DESC',
      [jobId]
    );
    
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ message: 'Error fetching applications' });
  }
}