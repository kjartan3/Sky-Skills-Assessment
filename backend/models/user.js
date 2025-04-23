import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const bcrypt = require('bcrypt');

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