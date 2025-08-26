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
    console.log('🔄 Dropping existing tables (except Assessments & Responses)...');

    // Uncomment the below when first starting new server! 
    //  await sequelize.sync({ force: true });
    console.log('🔄 Resetting tables…');
    await Statement.drop();
    await Content.drop();
    await Behaviour.drop();
    await Skill.drop();

    // Resync models
    await Skill.sync();
    await Behaviour.sync();
    await Content.sync();
    await Statement.sync();

    console.log('🌱 Seeding data…');
    // Create Skills in the database
    // Seed Skills with static IDs
const skills = await Promise.all([
  Skill.upsert({
    id: 1,
    name: 'Welcoming',
    description:
      'We are inclusive, collaborative and respectful, creating a sense of belonging and opportunity for everyone.',
  }),
  Skill.upsert({
    id: 2,
    name: 'Creative',
    description:
      'We are ambitious and innovative, challenging the status quo to raise the bar on quality for customers.',
  }),
  Skill.upsert({
    id: 3,
    name: 'Simplifying',
    description: 'We bring clarity, cut through complexity and remove obstacles.',
  }),
  Skill.upsert({
    id: 4,
    name: 'Doing the right thing',
    description: 'We are fair and act with integrity, each one of us taking responsibility.',
  }),
]);

// Skill references for behaviour linking
const welcomingId = 1;
const creativeId = 2;
const simplifyingId = 3;
const rightThingId = 4;

