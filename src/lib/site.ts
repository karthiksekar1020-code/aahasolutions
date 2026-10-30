/**
 * Static site configuration taken from the audited reference site (https://www.aahasolutions.com/).
 * Page bodies live in the database (ContentPage / BlogPost / Testimonial / Faq); this file holds
 * navigation, contact details and homepage copy that is structural rather than editorial.
 */
export const SITE = {
  name: 'AAHA Solutions',
  legalName: 'AAHA Solutions UK Limited',
  companyNo: '06889040',
  sic: '62020 – IT Consultancy',
  email: 'info@aahasolutions.com',
  description:
    'AAHA Solutions is a software company delivering custom AI systems, SaaS platforms, cloud migration, ERP solutions, and web and mobile apps globally from Pondicherry, India and the UK.',
  profilePdf: '/AAAHA_COMPANY_PROFILE.pdf',
  phones: { india: ['+91 9551565200', '+91 8098299921'], uk: ['+44 7438661112', '+44 7794517779'] },
  offices: [
    {
      country: 'India',
      city: 'Puducherry',
      address: ['27, 3rd Cross Rd, Sithankudi,', 'Brindavan Colony, Puducherry, 605 013.'],
      phones: ['+91 9551565200', '+91 8098299921'],
      note: 'Offshore Development Center',
    },
    {
      country: 'United Kingdom',
      city: 'London',
      address: ['54 Holly Hill Road,', 'Erith, Kent, DA8 1QD, UK.'],
      phones: ['+44 7438661112', '+44 7794517779'],
      note: 'Onshore consulting & delivery',
    },
    { country: 'United States of America', city: '', address: ['Coming soon'], phones: [], note: '' },
  ],
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/aaha-solutions-uk-limited' },
    { label: 'Facebook', href: 'https://www.facebook.com/AAHAsolutions/' },
    { label: 'X (Twitter)', href: 'https://twitter.com/SolutionsAaha' },
    { label: 'Instagram', href: 'https://www.instagram.com/aaha_solutions?igsh=anQ3bzZ1eW9oanNu' },
  ],
  reviewProfiles: [
    { label: 'Clutch', href: 'https://clutch.co/profile/aaha-solutions', img: '/assets/images/newhome/awards/clutch.png' },
    { label: 'GoodFirms', href: 'https://www.goodfirms.co/companies/view/16651/aaha-solutions', img: '/assets/images/newhome/awards/top-software-development-companies.svg' },
    { label: 'AppFutura', href: 'https://www.appfutura.com/developers/aaha-solutions', img: '/assets/images/newhome/awards/badge-regular.png' },
  ],
};

export interface NavLink { label: string; href: string }
export interface NavGroup { label: string; links: NavLink[] }

