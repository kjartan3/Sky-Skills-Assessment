import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Skill = sequelize.define('Skill', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Skill;
