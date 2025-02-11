import dotenv from 'dotenv';

dotenv.config();

export const serverConfig = {
  PORT: process.env.PORT,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_HOST: process.env.DATABASE_HOST,
};