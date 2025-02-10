import express, { Express, Request, Response } from 'express';
import sequelize from '@/config/databaseConfig';
import { ContactController } from '@/controllers/contact-controller';

const app: Express = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});

const contactController = new ContactController();

app.post('/identify', contactController.identify);

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
