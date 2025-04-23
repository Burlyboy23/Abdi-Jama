import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { email, password, name, phone, company_name, role } = req.body;
    
    if (!email || !password || !role || (role === 'employer' && !company_name)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    if (role !== 'worker' && role !== 'employer') {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10);
    
    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password, name, phone, company_name, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, company_name, role',
      [email, hashedPassword, name || null, phone || null, company_name || null, role]
    );
    
    return res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Error during registration' });
  }
}