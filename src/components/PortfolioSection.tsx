
import { motion } from 'framer-motion';

interface Section {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content?: Array<{ title: string; desc: string }>;
  backgroundImage: string;
}

interface PortfolioSectionProps {
  section: Section;
  isActive: boolean;
}

const PortfolioSection = ({ section, isActive }: PortfolioSectionProps) => {
  return (
    <motion.div
      className="h-screen w-full relative flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${section.backgroundImage})` }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Glassmorphism Container */}
        <div className="backdrop-blur-md bg-white/20 rounded-3xl border border-white/30 p-8 shadow-2xl">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {section.title}
          </motion.h1>
          
          <motion.h2
            className="text-2xl md:text-3xl text-white/90 mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {section.subtitle}
          </motion.h2>
          
          <motion.p
            className="text-lg md:text-xl text-white/80 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {section.description}
          </motion.p>
          
          {/* Content Cards */}
          {section.content && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              {section.content.map((item, index) => (
                <motion.div
                  key={index}
                  className="backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/70">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PortfolioSection;
