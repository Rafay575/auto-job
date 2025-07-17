export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description?: string;
}

export const jobs: Job[]  = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechNova',
    location: 'Remote',
    description: 'Develop and maintain responsive web interfaces using React and Tailwind CSS.'
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'CodeWave',
    location: 'New York',
    description: 'Design and implement RESTful APIs using Node.js and Express.'
  },
  {
    id: 3,
    title: 'Full Stack Engineer',
    company: 'InnovateX',
    location: 'San Francisco',
    description: 'Work on full-stack projects involving React, Node.js, and MongoDB.'
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    company: 'PixelPerfect',
    location: 'Remote',
    description: 'Create user-friendly and engaging UI designs for web and mobile apps.'
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudSync',
    location: 'Chicago',
    description: 'Set up CI/CD pipelines and manage AWS infrastructure.'
  },
  {
    id: 6,
    title: 'Product Manager',
    company: 'Visionary Tech',
    location: 'Boston',
    description: 'Lead cross-functional teams and define product strategy.'
  },
  {
    id: 7,
    title: 'QA Engineer',
    company: 'BugFree Inc',
    location: 'Remote',
    description: 'Create and execute automated test cases for web applications.'
  },
  {
    id: 8,
    title: 'Data Analyst',
    company: 'InsightLab',
    location: 'Austin',
    description: 'Analyze business data and create reports using Power BI and SQL.'
  },
  {
    id: 9,
    title: 'Mobile App Developer',
    company: 'Appify',
    location: 'Seattle',
    description: 'Build cross-platform mobile apps using React Native.'
  },
  {
    id: 10,
    title: 'Technical Writer',
    company: 'DocuMentor',
    location: 'Remote',
    description: 'Write documentation for APIs, developer guides, and release notes.'
  }
];
