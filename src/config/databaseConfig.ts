import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: 'bitespeedBackend',
  username: 'root',
  password: undefined,
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

export default sequelize;