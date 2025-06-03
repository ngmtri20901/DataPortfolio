
import { motion } from 'framer-motion';

interface Section {
  id: string;
  title: string;
}

interface VerticalNavigationProps {
  sections: Section[];
  currentSection: number;
  onNavigate: (index: number) => void;
}

const VerticalNavigation = ({ sections, currentSection, onNavigate }: VerticalNavigationProps) => {
  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-4">
      {sections.map((section, index) => (
        <motion.button
          key={section.id}
          onClick={() => onNavigate(index)}
          className="group relative flex items-center"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Dot */}
          <div
            className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${
              currentSection === index 
                ? 'bg-white shadow-lg' 
                : 'bg-white/30 hover:bg-white/60'
            }`}
          />
          
          {/* Label */}
          <motion.span
            className="absolute right-6 bg-white/90 text-slate-800 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ x: 10, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
          >
            {section.title}
          </motion.span>
        </motion.button>
      ))}
    </div>
  );
};

export default VerticalNavigation;
