import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import Skill from './skills.js'; // Import Skill model after it's defined

const Behaviour = sequelize.define('Behaviour', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skillId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Skills', // Refers to the Skills table
      key: 'id', // Primary key in Skills table
    },
  },
});

export default { Behaviour, Skill };
