import sequelize from './config/db.js';
import Skill from './models/skills.js'; 
import Behaviour from './models/behaviours.js';
import Statement from './models/statements.js';
import User from './models/User.js';
import Response from './models/response.js';
import Assessment from './models/assessment.js';

const seedDatabase = async () => {
  try {
    // Sync the models with the database (create tables if they don't exist)
    await sequelize.sync({ force: true }); // Resets the database
    
    // Create Skills in the database
    const skills = await Skill.bulkCreate([
        { name: 'Welcoming' },
        { name: 'Creative' },
        { name: 'Simplifying' },
        { name: 'Doing the right thing' },
    ]);

    // Create Behaviours in the database
    const behaviours = await Behaviour.bulkCreate([
        { name: 'Be inclusive by nature', skillId: skills[0].id },
        { name: 'Play as one team', skillId: skills[0].id },
        { name: 'Never stop learning', skillId: skills[0].id },
        { name: 'Be curious', skillId: skills[1].id },
        { name: 'Be ambitious', skillId: skills[1].id },
        { name: 'Embrace challenge', skillId: skills[1].id },
        { name: 'Prioritise ruthlessly', skillId: skills[2].id },
        { name: 'Reduce complexity', skillId: skills[2].id },
        { name: 'Make it better', skillId: skills[2].id },
        { name: 'Own it', skillId: skills[3].id },
        { name: 'Act with integrity', skillId: skills[3].id },
        { name: 'Act with care', skillId: skills[3].id },
    ]);

    // Create Statements for each Behaviour
    const statements = [
        // Be inclusive by nature
        { text: 'I encourage diverse perspectives in discussions.', behaviourId: behaviours[0].id },
        { text: 'I actively listen to others and ensure everyone feels heard.', behaviourId: behaviours[0].id },
        { text: 'I create a welcoming and respectful work environment.', behaviourId: behaviours[0].id },
        { text: 'I collaborate with colleagues from different backgrounds.', behaviourId: behaviours[0].id },

        // Play as one team
        { text: 'I support my teammates to achieve our shared goals.', behaviourId: behaviours[1].id },
        { text: 'I share knowledge and skills to help others succeed.', behaviourId: behaviours[1].id },
        { text: 'I seek and provide constructive feedback.', behaviourId: behaviours[1].id },
        { text: 'I celebrate team successes and acknowledge contributions.', behaviourId: behaviours[1].id },

        // Never stop learning
        { text: 'I actively seek new learning opportunities.', behaviourId: behaviours[2].id },
        { text: 'I apply feedback to improve my performance.', behaviourId: behaviours[2].id },
        { text: 'I stay up-to-date with industry trends and best practices.', behaviourId: behaviours[2].id },
        { text: 'I take on challenges that push me outside my comfort zone.', behaviourId: behaviours[2].id },

        // Be curious
        { text: 'I ask insightful questions to understand problems better.', behaviourId: behaviours[3].id },
        { text: 'I explore different approaches before settling on a solution.', behaviourId: behaviours[3].id },
        { text: 'I seek out new perspectives to broaden my understanding.', behaviourId: behaviours[3].id },
        { text: 'I enjoy experimenting with new ideas and concepts.', behaviourId: behaviours[3].id },

        // Be ambitious
        { text: 'I set high standards for my work and strive to exceed them.', behaviourId: behaviours[4].id },
        { text: 'I proactively take on leadership opportunities.', behaviourId: behaviours[4].id },
        { text: 'I am always looking for ways to push boundaries and innovate.', behaviourId: behaviours[4].id },
        { text: 'I take calculated risks to drive meaningful progress.', behaviourId: behaviours[4].id },

        // Embrace challenge
        { text: 'I remain calm and focused under pressure.', behaviourId: behaviours[5].id },
        { text: 'I tackle difficult tasks with a problem-solving mindset.', behaviourId: behaviours[5].id },
        { text: 'I don’t shy away from constructive criticism.', behaviourId: behaviours[5].id },
        { text: 'I view challenges as opportunities for growth.', behaviourId: behaviours[5].id },

        // Prioritise ruthlessly
        { text: 'I focus on the most impactful tasks.', behaviourId: behaviours[6].id },
        { text: 'I avoid distractions and manage my time effectively.', behaviourId: behaviours[6].id },
        { text: 'I make clear, data-driven decisions on what to prioritise.', behaviourId: behaviours[6].id },
        { text: 'I know when to say no to less important tasks.', behaviourId: behaviours[6].id },

        // Reduce complexity
        { text: 'I simplify processes to increase efficiency.', behaviourId: behaviours[7].id },
        { text: 'I communicate ideas in a clear and concise way.', behaviourId: behaviours[7].id },
        { text: 'I break down complex tasks into manageable steps.', behaviourId: behaviours[7].id },
        { text: 'I find ways to remove unnecessary obstacles in workflows.', behaviourId: behaviours[7].id },

        // Make it better
        { text: 'I am always looking for ways to improve our processes.', behaviourId: behaviours[8].id },
        { text: 'I take feedback seriously and use it to grow.', behaviourId: behaviours[8].id },
        { text: 'I proactively suggest improvements in my team.', behaviourId: behaviours[8].id },
        { text: 'I strive for excellence in everything I do.', behaviourId: behaviours[8].id },

        // Own it
        { text: 'I take responsibility for my actions and decisions.', behaviourId: behaviours[9].id },
        { text: 'I follow through on commitments and deliver results.', behaviourId: behaviours[9].id },
        { text: 'I proactively solve problems instead of passing them on.', behaviourId: behaviours[9].id },
        { text: 'I hold myself accountable for my performance.', behaviourId: behaviours[9].id },

        // Act with integrity
        { text: 'I do the right thing even when no one is watching.', behaviourId: behaviours[10].id },
        { text: 'I am honest and transparent in my communication.', behaviourId: behaviours[10].id },
        { text: 'I stand by my values even under pressure.', behaviourId: behaviours[10].id },
        { text: 'I build trust by acting ethically and fairly.', behaviourId: behaviours[10].id },

        // Act with care
        { text: 'I genuinely listen to and support my colleagues.', behaviourId: behaviours[11].id },
        { text: 'I make an effort to understand how others are feeling.', behaviourId: behaviours[11].id },
        { text: 'I offer help to those who need it, even when not asked.', behaviourId: behaviours[11].id },
        { text: 'I create a positive and respectful work environment.', behaviourId: behaviours[11].id },
    ];

    // Insert Statements into the database
    await Statement.bulkCreate(statements);

    // Add this after inserting Statements

    // Create a test user
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      userId: 1,
    });

    // Create an assessment for the user
    const assessments = await Assessment.bulkCreate([
      { userId: user.userId },
      { userId: user.userId }, // second assessment for the same user
    ]);

    // Get all the statements to generate responses
    const allStatements = await Statement.findAll();

    // Create responses with random scores (1–5) for each statement
    const responses = allStatements.flatMap((statement) => [
      {
        assessmentId: assessments[0].id,
        statementId: statement.id,
        score: Math.floor(Math.random() * 4) + 1,
      },
      {
        assessmentId: assessments[1].id,
        statementId: statement.id,
        score: Math.floor(Math.random() * 4) + 1,
      },
    ]);

    // Insert Responses into the database
    await Response.bulkCreate(responses);


    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

seedDatabase();