/** Navigation mirrors the reference site's menu groups (Company / Services / Technology / Industries / Insights). */
export const NAV: NavGroup[] = [
  { label: 'Company', links: [
    { label: 'About Us', href: '/software-developement-company-in-pondicherry.php' },
    { label: 'Careers', href: '/software-careers-in-pondicherry.php' },
  ] },
  { label: 'Services', links: [
    { label: 'Cloud Services', href: '/cloud-services-company/' },
    { label: 'Application Services', href: '/application-services-company-in-pondicherry.php' },
    { label: 'Interactive Development', href: '/interactive-development-company-in-pondicherry.php' },
    { label: 'Web Development', href: '/web-application-development-company/' },
    { label: 'Custom Software Development', href: '/custom-software-development-company/' },
    { label: 'QA & Testing', href: '/qa-testing-company-in-pondicherry.php' },
    { label: 'Machine Learning', href: '/machine-learning-development-company-in-pondicherry.php' },
    { label: 'Internet of Things (IoT)', href: '/iot-development-company-in-pondicherry.php' },
    { label: 'Chatbot', href: '/chatbot-development-company-in-pondicherry.php' },
    { label: 'Blockchain', href: '/blockchain-development-company-in-pondicherry.php' },
    { label: 'SaaS Development', href: '/saas-development-company/' },
    { label: 'Enterprise Software', href: '/enterprise-software-development/' },
  ] },
  { label: 'Technology', links: [
    { label: 'Artificial Intelligence (AI)', href: '/ai-development-company-india/' },
    { label: 'Mobile Application', href: '/mobile-app-development-company/' },
    { label: 'Web Application', href: '/web-application-development-company/' },
    { label: 'Cloud', href: '/cloud-services-company/' },
    { label: 'E-Commerce', href: '/e-commerce-company-in-pondicherry.php' },
    { label: 'CRM', href: '/crm-development-company/' },
    { label: 'ERP', href: '/erp-development-company/' },
    { label: 'Open Source', href: '/open-source-company-in-pondicherry.php' },
  ] },
  { label: 'Industries', links: [
    { label: 'Healthcare', href: '/industries/healthcare-software-development/' },
    { label: 'Retail', href: '/industries/retail-software-development/' },
    { label: 'Logistics', href: '/industries/logistics-software-development/' },
    { label: 'Manufacturing', href: '/industries/manufacturing-software-development/' },
    { label: 'Education', href: '/industries/education-software-development/' },
    { label: 'Finance', href: '/industries/finance-software-development/' },
  ] },
  { label: 'Insights', links: [
    { label: 'Blog', href: '/software-development-blog-in-pondicherry.php' },
    { label: 'Case Studies', href: '/software-development-case-studies-in-pondicherry.php' },
    { label: 'Internship', href: '/it-internship-provider-in-pondicherry.php' },
    { label: 'Industrial Visit', href: '/software-company-industrial-visit-pondicherry.php' },
  ] },
];

export const FOOTER_SERVICES: NavLink[] = [
  { label: 'AI Development', href: '/ai-development-company-india/' },
  { label: 'SaaS Development', href: '/saas-development-company/' },
  { label: 'Cloud Services', href: '/cloud-services-company/' },
  { label: 'Web Development', href: '/web-application-development-company/' },
  { label: 'Custom Software', href: '/custom-software-development-company/' },
  { label: 'Mobile App', href: '/mobile-app-development-company/' },
  { label: 'ERP Development', href: '/erp-development-company/' },
  { label: 'CRM Development', href: '/crm-development-company/' },
  { label: 'QA & Testing', href: '/qa-testing-company-in-pondicherry.php' },
  { label: 'Machine Learning', href: '/machine-learning-development-company-in-pondicherry.php' },
];

