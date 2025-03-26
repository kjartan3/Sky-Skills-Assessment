import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Skill = sequelize.Define('Skill', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Skill;
