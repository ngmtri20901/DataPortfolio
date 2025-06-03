
import { motion } from 'framer-motion';

const LoadingAnimation = () => {
  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-b from-sky-200 via-sky-300 to-emerald-200 flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        <motion.div 
          className="relative mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="w-32 h-32 mx-auto">
            {/* Floating leaf animation */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-emerald-400 rounded-full opacity-70"
                style={{
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
                animate={{
                  y: [-20, 20, -20],
                  x: [-10, 10, -10],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold text-slate-700 mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Data Portfolio
        </motion.h1>
        
        <motion.p 
          className="text-lg text-slate-600"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          Loading magical insights...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;
