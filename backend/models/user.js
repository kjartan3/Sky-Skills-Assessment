import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import bcrypt from "bcrypt"
import {v4 as uuidv4} from 'uuid'

const User = sequelize.define("User", {
    userId: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true,
        defaultValue: () => uuidv4()
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {isEmail: true},
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.passwordHash) {
                const salt = await bcrypt.genSalt(10);
                user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
            }
        }
    }
});
User.prototype.validatePassword = async function(password) {return await bcrypt.compare(password, this.passwordHash)}

export default User;