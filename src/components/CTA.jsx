import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="py-24 md:py-32 container">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="bg-text-primary rounded-[2rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 cta-bg-gradient z-0"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to accelerate your career?</h2>
          <p className="text-lg text-text-light mb-10 max-w-xl mx-auto">
            Join thousands of professionals who have already landed their dream jobs using CareerAI. Start building your perfect resume today.
          </p>
          <a href="#" className="btn bg-white text-accent-blue hover:-translate-y-1 hover:bg-slate-50 transition-all px-8 py-4 text-lg inline-flex items-center gap-2 rounded-full font-semibold">
            Create Your Resume Now
            <ArrowRight size={20} />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
