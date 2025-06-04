import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Content = sequelize.define('Content', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    learningLinks: {
        type: DataTypes.JSON,
        allowNull: false,
    },

    behaviourId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Behaviours',
            key: 'id',
          },
    },
});

export default Content;