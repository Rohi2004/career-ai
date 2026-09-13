import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '1',
    title: 'Build Resume',
    description: 'Start with our proven templates and add your experience.'
  },
  {
    number: '2',
    title: 'Improve With AI',
    description: 'Get tailored suggestions to highlight your achievements.'
  },
  {
    number: '3',
    title: 'Find Matching Jobs',
    description: 'Discover opportunities that align with your new resume.'
  },
  {
    number: '4',
    title: 'Track Applications',
    description: 'Monitor your progress and ace your interviews.'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-bg-primary">
      <div className="container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">Your Journey to a Dream Job</h2>
          <p className="text-lg md:text-xl text-text-secondary">
            A simple, streamlined process designed to maximize your career potential.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-8 relative mt-16">
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-slate-200 z-[1]"></div>
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex-1 flex flex-col items-center text-center relative z-[2] group"
            >
              <div className="w-16 h-16 rounded-full bg-white border-2 border-accent-blue flex items-center justify-center text-2xl font-bold text-accent-blue mb-6 shadow-[0_0_0_8px_#ffffff] group-hover:bg-accent-blue group-hover:text-white transition-colors duration-300">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-primary">{step.title}</h3>
              <p className="text-text-secondary">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
