import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';


const Statement = sequelize.define('Statement', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Contents', // Refers to the Behaviours table
      key: 'id', // Primary key in Behaviours table
    },
  },
});

export default Statement;

