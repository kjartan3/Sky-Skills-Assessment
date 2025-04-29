import { Sequelize } from 'sequelize';




const isTestEnvironment = process.env.NODE_ENV === 'test'; // Check if we're in test environment

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: isTestEnvironment ? './test-database.sqlite' : './database.sqlite', // Use separate databases for test and production
  logging: process.env.NODE_ENV !== 'test',
});

// Test the connection
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
