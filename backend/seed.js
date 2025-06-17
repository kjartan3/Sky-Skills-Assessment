import sequelize from './config/db.js';
import Skill from './models/skills.js'; 
import Behaviour from './models/behaviours.js';
import Statement from './models/statements.js';
import User from './models/User.js';
import Response from './models/response.js';
import Assessment from './models/assessment.js';
import Content from './models/content.js';

const seedDatabase = async () => {
  try {
    // Sync the models with the database (create tables if they don't exist)
    await sequelize.sync({ force: true }); // Resets the database
    
    // Create Skills in the database
    const skills = await Skill.bulkCreate([
        { 
          name: 'Welcoming', 
          description: 'We are inclusive, collaborative and respectful, creating a sense of belonging and opportunity for everyone.' 
        },
        { 
          name: 'Creative', 
          description: 'We are ambitious and innovative, challenging the status quo to raise the bar on quality for customers.' 
        },
        { 
          name: 'Simplifying', 
          description: 'We bring clarity, cut through complexity and remove obstacles.' 
        },
        { 
          name: 'Doing the right thing', 
          description: 'We are fair and act with integrity, each one of us taking responsibility.' 
        },
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

    const contentData = [
      // For Behavior: Be Inclusive by Nature (behaviours[0])
      {
        title: 'Emotional Intelligence',
        description:
          'Emotional intelligence is about recognising, understanding, and managing our own emotions and the emotions of others. Whether it’s learning how to build better relationships or how to handle difficult conversations',
        behaviourId: behaviours[0].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/emotional-intelligence-beginners',
          Intermediate: 'https://sky.edcast.com/pathways/copy-of-emotional-intelligence-beginner',
          Advanced: 'https://sky.edcast.com/pathways/emotional-intelligence-advanced',
        },
      },
      {
        title: 'Building Trust',
        description:
          'Building trust is about creating and maintaining reliable and honest relationships. Whether it’s learning how to communicate transparently or how to follow through on commitments',
        behaviourId: behaviours[0].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/building-trust-building-trust',
          Intermediate: 'https://sky.edcast.com/pathways/building-trust-intermediate-building',
          Advanced: 'https://sky.edcast.com/pathways/building-trust-advanced-building',
        },
      },
    
      // For Behavior: Play as One Team (behaviours[1])
      {
        title: 'Our Sky Story',
        description:
          "Our Sky story is about what we stand for as a company, and where we’re going. It unpacks our new purpose and our priorities for the year ahead and beyond. It shows how we are setting ourselves up for success, and how we believe we will win. We all have a vital role to play in sharing our Sky story with our customers, people, partners and stakeholders.",
        behaviourId: behaviours[1].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/journey/our-sky-story-our',
          Intermediate: 'https://sky.edcast.com/journey/our-sky-story-our',
          Advanced: 'https://sky.edcast.com/journey/our-sky-story-our',
        },
      },
      {
        title: 'Collaboration',
        description:
          'Collaboration is about working collectively, influencing others, and combining expertise to achieve shared goals. Whether it’s learning how to build effective teams or how to foster a collaborative environment',
        behaviourId: behaviours[1].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/collaboration',
          Intermediate: 'https://sky.edcast.com/pathways/copy-of-collaboration-beginner',
          Advanced: 'https://sky.edcast.com/pathways/collaboration-advanced',
        },
      },
    
      // For Behavior: Never Stop Learning (behaviours[2])
      {
        title: 'Growth Mindset',
        description:
          'Growth mindset is about approaching obstacles and setbacks as opportunities for development and learning. Whether it’s learning how to embrace challenges or how to persist in the face of setbacks',
        behaviourId: behaviours[2].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/growth-mindset-beginners',
          Intermediate: 'https://sky.edcast.com/pathways/copy-of-accelerate-your-career-growth-mindset-for-managers',
          Advanced: 'https://sky.edcast.com/pathways/growth-mindset-advanced',
        },
      },
      {
        title: 'Feedback',
        description:
          'Feedback is about providing the right balance of challenge and support while being open to guidance from others. Whether it’s learning how to give constructive feedback or how to receive it gracefully',
        behaviourId: behaviours[2].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/feedback-beginner',
          Intermediate: 'https://sky.edcast.com/pathways/feedback-intermediate',
          Advanced: 'https://sky.edcast.com/pathways/feedback-advanced',
        },
      },
    
      // For Behavior: Be Curious (behaviours[3])
      {
        title: 'Curiosity',
        description:
          'Curiosity is all about having a hunger to know more about something and to learn about the world around you. Whether it’s discovering what drives your curiosity or learning how to foster it',
        behaviourId: behaviours[3].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/digital-curiosity-beginner',
          Intermediate: 'https://sky.edcast.com/pathways/curiosity-intermediate',
          Advanced: 'https://sky.edcast.com/pathways/curiosity-advanced',
        },
      },
      {
        title: 'Disruptive Thinking',
        description:
          'Disruptive thinking is about challenging the status quo and thinking creatively to drive innovation. Whether it’s learning how to generate breakthrough ideas or how to implement them',
        behaviourId: behaviours[3].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/disruptive-thinking-beginner-disruptive',
          Intermediate: 'https://sky.edcast.com/pathways/disruptive-thinking-intermediate-disruptive',
          Advanced: 'https://sky.edcast.com/pathways/disruptive-thinking-advanced-disruptive',
        },
      },
    
      // For Behavior: Be Ambitious (behaviours[4])
      {
        title: 'Agile Thinking',
        description:
          'Agile thinking is about being able to adopt our thinking and thrive in a fast-paced environment. Whether it’s discovering what creates an agile mindset or learning how to strengthen your own',
        behaviourId: behaviours[4].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/agile-thinking-beginner',
          Intermediate: 'https://sky.edcast.com/pathways/copy-of-agile-thinking-beginner',
          Advanced: 'https://sky.edcast.com/pathways/copy-of-agile-thinking-intermediate',
        },
      },
      {
        title: 'Innovation',
        description:
          'Innovation is about creating and implementing new ideas, processes, or products that add value. Whether it’s learning how to think creatively or how to bring innovative solutions to life',
        behaviourId: behaviours[4].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/innovative-thinking',
          Intermediate: 'https://sky.edcast.com/pathways/copy-of-innovative-thinking-beginner-creating-developing',
          Advanced: 'https://sky.edcast.com/pathways/innovative-thinking-advanced',
        },
      },
    
      // For Behavior: Embrace Challenge (behaviours[5])
      {
        title: 'Adaptability',
        description:
          'Navigating change with resilience by staying flexible, learning from challenges, and turning setbacks into opportunities for growth',
        behaviourId: behaviours[5].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/change-management',
          Intermediate: 'https://sky.edcast.com/pathways/change-management-for-managers',
          Advanced: 'https://sky.edcast.com/pathways/change-management-for-leaders',
        },
      },
      {
        title: 'Communication',
        description:
          'Communication is about expressing and receiving information, ideas, and feelings effectively. Whether it’s learning how to articulate your thoughts clearly or how to listen actively',
        behaviourId: behaviours[5].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/communication-for-beginners',
          Intermediate: 'https://sky.edcast.com/pathways/copy-of-communication-beginner',
          Advanced: 'https://sky.edcast.com/pathways/copy-of-communication-advanced',
        },
      },
    
      // For Behavior: Prioritise Ruthlessly (behaviours[6])
      {
        title: 'Prioritisation',
        description:
          'Prioritisation is about identifying the things that have the greatest impact and making them happen. Whether it’s learning how to assess tasks or how to focus on what matters most',
        behaviourId: behaviours[6].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/prioritisation',
          Intermediate: 'https://sky.edcast.com/pathways/copy-of-prioritisation-beginner',
          Advanced: 'https://sky.edcast.com/pathways/prioritisation-advanced',
        },
      },
      {
        title: 'Customer Focus',
        description:
          'Customer focus is about understanding your role in creating an inclusive culture where we are all able to be our best and authentic selves. Whether it’s learning how to meet customer needs or how to exceed their expectations',
        behaviourId: behaviours[6].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/customer-focus-beginner',
          Intermediate: 'https://sky.edcast.com/pathways/ECL-65b63437-ff9a-412e-9a85-f5bdd9ff0e57',
          Advanced: 'https://sky.edcast.com/pathways/ECL-64aef6a5-b697-4201-92e8-3a7e4eaf45b9',
        },
      },
    
      // For Behavior: Reduce Complexity (behaviours[7])
      {
        title: 'Critical Thinking',
        description:
          'Critical thinking is all about analysing and interrogating information to form a judgement. It drives us to seek evidence and consider different perspectives before determining a position. Whether it be how to create simple habits, ask the right questions or make better decisions',
        behaviourId: behaviours[7].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/critical-thinking',
          Intermediate: 'https://sky.edcast.com/pathways/critical-thinking-intermediate',
          Advanced: 'https://sky.edcast.com/pathways/copy-of-critical-thinking-advanced',
        },
      },
      {
        title: 'AI Literacy',
        description:
          'Understanding how artificial intelligence works, its capabilities and limitations, and how to use and apply it effectively, safely and ethically',
        behaviourId: behaviours[7].id,
        learningLinks: {
          Beginner: '',
          Intermediate: '',
          Advanced: '',
        },
      },
    
      // For Behavior: Make It Better (behaviours[8])
      {
        title: 'Continuous Improvement',
        description:
          'Continuous Improvement is about consistently seeking ways to enhance processes, products, or services by iterating and evolving work through customer centricity and dynamic feedback. Whether it’s learning how to identify areas for improvement or how to implement incremental changes',
        behaviourId: behaviours[8].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/continuous-improvement-beginner-continuous',
          Intermediate: 'https://sky.edcast.com/pathways/continuous-improvement-intermediate-continuous',
          Advanced: 'https://sky.edcast.com/pathways/continuous-improvement-advanced-continuous',
        },
      },
      {
        title: 'Data Fluency',
        description:
          'Data fluency is all about how we turn data into stories by identifying and interpreting patterns. This pathway will give you a solid foundation in understanding and utilising data effectively, without diving too deep into technical details.',
        behaviourId: behaviours[8].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/data-fluency-beginner',
          Intermediate: 'https://sky.edcast.com/pathways/data-fluency-intermediate',
          Advanced: 'https://sky.edcast.com/pathways/data-fluency-advanced-data',
        },
      },
    
      // For Behavior: Own It (behaviours[9])
      {
        title: 'Accountability',
        description:
          'Accountability is about taking ownership of your actions and their outcomes. Whether it’s learning how to set clear expectations or how to hold yourself and others accountable',
        behaviourId: behaviours[9].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/accountability-beginner',
          Intermediate: 'https://sky.edcast.com/pathways/accountability-intermediate',
          Advanced: 'https://sky.edcast.com/pathways/accountability-advanced',
        },
      },
      {
        title: 'Empowering',
        description:
          'Empowering others is about creating an environment that enables autonomy to thrive. Whether it’s learning how to delegate effectively or how to inspire others',
        behaviourId: behaviours[9].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/empowering-others-beginner',
          Intermediate: 'https://sky.edcast.com/pathways/copy-of-empowering-others-beginner',
          Advanced: 'https://sky.edcast.com/pathways/copy-of-empowering-others-intermediate',
        },
      },
    
      // For Behavior: Act with Integrity (behaviours[10])
      {
        title: 'Transparency',
        description:
          'Transparency is about being open and honest in your communications and actions. Whether it’s learning how to share information effectively or how to build trust through transparency',
        behaviourId: behaviours[10].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/transparency-beginner',
          Intermediate: 'https://sky.edcast.com/pathways/transparency-intermediate',
          Advanced: 'https://sky.edcast.com/pathways/transparency-advanced',
        },
      },
      {
        title: 'Commercial Responsibility',
        description:
          'Commercial responsibility is about understanding the financial and operational aspects of the business and making decisions that contribute to its success. Whether it’s learning how to manage budgets or how to drive profitability',
        behaviourId: behaviours[10].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/commercial-responsibility-beginner',
          Intermediate: 'https://sky.edcast.com/pathways/commercial-responsibility-intermediate',
          Advanced: 'https://sky.edcast.com/pathways/commercial-responsibility-advanced',
        },
      },
    
        // For Behavior: Act with Care (behaviours[11])
      {
        title: 'Right Conversations',
        description:
          'Right conversations are about having meaningful and productive dialogues that drive results. Whether it’s learning how to ask the right questions or how to listen actively',
        behaviourId: behaviours[11].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/right-conversations-beginner',
          Intermediate: 'https://sky.edcast.com/pathways/right-conversations-intermediate',
          Advanced: 'https://sky.edcast.com/pathways/right-conversations-advanced',
        },
      },
      {
        title: 'Listening',
        description:
          "Listening is about actively paying attention to and understanding the messages being communicated. Whether it's learning how to improve your listening skills or how to respond effectively",
        behaviourId: behaviours[11].id,
        learningLinks: {
          Beginner: 'https://sky.edcast.com/pathways/listening-beginner',
          Intermediate: 'https://sky.edcast.com/pathways/listening-intermediate',
          Advanced: 'https://sky.edcast.com/pathways/listening-advanced',
        },
      },
    ];


    await Content.bulkCreate(contentData);

    const createdContent = await Content.findAll({
      order: [[ "id", "ASC" ]]
    })

    const statementsData = [
      { text: `I actively invite others to speak that have yet to share their opinions.`, contentId: createdContent[0].id },
      { text: `I spend time consciously getting to know my team and colleagues.`, contentId: createdContent[1].id },
     
      { text: `I have a good understanding of Sky's priorities and products.`, contentId: createdContent[2].id },
      { text: `I collaborate effectively by considering how different personalities might respond to how I communicate.`, contentId: createdContent[3].id },
     
      { text: `I am comfortable with failure, I see it as a learning experience.`, contentId: createdContent[4].id },
      { text: `I continuously seek feedback from others on how I can do my job even better. I don't just wait for the end of the year.`, contentId: createdContent[5].id },
     
      { text: `I ask great questions to understand other points of view.`, contentId: createdContent[6].id },
      { text: `I embrace new technology, including AI, to best deliver results.`, contentId: createdContent[7].id },
     
      { text: `I push myself out of my comfort zone by doing things that sometimes feel uncomfortable.`, contentId: createdContent[8].id },
      { text: `I innovate by improving ways of working, processes or products that add value.`, contentId: createdContent[9].id },
     
      { text: `I manage my energy levels through the day to keep my resilience through times of change.`, contentId: createdContent[10].id },
      { text: `I communicate complex big topics in a way that resonates with others.`, contentId: createdContent[11].id },
     
      { text: `I prioritise what I work on (and my team*) by asking myself 'does this add the most value?'`, contentId: createdContent[12].id },
      { text: `I quickly spot what matters for customers and/or stakeholders.`, contentId: createdContent[13].id },
     
      { text: `When I have a new idea, I effectively tell stories by analysing multiple sources of data to bring it to life.`, contentId: createdContent[14].id },
      { text: `I feel confident using AI for day to day tasks in my role.`, contentId: createdContent[15].id },
     
      { text: `I seek opporunities to constantly look at 'how we can make things even better and simplified'.`, contentId: createdContent[16].id },
      { text: `I focus on what matters by using data and not just my gut feeling.`, contentId: createdContent[17].id },
     
      { text: `I hold myself (and my team*) to account by doing what I'll say I'll do.`, contentId: createdContent[18].id },
      { text: `I build confidence in others by recognising achievements and celebrating progress.`, contentId: createdContent[19].id },
     
      { text: `I am open about what I don't know and ask for help when I need it.`, contentId: createdContent[20].id },
      { text: `I make everyday decisions with Sky's operational and financial context in mind.`, contentId: createdContent[21].id },
     
      { text: `I use the strength of my relationships to challenge ideas contructively, encouraging diverse perspectives while mantaining alignment and mutual respect.`, contentId: createdContent[22].id },
      { text: `I manage my day-to-day distractions, to give my full attention to others - both face to face and/or virtual.`, contentId: createdContent[23].id },
    ];
     
    await Statement.bulkCreate(statementsData);


    // Add this after inserting Statements

    const monthsAgo = (months) => {
      const date = new Date();
      date.setMonth(date.getMonth() - months);
      return date;
    }
 
    // Create an assessment for the user
    const assessments = await Assessment.bulkCreate([
      { userId: 'khj551', createdAt: monthsAgo(11), updatedAt: new Date()}, 
      { userId: 'khj551', createdAt: monthsAgo(2), updatedAt: new Date()}, 
      { userId: 'khj551', createdAt: monthsAgo(5), updatedAt: new Date()},
      { userId: 'bre896', createdAt: monthsAgo(11), updatedAt: new Date()}, 
      { userId: 'bre896', createdAt: monthsAgo(2), updatedAt: new Date()}, 
      { userId: 'bre896', createdAt: monthsAgo(5), updatedAt: new Date()},  
    ],
    { returning: true }
    );
 
    // Get all the statements to generate responses
    const allStatements = await Statement.findAll();
 
    // Create responses with random scores (1–5) for each statement
    const responses = allStatements.flatMap((statement) => [
      {
        assessmentId : assessments[0].id,
        statementId: statement.id,
        score: Math.floor(Math.random() * 4) + 1,
      },
      {
        assessmentId : assessments[1].id,
        statementId: statement.id,
        score: Math.floor(Math.random() * 4) + 1,
      },
      {
        assessmentId : assessments[2].id,
        statementId: statement.id,
        score: Math.floor(Math.random() * 4) + 1,
      },
      {
        assessmentId : assessments[3].id,
        statementId: statement.id,
        score: Math.floor(Math.random() * 4) + 1,
      },
      {
        assessmentId : assessments[4].id,
        statementId: statement.id,
        score: Math.floor(Math.random() * 4) + 1,
      },
      {
        assessmentId : assessments[5].id,
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