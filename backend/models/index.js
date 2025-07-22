import Statement from './statements.js';
import Behaviour from './behaviours.js';
import Skill from './skills.js';
import User from './User.js';
import Assessment from './assessment.js';
import Response from './response.js';
import Content from './content.js';

Skill.hasMany(Behaviour, { foreignKey: 'skillId' });
Behaviour.belongsTo(Skill, { foreignKey: 'skillId' });

Behaviour.hasMany(Content, { foreignKey: 'behaviourId' });
Content.belongsTo(Behaviour, { foreignKey: 'behaviourId' });

Content.hasMany(Statement, { foreignKey: 'contentId' });
Statement.belongsTo(Content, { foreignKey: 'contentId' });

User.hasMany(Assessment,  {foreignKey: "userId"});
Assessment.belongsTo(User, {foreignKey: "userId"});

Assessment.hasMany(Response, {foreignKey: "assessmentId"});
Response.belongsTo(Assessment, {foreignKey: "assessmentId"});

Statement.hasMany(Response, {foreignKey: "statementId"});
Response.belongsTo(Statement, {foreignKey: "statementId"});





export { Statement, Behaviour, Skill, User, Assessment, Response, Content };
