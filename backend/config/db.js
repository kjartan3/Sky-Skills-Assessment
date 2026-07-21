import { Sequelize } from 'sequelize';

const isTestEnvironment = process.env.NODE_ENV === 'test'; // Check if we're in test environment

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: isTestEnvironment ? './test-database.sqlite' : './database.sqlite',
  logging: process.env.NODE_ENV !== 'test',
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (err) {
    console.error('Error connecting to the database: ', err);
  }
};

testConnection();

export default sequelize;
