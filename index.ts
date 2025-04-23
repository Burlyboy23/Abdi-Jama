export interface User {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  company_name: string | null;
  role: 'worker' | 'employer';
  created_at: string;
}

export interface Job {
  id: number;
  user_id: number;
  title: string;
  company: string;
  location: string;
  pay: number;
  description: string;
  job_type: 'general_labour' | 'construction' | 'warehouse' | 'logistics' | 'other';
  contact_email: string;
  is_published: boolean;
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export type JobFilter = {
  location?: string;
  job_type?: string;
  min_pay?: number;
  max_pay?: number;
};

// NextAuth types extension
declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email: string;
    role: string;
    company_name?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
      role: string;
      company_name?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    company_name?: string;
  }
}