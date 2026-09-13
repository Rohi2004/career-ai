import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-40 pb-24">
      {/* Background blobs */}
      <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full hero-bg-blob-1 -z-10"></div>
      <div className="absolute bottom-0 -left-[10%] w-[600px] h-[600px] rounded-full hero-bg-blob-2 -z-10"></div>

      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[600px]"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-blue-light text-accent-blue rounded-full font-semibold text-sm mb-6">
            <Sparkles size={16} />
            <span>AI-Powered Resume Builder</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-text-primary">
            Build a Resume That Gets You <span className="text-gradient">Noticed.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-[600px]">
            Create professional resumes in minutes, improve them with AI insights, and discover jobs that perfectly match your unique skills and experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a href="#" className="btn btn-primary">
              Create My Resume
              <ArrowRight size={18} />
            </a>
            <a href="#jobs" className="btn btn-secondary">
              Explore Jobs
            </a>
          </div>
          
          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200`}></div>
              ))}
            </div>
            <div className="text-sm">
              <div className="font-bold text-text-primary">4.9/5 Average Rating</div>
              <div className="text-text-secondary">From 10,000+ users</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative animate-[float_6s_ease-in-out_infinite]"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 relative z-10">
            <div className="flex gap-4 mb-8 items-center">
              <div className="w-16 h-16 rounded-full bg-bg-tertiary"></div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 bg-bg-tertiary rounded-full w-[70%]"></div>
                <div className="h-3 bg-bg-tertiary rounded-full w-[40%]"></div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="h-3 bg-accent-blue rounded-full w-[40%] mb-2"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3 bg-bg-tertiary rounded-full w-full"></div>
                <div className="h-3 bg-bg-tertiary rounded-full w-full"></div>
                <div className="h-3 bg-bg-tertiary rounded-full w-[70%]"></div>
              </div>
            </div>
            
            <div>
              <div className="h-3 bg-accent-blue rounded-full w-[40%] mb-2"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3 bg-bg-tertiary rounded-full w-full"></div>
                <div className="h-3 bg-bg-tertiary rounded-full w-[70%]"></div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute top-[60%] lg:-right-[10%] right-0 bg-white rounded-2xl p-6 shadow-lg border border-purple-200/50 z-20 w-[250px] flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 font-semibold text-accent-purple text-sm">
              <Sparkles size={16} />
              AI Suggestion
            </div>
            <div className="bg-accent-purple-light p-4 rounded-lg text-sm text-text-primary">
              <p className="m-0">Consider adding metrics to this bullet point. e.g., "Increased sales by <strong>25%</strong>"</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary px-4 py-2 text-xs flex-1">Apply</button>
              <button className="btn btn-secondary px-4 py-2 text-xs flex-1">Ignore</button>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </section>
  );
};

export default Hero;
