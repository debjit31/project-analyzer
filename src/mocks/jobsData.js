/**
 * Mock job listings data
 * Simulates backend API response
 */
export const mockJobs = [
  {
    id: '1',
    job_title: 'Frontend Engineer',
    company: 'Stripe',
    url: 'https://stripe.com/careers',
    location: 'San Francisco, CA',
    posted_date: '2026-04-17',
    description:
      'Join Stripe\'s dashboard team to build high-performance financial interfaces. You will work on data-heavy UIs, real-time charting, and payment flow optimization used by millions of businesses worldwide.',
    analysis: {
      tech_stack: ['React', 'TypeScript', 'GraphQL'],
      core_problem:
        'Improve dashboard performance for financial data visualization. Handle large datasets with real-time updates while maintaining smooth user experience.',
      project_idea:
        'Build a real-time financial dashboard with optimized rendering using React and memoization. Implement virtualized lists for transaction data and WebSocket connections for live updates.',
    },
  },
  {
    id: '2',
    job_title: 'Senior React Developer',
    company: 'Vercel',
    url: 'https://vercel.com/careers',
    location: 'Remote',
    posted_date: '2026-04-15',
    description:
      'Help build the future of web deployment at Vercel. Work on developer-facing tools, the deployment pipeline UI, and integrations that power the Next.js ecosystem.',
    analysis: {
      tech_stack: ['Next.js', 'React', 'Node.js', 'Tailwind CSS'],
      core_problem:
        'Create seamless deployment experiences and build tools that improve developer productivity for millions of users.',
      project_idea:
        'Create a deployment preview tool that shows visual diffs between versions. Include a drag-and-drop interface for comparing UI changes across deployments.',
    },
  },
  {
    id: '3',
    job_title: 'Full Stack Engineer',
    company: 'Linear',
    url: 'https://linear.app/careers',
    location: 'San Francisco, CA',
    posted_date: '2026-04-14',
    description:
      'Build the fastest project management tool on the planet. We obsess over performance, keyboard navigation, and developer experience. You\'ll own features end-to-end from database to pixel.',
    analysis: {
      tech_stack: ['React', 'TypeScript', 'PostgreSQL', 'GraphQL'],
      core_problem:
        'Build fast, keyboard-first interfaces for project management. Optimize for speed and minimal friction in daily workflows.',
      project_idea:
        'Build a keyboard-driven task manager with vim-like navigation. Include command palette (⌘K), real-time sync, and offline support using IndexedDB.',
    },
  },
  {
    id: '4',
    job_title: 'UI Engineer',
    company: 'Figma',
    url: 'https://figma.com/careers',
    location: 'New York, NY',
    posted_date: '2026-04-16',
    description:
      'Work on Figma\'s browser-based design tool — one of the most complex web applications in the world. You\'ll tackle rendering performance, real-time multiplayer collaboration, and interactive canvas features.',
    analysis: {
      tech_stack: ['React', 'WebGL', 'TypeScript', 'C++'],
      core_problem:
        'Render complex design files with thousands of elements smoothly in the browser while supporting real-time collaboration.',
      project_idea:
        'Build a collaborative whiteboard app with canvas rendering. Implement real-time cursor positions, sticky notes, and basic shape tools using WebSocket and Canvas API.',
    },
  },
  {
    id: '5',
    job_title: 'Software Engineer, Growth',
    company: 'Notion',
    url: 'https://notion.so/careers',
    location: 'San Francisco, CA',
    posted_date: '2026-04-12',
    description:
      'Drive user growth and engagement at Notion. You\'ll experiment with onboarding flows, activation funnels, and features that help new users get value from the product faster.',
    analysis: {
      tech_stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      core_problem:
        'Improve user onboarding and activation. Build features that help new users understand the power of blocks and templates.',
      project_idea:
        'Create an interactive onboarding wizard with progress tracking. Build a block-based editor demo that teaches users through guided tutorials with contextual hints.',
    },
  },
  {
    id: '6',
    job_title: 'Frontend Platform Engineer',
    company: 'Shopify',
    url: 'https://shopify.com/careers',
    location: 'Remote',
    posted_date: '2026-04-18',
    description:
      'Shape the frontend platform that powers commerce for millions of merchants. Build shared infrastructure, design system components, and developer tooling used by hundreds of engineers.',
    analysis: {
      tech_stack: ['React', 'Ruby on Rails', 'GraphQL', 'Polaris'],
      core_problem:
        'Scale frontend infrastructure for millions of merchants. Ensure consistent UI patterns and performant component libraries.',
      project_idea:
        'Build a component playground/sandbox similar to Storybook. Include live editing, accessibility audits, and bundle size analysis for each component.',
    },
  },
  {
    id: '7',
    job_title: 'React Native Developer',
    company: 'Discord',
    url: 'https://discord.com/careers',
    location: 'San Francisco, CA',
    posted_date: '2026-04-11',
    description:
      'Build Discord\'s mobile experience used by 200M+ monthly users. You\'ll work on voice/video features, real-time messaging, and cross-platform consistency between iOS and Android.',
    analysis: {
      tech_stack: ['React Native', 'TypeScript', 'Rust', 'WebRTC'],
      core_problem:
        'Build smooth, lag-free mobile experience for voice and video chat with millions of concurrent users.',
      project_idea:
        'Create a voice chat room app with real-time audio visualization. Implement push-to-talk, background audio, and animated speaking indicators.',
    },
  },
  {
    id: '8',
    job_title: 'Product Engineer',
    company: 'Raycast',
    url: 'https://raycast.com/careers',
    location: 'Remote (EU)',
    posted_date: '2026-04-10',
    description:
      'Build Raycast — the productivity launcher loved by developers. You\'ll create blazing-fast UIs, design plugin APIs, and build features that save users hours every week.',
    analysis: {
      tech_stack: ['React', 'TypeScript', 'Electron', 'Swift'],
      core_problem:
        'Create blazing fast launcher experiences with extensible plugin architecture for power users.',
      project_idea:
        'Build a browser-based command launcher with fuzzy search. Include extensible commands, keyboard shortcuts, and a plugin system using dynamic imports.',
    },
  },
  {
    id: '9',
    job_title: 'Staff Frontend Engineer',
    company: 'Datadog',
    url: 'https://careers.datadoghq.com',
    location: 'New York, NY',
    posted_date: '2026-04-17',
    description:
      'Lead frontend initiatives on Datadog\'s observability platform. Build interactive dashboards, time-series graphs, and alerting UIs that help engineers monitor infrastructure at scale.',
    analysis: {
      tech_stack: ['React', 'TypeScript', 'D3.js', 'Go'],
      core_problem:
        'Visualize millions of data points in real-time monitoring dashboards without degrading browser performance.',
      project_idea:
        'Build an infrastructure monitoring dashboard with zoomable time-series charts using D3.js. Include threshold alerts, anomaly highlighting, and a customizable widget grid layout.',
    },
  },
  {
    id: '10',
    job_title: 'Design Systems Engineer',
    company: 'Airbnb',
    url: 'https://careers.airbnb.com',
    location: 'San Francisco, CA',
    posted_date: '2026-04-13',
    description:
      'Build and maintain Airbnb\'s design system used across web and mobile. Create accessible, performant, and delightful components that power the travel experience for millions.',
    analysis: {
      tech_stack: ['React', 'TypeScript', 'Storybook', 'CSS-in-JS'],
      core_problem:
        'Maintain a scalable, accessible design system across multiple platforms while ensuring visual consistency and developer ergonomics.',
      project_idea:
        'Create a design system documentation site with live component previews, theme switching, accessibility scores, and interactive prop playgrounds.',
    },
  },
  {
    id: '11',
    job_title: 'Backend Engineer',
    company: 'Supabase',
    url: 'https://supabase.com/careers',
    location: 'Remote',
    posted_date: '2026-04-16',
    description:
      'Work on the open-source Firebase alternative. Build real-time database features, authentication systems, and storage APIs that power thousands of applications.',
    analysis: {
      tech_stack: ['PostgreSQL', 'Elixir', 'TypeScript', 'Docker'],
      core_problem:
        'Build reliable, real-time data infrastructure that scales from hobby projects to enterprise applications with minimal configuration.',
      project_idea:
        'Build a real-time collaborative notes app using Supabase. Implement row-level security, real-time subscriptions, file attachments, and auth with multiple providers.',
    },
  },
  {
    id: '12',
    job_title: 'ML Platform Engineer',
    company: 'Hugging Face',
    url: 'https://huggingface.co/careers',
    location: 'Remote',
    posted_date: '2026-04-18',
    description:
      'Help democratize AI by building the platform that hosts 500K+ models. Work on model serving infrastructure, the Hub UI, and tools that make ML accessible to every developer.',
    analysis: {
      tech_stack: ['Python', 'FastAPI', 'React', 'Docker'],
      core_problem:
        'Serve and manage hundreds of thousands of ML models with low latency while providing an intuitive interface for model discovery and deployment.',
      project_idea:
        'Build an ML model showcase app with a searchable registry. Include model cards, one-click inference demos, comparison tables, and deployment status indicators.',
    },
  },
  {
    id: '13',
    job_title: 'iOS Engineer',
    company: 'Loom',
    url: 'https://loom.com/careers',
    location: 'Remote',
    posted_date: '2026-04-15',
    description:
      'Build Loom\'s async video messaging experience on iOS. Optimize video recording, editing, and sharing while ensuring silky-smooth performance and battery efficiency.',
    analysis: {
      tech_stack: ['Swift', 'SwiftUI', 'AVFoundation', 'Core Data'],
      core_problem:
        'Deliver a seamless video recording and sharing experience on mobile with minimal latency, efficient compression, and offline support.',
      project_idea:
        'Create a video message app with screen recording, trimming, and instant sharing. Add playback speed controls, reactions, and transcript generation using speech-to-text APIs.',
    },
  },
  {
    id: '14',
    job_title: 'DevOps Engineer',
    company: 'GitLab',
    url: 'https://about.gitlab.com/jobs',
    location: 'Remote',
    posted_date: '2026-04-14',
    description:
      'Improve GitLab\'s CI/CD platform used by millions of developers. Build pipeline optimizations, runner infrastructure, and deployment automation that scales globally.',
    analysis: {
      tech_stack: ['Go', 'Kubernetes', 'Terraform', 'Ruby'],
      core_problem:
        'Optimize CI/CD pipeline performance and reliability at massive scale while keeping the developer experience simple and intuitive.',
      project_idea:
        'Build a CI/CD pipeline visualizer that shows build stages, dependencies, and bottlenecks in real-time. Include historical performance trends and failure pattern detection.',
    },
  },
  {
    id: '15',
    job_title: 'Security Engineer',
    company: '1Password',
    url: 'https://1password.com/careers',
    location: 'Toronto, Canada',
    posted_date: '2026-04-12',
    description:
      'Protect millions of users\' most sensitive data. Work on encryption protocols, zero-knowledge architecture, and security auditing tools for the world\'s most trusted password manager.',
    analysis: {
      tech_stack: ['Rust', 'Go', 'TypeScript', 'WebAssembly'],
      core_problem:
        'Implement zero-knowledge encryption and secure vault sync across devices while maintaining fast performance and an intuitive user experience.',
      project_idea:
        'Build a password strength analyzer with breach detection. Implement client-side encryption, secure password generation, and integration with the Have I Been Pwned API.',
    },
  },
  {
    id: '16',
    job_title: 'Data Engineer',
    company: 'dbt Labs',
    url: 'https://getdbt.com/careers',
    location: 'Philadelphia, PA',
    posted_date: '2026-04-17',
    description:
      'Build the analytics engineering platform used by thousands of data teams. Work on the dbt Cloud IDE, job orchestration, and data lineage visualization.',
    analysis: {
      tech_stack: ['Python', 'TypeScript', 'React', 'Snowflake'],
      core_problem:
        'Enable analytics engineers to transform raw data into trusted datasets with version control, testing, and documentation built in.',
      project_idea:
        'Build a data lineage visualization tool that maps table dependencies as an interactive graph. Include column-level lineage, impact analysis, and SQL query previews.',
    },
  },
  {
    id: '17',
    job_title: 'Embedded Systems Engineer',
    company: 'Tesla',
    url: 'https://tesla.com/careers',
    location: 'Austin, TX',
    posted_date: '2026-04-10',
    description:
      'Develop firmware for Tesla\'s vehicle systems. Work on real-time control software for battery management, motor controllers, and autonomous driving subsystems.',
    analysis: {
      tech_stack: ['C', 'C++', 'Python', 'RTOS'],
      core_problem:
        'Build safety-critical embedded software with real-time constraints for electric vehicle subsystems, ensuring reliability and performance.',
      project_idea:
        'Create an IoT dashboard simulator that displays real-time sensor data. Implement alerts, historical trend analysis, and a virtual device twin with adjustable parameters.',
    },
  },
  {
    id: '18',
    job_title: 'Platform Engineer',
    company: 'Cloudflare',
    url: 'https://cloudflare.com/careers',
    location: 'Austin, TX',
    posted_date: '2026-04-19',
    description:
      'Build Cloudflare\'s edge computing platform. Work on Workers runtime, KV storage, and networking infrastructure that serves 20% of the internet\'s traffic.',
    analysis: {
      tech_stack: ['Rust', 'Go', 'TypeScript', 'Lua'],
      core_problem:
        'Run user code at the edge with sub-millisecond cold starts, strict resource isolation, and global consistency across 300+ data centers.',
      project_idea:
        'Build a serverless function playground where users can write, test, and deploy edge functions. Include latency simulation, a request inspector, and global region selection.',
    },
  },
  {
    id: '19',
    job_title: 'Mobile Engineer',
    company: 'Spotify',
    url: 'https://lifeatspotify.com',
    location: 'Stockholm, Sweden',
    posted_date: '2026-04-13',
    description:
      'Shape the music experience for 600M+ users. Work on playback, personalization, and social features across Spotify\'s iOS and Android apps.',
    analysis: {
      tech_stack: ['Kotlin', 'Swift', 'React Native', 'gRPC'],
      core_problem:
        'Deliver seamless audio playback and personalized recommendations across unreliable networks with offline support and gapless transitions.',
      project_idea:
        'Build a music player app with playlist management, audio waveform visualization, crossfade transitions, and offline caching using Service Workers.',
    },
  },
  {
    id: '20',
    job_title: 'AI/ML Engineer',
    company: 'OpenAI',
    url: 'https://openai.com/careers',
    location: 'San Francisco, CA',
    posted_date: '2026-04-19',
    description:
      'Advance the state of the art in large language models. Work on training infrastructure, RLHF pipelines, and evaluation frameworks for the next generation of AI systems.',
    analysis: {
      tech_stack: ['Python', 'PyTorch', 'Kubernetes', 'Triton'],
      core_problem:
        'Scale model training across thousands of GPUs efficiently while improving model quality through novel alignment and evaluation techniques.',
      project_idea:
        'Build an AI chat playground with model parameter tuning. Include system prompt editing, response comparison mode, token usage tracking, and conversation branching.',
    },
  },
];

