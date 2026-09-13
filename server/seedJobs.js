require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/Job');
const { MongoMemoryServer } = require('mongodb-memory-server');

const jobsData = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA (Remote)',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '$130,000 - $160,000',
    description: 'We are looking for a Senior Frontend Developer to lead our UI team and build scalable web applications.',
    responsibilities: ['Lead frontend development', 'Mentor junior developers', 'Collaborate with UX/UI designers'],
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux'],
    preferredSkills: ['Next.js', 'GraphQL'],
    status: 'Active'
  },
  {
    title: 'Backend Node.js Engineer',
    company: 'Innovate AI',
    location: 'New York, NY (Hybrid)',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    salaryRange: '$110,000 - $140,000',
    description: 'Join our core infrastructure team to build robust APIs powering our AI tools.',
    responsibilities: ['Design RESTful APIs', 'Optimize database performance', 'Implement microservices'],
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'Docker'],
    preferredSkills: ['Kubernetes', 'AWS'],
    status: 'Active'
  },
  {
    title: 'Full Stack React Developer',
    company: 'StartupX',
    location: 'Austin, TX (Remote)',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    salaryRange: '$100,000 - $130,000',
    description: 'Looking for a product-focused Full Stack Developer to help build our MVP.',
    responsibilities: ['End-to-end feature development', 'Database schema design', 'API integration'],
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'JavaScript'],
    preferredSkills: ['TypeScript', 'Figma'],
    status: 'Active'
  },
  {
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'London, UK (Remote)',
    jobType: 'Contract',
    experienceLevel: 'Mid-Level',
    salaryRange: '$80,000 - $100,000',
    description: 'We need a creative UI/UX Designer for our client projects.',
    responsibilities: ['Create wireframes', 'User testing', 'Design handoffs'],
    requiredSkills: ['Figma', 'Prototyping', 'User Research'],
    preferredSkills: ['HTML/CSS', 'Framer'],
    status: 'Active'
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudWorks',
    location: 'Seattle, WA',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '$140,000 - $180,000',
    description: 'Manage and scale our cloud infrastructure.',
    responsibilities: ['CI/CD pipeline setup', 'Infrastructure as code', 'System monitoring'],
    requiredSkills: ['AWS', 'Terraform', 'Kubernetes', 'Linux'],
    preferredSkills: ['Python', 'Go'],
    status: 'Active'
  },
  {
    title: 'Data Scientist',
    company: 'DataGenix',
    location: 'Boston, MA',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    salaryRange: '$120,000 - $150,000',
    description: 'Analyze large datasets to extract actionable insights.',
    responsibilities: ['Data modeling', 'Machine learning algorithms', 'Data visualization'],
    requiredSkills: ['Python', 'SQL', 'Pandas', 'Scikit-learn'],
    preferredSkills: ['TensorFlow', 'PyTorch'],
    status: 'Active'
  },
  {
    title: 'Mobile App Developer (iOS)',
    company: 'AppSoft',
    location: 'Chicago, IL (Remote)',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    salaryRange: '$110,000 - $135,000',
    description: 'Build native iOS applications for our consumer products.',
    responsibilities: ['Develop iOS apps', 'Integrate APIs', 'Ensure app performance'],
    requiredSkills: ['Swift', 'iOS SDK', 'CoreData'],
    preferredSkills: ['Objective-C', 'React Native'],
    status: 'Active'
  },
  {
    title: 'Product Manager',
    company: 'Visionary Tech',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '$130,000 - $170,000',
    description: 'Lead product strategy and execution for our flagship software.',
    responsibilities: ['Product roadmap definition', 'Cross-functional team leadership', 'Market research'],
    requiredSkills: ['Product Strategy', 'Agile/Scrum', 'Data Analysis'],
    preferredSkills: ['Technical background', 'UX knowledge'],
    status: 'Active'
  },
  {
    title: 'Cybersecurity Analyst',
    company: 'SecureNet',
    location: 'Washington, D.C.',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    salaryRange: '$100,000 - $130,000',
    description: 'Monitor and protect our enterprise network from security threats.',
    responsibilities: ['Vulnerability assessment', 'Incident response', 'Security auditing'],
    requiredSkills: ['Network Security', 'SIEM', 'Penetration Testing'],
    preferredSkills: ['CISSP', 'CEH'],
    status: 'Active'
  },
  {
    title: 'Cloud Architect',
    company: 'Global Cloud Solutions',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Lead',
    salaryRange: '$160,000 - $200,000',
    description: 'Design and oversee implementation of cloud-based architectures.',
    responsibilities: ['Architecture design', 'Cloud migration strategy', 'Technical leadership'],
    requiredSkills: ['AWS/Azure/GCP', 'Microservices', 'System Design'],
    preferredSkills: ['Enterprise Architecture', 'Security by design'],
    status: 'Active'
  },
  {
    title: 'Marketing Specialist',
    company: 'GrowthHackers',
    location: 'Los Angeles, CA',
    jobType: 'Full-time',
    experienceLevel: 'Entry-Level',
    salaryRange: '$60,000 - $80,000',
    description: 'Execute digital marketing campaigns to drive user acquisition.',
    responsibilities: ['Social media management', 'Email marketing', 'Analytics tracking'],
    requiredSkills: ['Digital Marketing', 'SEO', 'Content Creation'],
    preferredSkills: ['Google Analytics', 'HubSpot'],
    status: 'Active'
  },
  {
    title: 'Human Resources Manager',
    company: 'PeopleFirst',
    location: 'Denver, CO',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    salaryRange: '$90,000 - $115,000',
    description: 'Manage HR operations, recruiting, and employee relations.',
    responsibilities: ['Talent acquisition', 'Employee onboarding', 'Performance management'],
    requiredSkills: ['HR Management', 'Recruiting', 'Employee Relations'],
    preferredSkills: ['PHR certification', 'Workday'],
    status: 'Active'
  },
  {
    title: 'Sales Executive',
    company: 'SalesForce Pro',
    location: 'Dallas, TX',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    salaryRange: '$80,000 - $120,000 (OTE)',
    description: 'Drive B2B software sales in the Texas region.',
    responsibilities: ['Lead generation', 'Client presentations', 'Closing deals'],
    requiredSkills: ['B2B Sales', 'CRM usage', 'Negotiation'],
    preferredSkills: ['SaaS sales experience', 'Salesforce'],
    status: 'Active'
  },
  {
    title: 'Quality Assurance Tester',
    company: 'BugFree Software',
    location: 'Remote',
    jobType: 'Contract',
    experienceLevel: 'Entry-Level',
    salaryRange: '$50,000 - $70,000',
    description: 'Perform manual and automated testing for web applications.',
    responsibilities: ['Test case creation', 'Bug reporting', 'Regression testing'],
    requiredSkills: ['Manual Testing', 'Jira', 'Attention to Detail'],
    preferredSkills: ['Selenium', 'Cypress'],
    status: 'Active'
  },
  {
    title: 'Financial Analyst',
    company: 'FinTech Global',
    location: 'New York, NY',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    salaryRange: '$90,000 - $120,000',
    description: 'Provide financial forecasting and reporting to executive team.',
    responsibilities: ['Financial modeling', 'Variance analysis', 'Budget preparation'],
    requiredSkills: ['Excel', 'Financial Modeling', 'Data Analysis'],
    preferredSkills: ['SQL', 'Tableau'],
    status: 'Active'
  },
  {
    title: 'Content Writer',
    company: 'ContentCreators',
    location: 'Remote',
    jobType: 'Part-time',
    experienceLevel: 'Entry-Level',
    salaryRange: '$40,000 - $60,000',
    description: 'Write engaging blog posts and copy for tech products.',
    responsibilities: ['Blog writing', 'Copywriting', 'SEO optimization'],
    requiredSkills: ['Writing', 'Editing', 'SEO'],
    preferredSkills: ['Tech industry knowledge', 'WordPress'],
    status: 'Active'
  },
  {
    title: 'Machine Learning Engineer',
    company: 'AI Solutions',
    location: 'Toronto, ON',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '$140,000 - $175,000',
    description: 'Deploy ML models to production for computer vision applications.',
    responsibilities: ['Model deployment', 'Pipeline optimization', 'Algorithm development'],
    requiredSkills: ['Python', 'TensorFlow', 'MLOps'],
    preferredSkills: ['C++', 'CUDA'],
    status: 'Active'
  },
  {
    title: 'Customer Success Manager',
    company: 'ClientFirst',
    location: 'Atlanta, GA',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    salaryRange: '$75,000 - $95,000',
    description: 'Ensure client satisfaction and product adoption for enterprise clients.',
    responsibilities: ['Client onboarding', 'Quarterly business reviews', 'Churn reduction'],
    requiredSkills: ['Customer Success', 'Communication', 'Account Management'],
    preferredSkills: ['Zendesk', 'SaaS experience'],
    status: 'Active'
  },
  {
    title: 'Blockchain Developer',
    company: 'CryptoInnovate',
    location: 'Miami, FL (Remote)',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '$150,000 - $190,000',
    description: 'Develop smart contracts and decentralized applications (dApps).',
    responsibilities: ['Smart contract development', 'dApp architecture', 'Security auditing'],
    requiredSkills: ['Solidity', 'Ethereum', 'Web3.js'],
    preferredSkills: ['Rust', 'Cryptography'],
    status: 'Active'
  },
  {
    title: 'Technical Support Specialist',
    company: 'HelpDesk Pros',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Entry-Level',
    salaryRange: '$55,000 - $70,000',
    description: 'Provide Tier 1 and Tier 2 technical support for software users.',
    responsibilities: ['Troubleshooting issues', 'Ticket resolution', 'User guidance'],
    requiredSkills: ['Customer Service', 'Troubleshooting', 'IT Knowledge'],
    preferredSkills: ['ITIL certification', 'Scripting basics'],
    status: 'Active'
  }
];

const seedJobs = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    if (uri) {
      try {
        await mongoose.connect(uri);
        console.log(`Connected to MongoDB at ${uri}`);
      } catch (err) {
        console.log(`Failed to connect to ${uri}, falling back to In-Memory MongoDB...`);
      }
    }
    
    if (!mongoose.connection.readyState) {
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${uri}`);
    }

    // Delete existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs.');

    // Insert new jobs
    const insertedJobs = await Job.insertMany(jobsData);
    console.log(`Successfully seeded ${insertedJobs.length} jobs!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
};

seedJobs();
