import express, { Express, Request, Response } from 'express';
import sequelize from '@/config/databaseConfig';

const app: Express = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    // await sequelize.sync(); 
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

app.listen(port, async () => {
  await connectToDatabase();
  console.log(`Server is running at http://localhost:${port}`);
});
