import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import Behaviour from './behaviour.js'; // Import Behaviour model

const Statement = sequelize.define('Statement', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  behaviourId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Behaviours', // Refers to the Behaviours table
      key: 'id', // Primary key in Behaviours table
    },
  },
});

export default { Statement, Behaviour };

