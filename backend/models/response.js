import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Response = sequelize.define("Response", {
    assessmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Assessments",
            key: "id",
        },
    },
    statementId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Statements",
            key: "id",
        },
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 4,
        },
    },

});

export default Response;