import { Sequelize } from 'sequelize';

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // This creates a file called database.sqlite in your project directory
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.log('Error connecting to the database: ', err));

export default sequelize;
