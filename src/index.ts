import express, { Express, Request, Response } from 'express';
import sequelize from '@/config/databaseConfig';
import { ContactController } from '@/controllers/contact-controller';
import { serverConfig } from '@/config/serverConfig';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(serverConfig.PORT || 3000, async () => {
  await connectToDatabase();
  console.log(`Server is running at http://localhost:${serverConfig.PORT}`);
});
