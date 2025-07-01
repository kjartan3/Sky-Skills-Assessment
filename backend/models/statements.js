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
      model: 'Contents',
      key: 'id',
    },
  },
  guidanceText: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});


export default Statement;

