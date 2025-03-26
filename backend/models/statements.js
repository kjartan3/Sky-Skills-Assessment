import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import Skill from './skills.js'; // Import Skill model after it's defined

const Statement = sequelize.define('Statement', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skillId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Skills', // Refers to the Skills table
      key: 'id', // Refers to the primary key of the Skills table
    },
  },
});

export default Statement;