// Seed Behaviours with static IDs
await Promise.all([
  Behaviour.upsert({ id: 1, name: 'Be inclusive by nature', skillId: welcomingId }),
  Behaviour.upsert({ id: 2, name: 'Play as one team', skillId: welcomingId }),
  Behaviour.upsert({ id: 3, name: 'Never stop learning', skillId: welcomingId }),

  Behaviour.upsert({ id: 4, name: 'Be curious', skillId: creativeId }),
  Behaviour.upsert({ id: 5, name: 'Be ambitious', skillId: creativeId }),
  Behaviour.upsert({ id: 6, name: 'Embrace challenge', skillId: creativeId }),

  Behaviour.upsert({ id: 7, name: 'Prioritise ruthlessly', skillId: simplifyingId }),
  Behaviour.upsert({ id: 8, name: 'Reduce complexity', skillId: simplifyingId }),
  Behaviour.upsert({ id: 9, name: 'Make it better', skillId: simplifyingId }),

  Behaviour.upsert({ id: 10, name: 'Own it', skillId: rightThingId }),
  Behaviour.upsert({ id: 11, name: 'Act with integrity', skillId: rightThingId }),
  Behaviour.upsert({ id: 12, name: 'Act with care', skillId: rightThingId }),
]);


    const contentData = [
      // For Behavior: Be Inclusive by Nature (behaviours[0])
        {
    id: 1,
    title: 'Emotional Intelligence',
    description: 'Emotional intelligence is about recognising, understanding, and managing our own emotions and the emotions of others',
    behaviourId: 1,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/emotional-intelligence-beginners',
      Intermediate: 'https://sky.edcast.com/pathways/copy-of-emotional-intelligence-beginner',
      Advanced: 'https://sky.edcast.com/pathways/emotional-intelligence-advanced',
    },
  },
  {
    id: 2,
    title: 'Building Trust',
    description: 'Building trust is about creating and maintaining reliable and honest relationships',
    behaviourId: 1,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/building-trust-building-trust',
      Intermediate: 'https://sky.edcast.com/pathways/building-trust-intermediate-building',
      Advanced: 'https://sky.edcast.com/pathways/building-trust-advanced-building',
    },
  },
  {
    id: 3,
    title: 'Our Sky Story',
    description: "Our Sky story is about what we stand for as a company, and where we’re going",
    behaviourId: 2,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/journey/our-sky-story-our',
      Intermediate: 'https://sky.edcast.com/journey/our-sky-story-our',
      Advanced: 'https://sky.edcast.com/journey/our-sky-story-our',
    },
  },
  {
    id: 4,
    title: 'Collaboration',
    description: 'Collaboration is about working collectively, influencing others',
    behaviourId: 2,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/collaboration',
      Intermediate: 'https://sky.edcast.com/pathways/copy-of-collaboration-beginner',
      Advanced: 'https://sky.edcast.com/pathways/collaboration-advanced',
    },
  },
  {
    id: 5,
    title: 'Growth Mindset',
    description: 'Growth mindset is about approaching obstacles and setbacks as opportunities for development',
    behaviourId: 3,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/growth-mindset-beginners',
      Intermediate: 'https://sky.edcast.com/pathways/copy-of-accelerate-your-career-growth-mindset-for-managers',
      Advanced: 'https://sky.edcast.com/pathways/growth-mindset-advanced',
    },
  },
  {
    id: 6,
    title: 'Feedback',
    description: 'Feedback is about providing the right balance of challenge and support',
    behaviourId: 3,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/feedback-beginner',
      Intermediate: 'https://sky.edcast.com/pathways/feedback-intermediate',
      Advanced: 'https://sky.edcast.com/pathways/feedback-advanced',
    },
  },
  {
    id: 7,
    title: 'Curiosity',
    description: 'Curiosity is all about having a hunger to know more about something and to learn about the world around you',
    behaviourId: 4,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/digital-curiosity-beginner',
      Intermediate: 'https://sky.edcast.com/pathways/curiosity-intermediate',
      Advanced: 'https://sky.edcast.com/pathways/curiosity-advanced',
    },
  },
  {
    id: 8,
    title: 'Disruptive Thinking',
    description: 'Disruptive thinking is about challenging the status quo and thinking creatively',
    behaviourId: 4,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/disruptive-thinking-beginner-disruptive',
      Intermediate: 'https://sky.edcast.com/pathways/disruptive-thinking-intermediate-disruptive',
      Advanced: 'https://sky.edcast.com/pathways/disruptive-thinking-advanced-disruptive',
    },
  },
  {
    id: 9,
    title: 'Agile Thinking',
    description: 'Agile thinking is about being able to adopt our thinking and thrive in a fast-paced environment',
    behaviourId: 5,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/agile-thinking-beginner',
      Intermediate: 'https://sky.edcast.com/pathways/copy-of-agile-thinking-beginner',
      Advanced: 'https://sky.edcast.com/pathways/copy-of-agile-thinking-intermediate',
    },
  },
  {
    id: 10,
    title: 'Innovation',
    description: 'Innovation is about creating and implementing new ideas, processes, or products that add value',
    behaviourId: 5,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/innovative-thinking',
      Intermediate: 'https://sky.edcast.com/pathways/copy-of-innovative-thinking-beginner-creating-developing',
      Advanced: 'https://sky.edcast.com/pathways/innovative-thinking-advanced',
    },
  },
  {
    id: 11,
    title: 'Adaptability',
    description: 'Navigating change with resilience by staying flexible, learning from challenges',
    behaviourId: 6,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/change-management',
      Intermediate: 'https://sky.edcast.com/pathways/change-management-for-managers',
      Advanced: 'https://sky.edcast.com/pathways/change-management-for-leaders',
    },
  },
  {
    id: 12,
    title: 'Communication',
    description: 'Communication is about expressing and receiving information, ideas, and feelings effectively',
    behaviourId: 6,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/communication-for-beginners',
      Intermediate: 'https://sky.edcast.com/pathways/copy-of-communication-beginner',
      Advanced: 'https://sky.edcast.com/pathways/copy-of-communication-advanced',
    },
  },
  {
    id: 13,
    title: 'Prioritisation',
    description: 'Prioritisation is about identifying the things that have the greatest impact',
    behaviourId: 7,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/prioritisation',
      Intermediate: 'https://sky.edcast.com/pathways/copy-of-prioritisation-beginner',
      Advanced: 'https://sky.edcast.com/pathways/prioritisation-advanced',
    },
  },
  {
    id: 14,
    title: 'Customer Focus',
    description: 'Customer focus is about understanding your role in creating an inclusive culture',
    behaviourId: 7,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/customer-focus-beginner',
      Intermediate: 'https://sky.edcast.com/pathways/ECL-65b63437-ff9a-412e-9a85-f5bdd9ff0e57',
      Advanced: 'https://sky.edcast.com/pathways/ECL-64aef6a5-b697-4201-92e8-3a7e4eaf45b9',
    },
  },
  {
    id: 15,
    title: 'Critical Thinking',
    description: 'Critical thinking is all about analysing and interrogating information to form a judgement',
    behaviourId: 8,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/critical-thinking',
      Intermediate: 'https://sky.edcast.com/pathways/critical-thinking-intermediate',
      Advanced: 'https://sky.edcast.com/pathways/copy-of-critical-thinking-advanced',
    },
  },
  {
    id: 16,
    title: 'AI Literacy',
    description: 'Understanding how artificial intelligence works, its capabilities and limitations',
    behaviourId: 8,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/journey/ai-literacy-build',
      Intermediate: 'https://sky.edcast.com/journey/ai-literacy-intermediate-take',
      Advanced: 'https://sky.edcast.com/journey/ai-literacy-advanced-in-depth-tech',
    },
  },
  {
    id: 17,
    title: 'Continuous Improvement',
    description: 'Continuous Improvement is about consistently seeking ways to enhance processes',
    behaviourId: 9,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/continuous-improvement-beginner-continuous',
      Intermediate: 'https://sky.edcast.com/pathways/continuous-improvement-intermediate-continuous',
      Advanced: 'https://sky.edcast.com/pathways/continuous-improvement-advanced-continuous',
    },
  },
  {
    id: 18,
    title: 'Data Fluency',
    description: 'Data fluency is all about how we turn data into stories by identifying and interpreting patterns',
    behaviourId: 9,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/data-fluency-beginner',
      Intermediate: 'https://sky.edcast.com/pathways/data-fluency-intermediate',
      Advanced: 'https://sky.edcast.com/pathways/data-fluency-advanced-data',
    },
  },  {
    id: 19,
    title: 'Accountability',
    description: 'Accountability is about taking ownership of your actions and their outcomes. Whether it’s learning how to set clear expectations or how to hold yourself and others accountable',
    behaviourId: 10,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/accountability-beginner',
      Intermediate: 'https://sky.edcast.com/pathways/accountability-intermediate',
      Advanced: 'https://sky.edcast.com/pathways/accountability-advanced',
    },
  },
  {
    id: 20,
    title: 'Empowering Others',
    description: 'Empowering others is about creating an environment that enables autonomy to thrive. Whether it’s learning how to delegate effectively or how to inspire others',
    behaviourId: 10,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/empowering-others-beginner',
      Intermediate: 'https://sky.edcast.com/pathways/copy-of-empowering-others-beginner',
      Advanced: 'https://sky.edcast.com/pathways/copy-of-empowering-others-intermediate',
    },
  },
  {
    id: 21,
    title: 'Transparency',
    description: 'Transparency is about being open and honest in your communications and actions. Whether it’s learning how to share information effectively or how to build trust through transparency',
    behaviourId: 11,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/transparency-beginner',
      Intermediate: 'https://sky.edcast.com/pathways/transparency-intermediate',
      Advanced: 'https://sky.edcast.com/pathways/transparency-advanced',
    },
  },
  {
    id: 22,
    title: 'Commercial Responsibility',
    description: 'Commercial responsibility is about understanding the financial and operational aspects of the business and making decisions that contribute to its success. Whether it’s learning how to manage budgets or how to drive profitability',
    behaviourId: 11,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/commercial-responsibility-beginner',
      Intermediate: 'https://sky.edcast.com/pathways/commercial-responsibility-intermediate',
      Advanced: 'https://sky.edcast.com/pathways/commercial-responsibility-advanced',
    },
  },
  {
    id: 23,
    title: 'Right Conversations',
    description: 'Right conversations are about having meaningful and productive dialogues that drive results. Whether it’s learning how to ask the right questions or how to listen actively',
    behaviourId: 12,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/right-conversations-beginner',
      Intermediate: 'https://sky.edcast.com/pathways/right-conversations-intermediate',
      Advanced: 'https://sky.edcast.com/pathways/right-conversations-advanced',
    },
  },
  {
    id: 24,
    title: 'Listening',
    description: "Listening is about actively paying attention to and understanding the messages being communicated. Whether it's learning how to improve your listening skills or how to respond effectively",
    behaviourId: 12,
    learningLinks: {
      Beginner: 'https://sky.edcast.com/pathways/listening-beginner',
      Intermediate: 'https://sky.edcast.com/pathways/listening-intermediate',
      Advanced: 'https://sky.edcast.com/pathways/listening-advanced',
    },
  }
];

