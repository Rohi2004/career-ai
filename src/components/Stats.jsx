import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '500K+', label: 'Resumes Created' },
  { value: '300+', label: 'Hiring Partners' },
  { value: '85%', label: 'Interview Success' },
  { value: '4.9', label: 'App Store Rating' }
];

const Stats = () => {
  return (
    <section className="py-24 bg-bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-8"
            >
              <div className="text-5xl md:text-6xl font-extrabold mb-2 leading-none text-gradient">{stat.value}</div>
              <div className="font-medium text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
