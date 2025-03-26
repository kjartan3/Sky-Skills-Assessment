import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import Statement from './statements.js';

const Skill = sequelize.Define('Skill', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Skill.hasMany(Statement, { foreignKey: 'skillId' });

export default Skill;