await Promise.all(
  contentData.map((item) =>
    Content.upsert({
      id: item.id,
      title: item.title,
      description: item.description,
      behaviourId: item.behaviourId,
      learningLinks: item.learningLinks,
    })
  )
);


    

   const createdContent = await Content.findAll({ order: [['id', 'ASC']] });

const statementsData = [
  {
    text: 'I actively invite others to speak that have yet to share their opinions.',
    guidanceText: 'Reflect on how you understand and manage emotions. Think about how you notice reactions, communicate sensitively, and lead with empathy.',
  },
  {
    text: 'I spend time consciously getting to know my team and colleagues.',
    guidanceText: 'Evaluate how you build honest and reliable relationships. Consider how you support others, stay accountable, and understand how others perceive you.',
  },
  {
    text: "I consider Sky's priorities and products in my every day work",
    guidanceText: 'Think about how your work aligns with Sky’s bigger picture. Reflect on how you involve others, understand systems, and plan strategically across teams.',
  },
  {
    text: 'I collaborate effectively by considering how different personalities might respond to how I communicate.',
    guidanceText: 'Assess how you work with others to achieve shared goals. Consider how you contribute, include others, and build helpful relationships.',
  },
  {
    text: 'I am comfortable with mistakes, I see it as a learning experience.',
    guidanceText: 'Reflect on how you view challenges as opportunities. Think about how you learn from setbacks, adapt plans, and stay resilient.',
  },
  {
    text: "I continuously seek feedback from others on how I can do my job even better (I don't just wait for the end of the year).",
    guidanceText: 'Reflect on how you give and receive feedback. Consider how you identify strengths, reflect on challenges, and communicate constructively.',
  },
  {
    text: 'I ask curious questions to understand other points of view.',
    guidanceText: 'Explore your desire to learn and understand more. Reflect on how you ask open questions and approach new challenges with a positive mindset.',
  },
  {
    text: 'I embrace new technology, including AI, to best deliver results.',
    guidanceText: 'Think about how you challenge the norm and generate creative ideas. Consider how you identify patterns and reflect with others to improve.',
  },
  {
    text: 'I push myself out of my comfort zone by doing things that sometimes feel uncomfortable.',
    guidanceText: 'Assess how well you adapt in fast-paced situations. Think about how you manage reactions, balance workloads, and plan flexibly.',
  },
  {
    text: 'I innovate by improving ways of working, processes or products to add value.',
    guidanceText: 'Reflect on how you create and implement new ideas. Consider how you identify opportunities, stay curious, and foster creativity in others.',
  },
  {
    text: 'I keep my resilience through times of change.',
    guidanceText: 'Reflect on how you take ownership of your energy and wellbeing throughout the day, and how you use intentional actions to stay focused, grounded and adaptable. ',
  },
  {
    text: 'I communicate complex topics in a way that resonates with others.',
    guidanceText: "Consider how you organise your thoughts, listen actively, respond to others' ideas and engage your audience effectively.",
  },
  {
    text: "I prioritise what I work on (and my team) by asking myself 'what matters most?'",
    guidanceText: 'Reflect on how you focus on what matters most. Think about how you manage resources, order tasks, and plan strategically.',
  },
  {
    text: 'I quickly spot what matters for customers and/or stakeholders.',
    guidanceText: 'Think about how you contribute to an inclusive and supportive environment. Consider how you express yourself, support others, and handle sensitive topics.',
  },
  {
    text: 'When I have a new idea, I analyse multiple sources of data to bring it to life.',
    guidanceText: 'Think about how you analyse information and challenge assumptions. Reflect on how you seek different perspectives and use questions to deepen understanding.',
  },
  {
    text: 'I feel confident using AI for day to day tasks in my role.',
    guidanceText: 'Reflect on how actively you explore and apply AI tools to streamline your daily work. Think about how you make informed choices about when and how to use AI.',
  },
  {
    text: "I am constantly looking for opportunities to simplify my work'.",
    guidanceText: 'Assess how you seek and implement improvements. Consider how you generate ideas, challenge assumptions, and use feedback to evolve your work',
  },
  {
    text: 'I focus on what matters by using data and not just my gut feeling.',
    guidanceText: 'Think about how you interpret data to tell meaningful stories. Reflect on how you find information, recognise patterns, and adapt plans using insights.',
  },
  {
    text: "I hold myself (and my team*) to account by doing what I'll say I'll do.",
    guidanceText: 'Think about how you take ownership of your actions. Reflect on how you complete tasks, stay accountable, and involve others in achieving goals.',
  },
  {
    text: 'I build confidence in others by recognising achievements and celebrating progress.',
    guidanceText: 'Assess how you enable others to thrive. Consider how you support, motivate, and inspire people to take initiative and grow.',
  },
  {
    text: "I am open about what I don't know and ask for help when I need it.",
    guidanceText: 'Reflect on how open and honest you are. Think about how you share information accurately, use facts, and communicate clearly in tough situations.',
  },
  {
    text: "I make everyday decisions with Sky's operational and financial context in mind.",
    guidanceText: 'Evaluate how you contribute to business success. Consider how you collaborate, avoid conflict, and identify risks and opportunities.',
  },
  {
    text: 'I use the strength of my relationships to challenge ideas contructively, encouraging diverse perspectives while mantaining alignment and mutual respect.',
    guidanceText: 'Think about how you engage in meaningful dialogue. Reflect on how you ask questions, adapt your communication, and negotiate effectively.',
  },
  {
    text: 'I give my full attention to others - both face to face and/or virtual.',
    guidanceText: 'Assess how well you pay attention and understand others. Consider how you actively listen, and recognise influence in conversations.',
  },
];


