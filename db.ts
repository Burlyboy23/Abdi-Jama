import { Pool } from 'pg';

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_fakLY1U5WCKD@ep-polished-frog-a4kzyj4u.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;