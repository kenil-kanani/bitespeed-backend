import { Sequelize } from 'sequelize';
import { serverConfig } from '@/config/serverConfig';

// const sequelize = new Sequelize({
//   database: 'bitespeedBackend',
//   username: 'root',
//   password: undefined,
//   host: 'localhost',
//   dialect: 'mysql',
//   logging: false,
// });

const sequelize = new Sequelize({
  database: serverConfig.DATABASE_NAME,
  username: serverConfig.DATABASE_USERNAME,
  password: serverConfig.DATABASE_PASSWORD,
  host: serverConfig.DATABASE_HOST,
  dialect: 'mysql',
  logging: false,
});

export default sequelize;