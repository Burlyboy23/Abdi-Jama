import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { id } = req.query;
    const { name, email, phone } = req.body;
    
    if (!id || Array.isArray(id) || !name || !email || !phone) {
      return res.status(400).json({ message: 'Invalid request data' });
    }
    
    // Check if job exists and is published
    const jobCheck = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND is_published = true',
      [id]
    );
    
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found or not published' });
    }
    
    // Create application
    const result = await pool.query(
      'INSERT INTO applications (job_id, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, name, email, phone]
    );
    
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({ message: 'Error submitting application' });
  }
}