// ---- Homepage copy (verbatim from the reference homepage) ----
export const HOME = {
  h1: 'AAHA Solutions',
  sub: 'AI, SaaS, Cloud, Web, Mobile & Enterprise Software Development Company',
  offices: 'Offices in India and UK',
  slides: [
    { title: 'Enterprise & SaaS Engineering', text: 'Building scalable, multi-tenant cloud-native products for modern businesses.' },
    { title: 'AI & Machine Learning Services', text: 'Transforming operations with custom NLP chatbots, ML models, and Generative AI.' },
    { title: 'Cloud & Mobile Solutions', text: 'Leading DevOps practices, monolith-to-cloud migration, and native mobile apps.' },
  ],
  ctas: ['Book a Free Consultation', 'Get Project Estimate', 'Schedule Discovery Call'] as const,
  who: {
    title: 'Who We are',
    text: 'As a leading IT solutions company, AAHA SOLUTIONS offers managed onshore and offshore development services from our London office and our state-of-the-art Offshore Development Center in Pondicherry, India. AAHA SOLUTIONS plans and executes complex development projects, providing a robust framework to exceed client expectations across all dimensions—quality, time, and cost. We deliver custom software engineering, cloud migration, AI, IoT, and blockchain solutions tailored for key industries including Healthcare, Retail, Logistics, Manufacturing, Education, Finance, E-commerce, IoT, and Blockchain.',
  },
  services: [
    { title: 'Cloud Services & Development', href: '/cloud-services-company/', icon: '/icon/cloud-services.svg', bg: '/assets/images/cloud-computing.jpg' },
    { title: 'Web Application Development', href: '/web-application-development-company/', icon: '/icon/web-application.svg', bg: '/assets/images/web-development-card.jpg' },
    { title: 'AI & Machine Learning', href: '/ai-development-company-india/', icon: '/icon/automation-testing.svg', bg: '/assets/images/ai-ml-card.jpg' },
    { title: 'Mobile Application Development', href: '/mobile-app-development-company/', icon: '/icon/mobile-app.svg', bg: '/assets/images/mobile-app-card.jpg' },
    { title: 'SaaS Product Engineering', href: '/saas-development-company/', icon: '/icon/open-source.svg', bg: '/assets/images/saas-card.jpg' },
    { title: 'Enterprise Software Development', href: '/enterprise-software-development/', icon: '/icon/enter-price.svg', bg: '/assets/images/enterprise-card.jpg' },
  ],
  industriesIntro: 'We deliver tailored, industry-specific software engineering solutions designed to drive digital transformation and growth.',
  industries: [
    { title: 'Healthcare', text: 'Custom HIPAA-compliant EHR/EMR systems, telehealth apps, and medical software.', href: '/industries/healthcare-software-development/' },
    { title: 'Retail & E-commerce', text: 'Omnichannel retail commerce engines, POS integrations, and loyalty solutions.', href: '/industries/retail-software-development/' },
    { title: 'Logistics & Supply Chain', text: 'Automated fleet tracking, warehouse management, and distribution software.', href: '/industries/logistics-software-development/' },
    { title: 'Manufacturing', text: 'IoT smart factory systems, asset lifecycle trackers, and automated workflows.', href: '/industries/manufacturing-software-development/' },
    { title: 'Education (EdTech)', text: 'Custom LMS platforms, virtual classrooms, and interactive learning tools.', href: '/industries/education-software-development/' },
  ],
  challenging: { title: 'We take on challenging projects', text: 'We help enterprise clients, funded startups, and Fortune number of companies develop impactful software solutions.' },
  why: [
    { title: 'Global Footprint', text: 'Onshore project consulting and delivery from London, backed by our state-of-the-art Offshore Development Center in Pondicherry, India.' },
    { title: 'Enterprise Security', text: 'Strict adherence to HIPAA, GDPR, ISO compliance, secure IP protection, and data governance standards across all projects.' },
    { title: 'Full-Stack Web Development', text: 'End-to-end web engineering across React, Next.js, Node.js and cloud databases, from responsive front ends to secure APIs, delivered as fast, scalable and maintainable products.' },
    { title: 'Agile Execution', text: 'Interactive weekly sprints, detailed progress reports, continuous integration/delivery, and transparent collaboration frameworks.' },
  ],
  techIntro: 'We leverage cutting-edge tech stacks, frameworks, and programming languages to engineer reliable software.',
  tech: [
    { group: 'AI / ML & Data', items: [['OpenAI API', 'openai.svg'], ['PyTorch', 'pytorch.svg'], ['TensorFlow', 'tensorflow.svg'], ['Weaviate (Vector)', 'database.svg'], ['Python ML', 'python.svg']] },
    { group: 'Frontend', items: [['React JS', 'react_js.svg'], ['Angular JS', 'angular-js.svg'], ['Next.js', 'nextjs.svg'], ['HTML5', 'html5.webp'], ['CSS3', 'css3.svg'], ['JavaScript', 'javascript.webp']] },
    { group: 'Backend & SaaS', items: [['Node.js', 'node_js.svg'], ['PHP Laravel', 'laravel.svg'], ['GoLang', 'golang.svg'], ['Spring Boot', 'springboot.svg'], ['.NET Core', 'dotnet.svg']] },
    { group: 'Mobile App', items: [['React Native', 'react_js.svg'], ['Flutter / Dart', 'flutter.svg'], ['Swift (iOS)', 'swift.svg'], ['Kotlin (Android)', 'kotlin.svg']] },
    { group: 'Cloud & DevOps', items: [['AWS', 'brand-aws.svg'], ['Google Cloud', 'brand-googlecloud.svg'], ['Azure', 'brand-azure.svg'], ['Kubernetes', 'kubernetes.svg'], ['Docker', 'docker.svg']] },
  ] as { group: string; items: [string, string][] }[],
  awardsIntro: "Awards and recognition demonstrate AAHA Solutions' deep commitment to clients, employees, and supporters around the world.",
  consultant: {
    intro: "Get real-time answers about AAHA Solutions' engineering capabilities, security compliance, and global engagement models.",
    quick: [
      { key: 'services', q: 'What services do you offer?' },
      { key: 'offices', q: 'Where are your global offices?' },
      { key: 'industries', q: 'Which industries do you serve?' },
      { key: 'compliance', q: 'What compliance do you support?' },
      { key: 'estimate', q: 'How do I get a project estimate?' },
    ],
  },
  caseStudies: [
    { tag: 'AI & ML', title: 'AI Chatbot Integration', text: 'Built a 24/7 conversational assistant for enterprise support, automating 60% of customer ticket loads.', href: '/case-studies/ai-chatbot-development/', img: '/assets/images/chatbot.webp', video: '/assets/video/ai-chatbot-architecture.mp4' },
    { tag: 'Cloud', title: 'AWS Cloud Migration', text: 'Migrated legacy database nodes and monoliths to a secure, auto-scaling AWS environment.', href: '/case-studies/cloud-migration-project/', img: '/assets/images/Cloud1.webp', video: '/assets/video/dashboard-data.mp4' },
    { tag: 'E-Commerce', title: 'E-Commerce Platform', text: 'Centralized digital commerce platform featuring catalog discovery, multi-tier checkout, and inventory tracking.', href: '/case-studies/ecommerce-platform/', img: '/assets/images/ecommerce-platform-preview.jpg' },
    { tag: 'Workflow', title: 'Change Management System', text: 'Centralized the process change lifecycle with structured validation, multi-level approvals, and automated monitoring.', href: '/case-studies/change-management-system/', img: '/assets/images/cms-preview.jpg' },
    { tag: 'Mobile & EdTech', title: 'E-Learning Mobile App', text: 'Cross-platform preschool learning mobile app with multi-language support, age-based paths, and in-app purchases.', href: '/case-studies/mobile-app-development/', img: '/assets/images/elearning-mobile-app-preview.jpg' },
  ],
};

