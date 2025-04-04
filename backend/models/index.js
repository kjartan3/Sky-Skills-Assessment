// models/index.js
import Statement from './statements.js';
import Behaviour from './behaviours.js';
import Skill from './skills.js';

Skill.hasMany(Behaviour, { foreignKey: 'skillId' });
Behaviour.belongsTo(Skill, { foreignKey: 'skillId' });

Behaviour.hasMany(Statement, { foreignKey: 'behaviourId' });
Statement.belongsTo(Behaviour, { foreignKey: 'behaviourId' });

// Named exports for each model
export { Statement, Behaviour, Skill };
