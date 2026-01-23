/**
 * Botsmann Knowledge Base for RAG
 * This contains all the site content that the AI assistant can use to answer questions.
 */

export interface KnowledgeChunk {
  id: string;
  topic: string;
  question: string;
  content: string;
  keywords: string[];
}

export const botsmannKnowledge: KnowledgeChunk[] = [
  // About Botsmann
  {
    id: 'about-philosophy',
    topic: 'About Botsmann',
    question: 'What is Botsmann and what is your philosophy?',
    content: `Botsmann is a platform that builds private AI assistants. We believe in the transformative power of transparency and automation. Our core principles are: making processes transparent, automating redundant tasks, and empowering individuals through technology. By building in public, financing in public, and transacting in public, we create systems that are accountable and trustworthy. Our tagline is "Your Data. Your AI. Your Control."`,
    keywords: [
      'botsmann',
      'about',
      'philosophy',
      'company',
      'who',
      'what',
      'transparency',
      'automation',
    ],
  },
  {
    id: 'about-mission',
    topic: 'About Botsmann',
    question: "What is Botsmann's mission?",
    content: `Botsmann's mission is to methodically automate redundant, intransparent, and labor-intensive processes. We aim to free people from unpleasant tasks, giving them back their most precious resource: time and freedom to focus on what truly matters. We help you build private AI assistants that know YOUR information—medical records, legal documents, financial data, learning materials.`,
    keywords: ['mission', 'goal', 'purpose', 'automate', 'automation', 'free', 'time'],
  },
  {
    id: 'about-approach',
    topic: 'About Botsmann',
    question: "What is Botsmann's approach to AI?",
    content: `Through innovative AI solutions and automation technologies, Botsmann transforms complex, time-consuming workflows into efficient, transparent processes. Our commitment to transparency ensures that every automated decision is traceable and understandable, building trust between humans and AI systems. We offer both local deployment (runs on your computer for maximum privacy) and cloud deployment (access anywhere).`,
    keywords: ['approach', 'method', 'how', 'ai', 'transparent', 'trust', 'local', 'cloud'],
  },
  {
    id: 'privacy-first',
    topic: 'Privacy & Security',
    question: 'How does Botsmann handle privacy and data security?',
    content: `Privacy is at the core of Botsmann. We build private AI assistants where your data stays yours. You can choose to run the AI locally on your computer for maximum privacy, or in the cloud for anywhere access. For local setups, there are no subscriptions required—you own it forever. We never share your data with third parties, and you have complete control over your information.`,
    keywords: ['privacy', 'security', 'data', 'private', 'local', 'safe', 'secure', 'protection'],
  },

  // How It Works
  {
    id: 'how-step-1',
    topic: 'How It Works',
    question: 'How do I get started with Botsmann?',
    content: `Getting started is simple! Step 1: Book a free consultation call. We'll understand your use case—whether it's medical, legal, financial, or learning—and recommend the best approach for your needs. No commitment required, just a friendly conversation to explore possibilities.`,
    keywords: ['start', 'begin', 'first', 'consultation', 'call', 'book', 'free'],
  },
  {
    id: 'how-step-2',
    topic: 'How It Works',
    question: 'What happens after the consultation?',
    content: `Step 2: We set everything up for you. You choose whether you want local deployment (runs on your computer, maximum privacy) or cloud deployment (access from anywhere). We handle all the technical complexity—configuring the AI, loading your data, and making sure everything works smoothly.`,
    keywords: ['setup', 'configure', 'install', 'deployment', 'local', 'cloud', 'technical'],
  },
  {
    id: 'how-step-3',
    topic: 'How It Works',
    question: 'Do I need a subscription?',
    content: `Step 3: You own it forever! Your AI assistant knows your information and is ready to help. For local setups, there are no subscriptions required—it's yours to keep. Cloud deployments have ongoing hosting costs, but you still own your data and can export it anytime.`,
    keywords: ['subscription', 'cost', 'price', 'own', 'forever', 'keep', 'payment'],
  },

  // Bots - Heidi
  {
    id: 'bot-heidi-overview',
    topic: 'AI Assistants',
    question: 'What is Heidi?',
    content: `Heidi is our Swiss German Teacher bot. She's your AI companion for High German and Züridütsch—helping you learn the language and discover events in Zurich. Heidi adapts to your learning style, tests your progress intelligently, and provides dual-language support with High German and Züridütsch side by side. She also includes Swiss culture tips and local know-how.`,
    keywords: ['heidi', 'swiss', 'german', 'teacher', 'language', 'learn', 'zurich', 'züridütsch'],
  },
  {
    id: 'bot-heidi-features',
    topic: 'AI Assistants',
    question: 'What can Heidi do?',
    content: `Heidi's features include: Adaptive learning that tests your progress in smart ways, discovering tonight's events and activities in Zurich, dual-language comparison between High German and Züridütsch, real-life context examples for words and phrases, instant writing help for emails and texts in both languages, and Swiss cultural insights including history and social life tips. Heidi is currently live and available!`,
    keywords: ['heidi', 'features', 'learn', 'events', 'zurich', 'language', 'culture', 'writing'],
  },

  // Bots - Research Assistant
  {
    id: 'bot-research-overview',
    topic: 'AI Assistants',
    question: 'What is the Research Assistant?',
    content: `The Research Assistant (nicknamed "Nerd") is an AI-powered research companion for organizing data, generating insights, and discovering connections. It's designed for academics, scientists, journalists, and industry professionals who want to elevate their research workflow with AI automation.`,
    keywords: ['research', 'assistant', 'nerd', 'academic', 'science', 'data', 'organize'],
  },
  {
    id: 'bot-research-features',
    topic: 'AI Assistants',
    question: 'What can the Research Assistant do?',
    content: `The Research Assistant features: Automated research systematization (organizes your uploaded materials), web scraping for the latest updates in your field, AI-generated research drafts with proper citations, daily thought-provoking questions to challenge your thinking, Big Discovery Mode to identify research gaps and novel connections, and integration tools for collaboration. It helps transform how you conduct research.`,
    keywords: ['research', 'features', 'organize', 'scraping', 'drafts', 'citations', 'discovery'],
  },

  // Bots - Medical Expert
  {
    id: 'bot-medical-overview',
    topic: 'AI Assistants',
    question: 'What is Imhotep the Medical Expert?',
    content: `Imhotep is our Medical Expert Assistant—a private AI health assistant that works with your medical history, lab results, and treatment records. It's designed to support healthcare professionals with evidence-based insights and comprehensive research analysis. Named after the ancient Egyptian physician, Imhotep helps you stay current with medical research and make informed decisions.`,
    keywords: ['imhotep', 'medical', 'health', 'doctor', 'healthcare', 'lab', 'treatment'],
  },
  {
    id: 'bot-medical-features',
    topic: 'AI Assistants',
    question: 'What can the Medical Expert do?',
    content: `The Medical Expert (Imhotep) provides: Evidence-based insights from medical literature, research assistance and analysis, case analysis support, medical literature review, and clinical guidelines integration. It's designed to assist medical professionals in staying current with research while keeping your health data private and secure. Note: It supports healthcare professionals and is not a replacement for medical advice.`,
    keywords: ['medical', 'features', 'evidence', 'research', 'clinical', 'health', 'guidelines'],
  },

  // Bots - Legal Expert
  {
    id: 'bot-legal-overview',
    topic: 'AI Assistants',
    question: 'What is Lex the Legal Expert?',
    content: `Lex is our Legal Expert Assistant—a Swiss legal assistant with AI analysis, lawyer collaboration features, and jurisdiction-specific expertise. It helps navigate legal complexities with comprehensive legal research and analysis support for legal professionals.`,
    keywords: ['lex', 'legal', 'lawyer', 'law', 'swiss', 'jurisdiction', 'contract'],
  },
  {
    id: 'bot-legal-features',
    topic: 'AI Assistants',
    question: 'What can the Legal Expert do?',
    content: `The Legal Expert (Lex) provides: Legal research assistance, document analysis, case law insights, regulatory compliance support, and contract review assistance. It combines advanced legal knowledge with AI capabilities to provide comprehensive support for legal research and analysis. Note: Lex is a research tool and not a replacement for professional legal advice.`,
    keywords: ['legal', 'features', 'research', 'contract', 'compliance', 'document', 'analysis'],
  },

  // Bots - Trident
  {
    id: 'bot-trident-overview',
    topic: 'AI Assistants',
    question: 'What is Trident?',
    content: `Trident is our AI Product Manager—a specialized tool that combines project management capabilities with technical guidance to streamline development workflow. It's specifically optimized for Cursor development and helps teams organize tasks, create implementation plans, and deliver quality software faster.`,
    keywords: ['trident', 'product', 'manager', 'cursor', 'development', 'project', 'management'],
  },
  {
    id: 'bot-trident-features',
    topic: 'AI Assistants',
    question: 'What can Trident do?',
    content: `Trident provides: Project management to organize tasks and deliverables, technical direction with implementation-ready specifications, workflow optimization to eliminate roadblocks, detailed implementation planning and roadmaps, quality assurance strategies, and Cursor-optimized workflows. It produces clear specifications, architecture diagrams, and risk assessments that developers can immediately use.`,
    keywords: ['trident', 'features', 'project', 'tasks', 'specifications', 'roadmap', 'cursor'],
  },

  // Bots - Artistic Advisor
  {
    id: 'bot-muse-overview',
    topic: 'AI Assistants',
    question: 'What is Muse the Artistic Advisor?',
    content: `Muse is our Artistic Advisor—an AI that enhances your creative process with expert guidance on composition, style analysis, and technique refinement for your artistic projects. Whether you're a painter, designer, or creative professional, Muse helps you explore new techniques while maintaining your unique vision.`,
    keywords: ['muse', 'artistic', 'art', 'creative', 'design', 'composition', 'style'],
  },
  {
    id: 'bot-muse-features',
    topic: 'AI Assistants',
    question: 'What can the Artistic Advisor do?',
    content: `The Artistic Advisor (Muse) provides: Style analysis to understand and develop your artistic voice, composition guidance for better visual arrangements, technique suggestions based on your goals, color theory assistance, and art history insights to inspire your work. Muse helps artists explore new techniques and refine their style while maintaining their unique creative vision.`,
    keywords: ['artistic', 'features', 'style', 'composition', 'color', 'technique', 'history'],
  },

  // Consulting Services
  {
    id: 'consulting-overview',
    topic: 'Consulting',
    question: 'What consulting services does Botsmann offer?',
    content: `Botsmann offers expert AI bot consulting services. We provide: Custom bot development (we design and build AI bots tailored to your business processes), Integration & deployment (seamlessly integrate AI into your existing systems), and Training & support (knowledge transfer, best practices, and ongoing support). Our team helps you design, develop, and deploy intelligent assistants tailored to your specific needs.`,
    keywords: [
      'consulting',
      'services',
      'custom',
      'development',
      'integration',
      'training',
      'support',
    ],
  },
  {
    id: 'consulting-diy',
    topic: 'Consulting',
    question: 'Can I build my own AI assistant?',
    content: `Yes! If you prefer to build it yourself, we offer free DIY guides in our Knowledge Center with step-by-step instructions. We believe in empowering users with knowledge. However, if you want expert guidance or don't have the time, our consulting team is happy to help with custom development and deployment.`,
    keywords: ['diy', 'self', 'build', 'guide', 'knowledge', 'tutorial', 'learn'],
  },

  // Contact & Getting Started
  {
    id: 'contact-consultation',
    topic: 'Contact',
    question: 'How do I book a consultation?',
    content: `You can book a free consultation by visiting the Contact page on our website or clicking "Book a Consultation" on the homepage. We'll schedule a call to understand your needs—whether it's medical, legal, financial, or learning use cases—and recommend the best approach. No commitment required!`,
    keywords: ['contact', 'consultation', 'book', 'call', 'talk', 'meet', 'schedule'],
  },
  {
    id: 'demo-available',
    topic: 'Demo',
    question: 'Can I try a demo?',
    content: `Yes! We have a live demo available on the website. Click "Try the Demo" on the homepage to experience our Swiss German teaching assistant (Heidi). The demo shows how our AI assistants work—you can ask questions and see intelligent responses based on a knowledge base. It's a great way to understand what private AI assistants can do for you.`,
    keywords: ['demo', 'try', 'test', 'example', 'live', 'experience', 'sample'],
  },
];

export default botsmannKnowledge;