/** Verified answers used by the AI consultant: its system prompt and the offline fallback. Source: reference homepage. */
export const CONSULTANT_FACTS: Record<string, string> = {
  services:
    'AAHA Solutions is a comprehensive software engineering firm. We specialize in AI & Machine Learning development, SaaS Product Engineering, Cloud Migration & DevOps Services, custom Web Application Development, Native Mobile App Development, and Enterprise Solutions (ERP/CRM).',
  offices:
    'We operate globally. Our primary business consulting and delivery hub is located in London, UK. This is fully integrated with our state-of-the-art Offshore Development Center in Puducherry (Pondicherry), India, providing premium services at a highly optimized cost.',
  industries:
    'We specialize in developing tailored solutions for Healthcare (HIPAA compliant), Retail & E-commerce, Logistics & Supply Chain, Manufacturing (IoT-driven), and EdTech (Education & Learning Management Systems).',
  compliance:
    'Security is built into our core framework. We comply with GDPR for data privacy, HIPAA for healthcare software, ISO certification standards, and follow secure coding practices to ensure your source code, IP, and client data are fully protected.',
  estimate:
    "Click the 'Get Project Estimate' or 'Book a Free Consultation' button to open our enquiry form. Once you submit your project requirements, our solutions architect will reach out to you within 24 hours to schedule a discovery call.",
};
