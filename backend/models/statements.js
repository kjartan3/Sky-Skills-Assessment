import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import Skill from './skills.js';

const Statement = sequelize.Define('Statement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Statement.belongsTo(Skill);
Skill.hasMany(Statement);

export default Statement;