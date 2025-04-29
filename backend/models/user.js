import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define("User", {
    userId: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

export default User;