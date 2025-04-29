import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Assessment = sequelize.define("Assessment", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
})

export default Assessment;