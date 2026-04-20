import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
console.log('PRISMA UTILS INITIALIZED WITH DATABASE_URL:', process.env.DATABASE_URL);
console.log('CONNECTION STRING:', connectionString);
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
