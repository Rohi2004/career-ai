import React from 'react';
import { FileText, Search, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <FileText size={28} />,
    title: 'AI Resume Builder',
    description: 'Create a stunning resume in minutes with our intelligent drag-and-drop builder. Get real-time AI suggestions for action verbs and impactful metrics.',
    colorClass: 'bg-accent-blue-light text-accent-blue'
  },
  {
    icon: <Search size={28} />,
    title: 'Smart Job Matching',
    description: 'Our AI analyzes your unique skills and experience to find the perfect job matches from thousands of top companies, saving you hours of searching.',
    colorClass: 'bg-accent-purple-light text-accent-purple'
  },
  {
    icon: <Briefcase size={28} />,
    title: 'Application Tracking',
    description: 'Keep track of all your applications, interviews, and offers in one centralized dashboard. Never miss a deadline or follow-up opportunity again.',
    colorClass: 'icon-gradient'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 bg-bg-secondary">
      <div className="container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">Powerful Features for Your Career</h2>
          <p className="text-lg md:text-xl text-text-secondary">
            Everything you need to land your dream job, powered by advanced artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-10 shadow-md border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-blue-500/30 flex flex-col h-full"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.colorClass}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-primary">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
