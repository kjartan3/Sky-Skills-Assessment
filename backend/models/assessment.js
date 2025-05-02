import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Assessment = sequelize.define("Assessment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // ✅ Makes sure ID is auto-incremented properly
    },
    userId: {
        type: DataTypes.STRING, // ✅ Change to STRING to match SQLite column type
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});


export default Assessment;