/**
 * Simulate API delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulate job search API call
 * @param {Object} params - Search parameters
 * @param {string} params.jobTitle - Job title to search
 * @param {string} params.location - Location to search
 * @param {string} params.datePosted - Date filter
 * @returns {Promise<Object>}
 */
export const searchJobs = async ({ jobTitle, location, datePosted: _datePosted }) => {
  await delay(2000 + Math.random() * 1000);

  if (Math.random() < 0.1) {
    throw new Error('Failed to fetch job listings. Please try again.');
  }

  let filteredJobs = [...mockJobs];

  if (jobTitle) {
    const searchTerm = jobTitle.toLowerCase();
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.job_title.toLowerCase().includes(searchTerm) ||
        job.analysis.tech_stack.some((tech) =>
          tech.toLowerCase().includes(searchTerm)
        )
    );
  }

  if (location) {
    const locationTerm = location.toLowerCase();
    filteredJobs = filteredJobs.filter((job) =>
      job.location.toLowerCase().includes(locationTerm)
    );
  }

  if (!jobTitle && !location) {
    filteredJobs = mockJobs;
  }

  return {
    success: true,
    data: filteredJobs,
    total: filteredJobs.length,
  };
};

/**
 * Get all job listings
 * @returns {Promise<Object>}
 */
export const getAllJobs = async () => {
  await delay(1500 + Math.random() * 500);

  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch job listings. Please try again.');
  }

  return {
    success: true,
    data: mockJobs,
    total: mockJobs.length,
  };
};

/**
 * Get a single job by ID
 * @param {string} id - Job ID
 * @returns {Promise<Object>}
 */
export const getJobById = async (id) => {
  await delay(800 + Math.random() * 400);

  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    throw new Error('Job listing not found.');
  }

  return {
    success: true,
    data: job,
  };
};