await Promise.all(
  statementsData.map((statement, index) =>
    Statement.upsert({
      id: index + 1,
      text: statement.text,
      guidanceText: statement.guidanceText,
      contentId: createdContent[index].id,
    })
  )
);


   


    const monthsAgo = (months) => {
      const date = new Date();
      date.setMonth(date.getMonth() - months);
      return date;
    }

    await User.upsert({ userId: 'khj551', firstName: 'Kjartan', lastName: 'Heimisson', email: 'kjartan.heimisson@sky.uk' });
    // await User.upsert({ userId: 'bre896' });
 
    const assessments = await Assessment.bulkCreate([
      { userId: 'khj551', createdAt: monthsAgo(11), updatedAt: new Date()}, 
      { userId: 'khj551', createdAt: monthsAgo(2), updatedAt: new Date()}, 
      { userId: 'khj551', createdAt: monthsAgo(5), updatedAt: new Date()},
      // { userId: 'bre896', createdAt: monthsAgo(11), updatedAt: new Date()}, 
      // { userId: 'bre896', createdAt: monthsAgo(2), updatedAt: new Date()}, 
      // { userId: 'bre896', createdAt: monthsAgo(5), updatedAt: new Date()},  
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
    ]);

    // Insert Responses into the database
    await Response.bulkCreate(responses);


    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();