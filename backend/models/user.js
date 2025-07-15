import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define("User", {
    userId: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {isEmail: true}
    },
    managerFirstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    managerLastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },  
    orgUnit: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

export default User;