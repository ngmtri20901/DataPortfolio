import { motion } from 'framer-motion';
import { useNotionData } from '../hooks/useNotionData';
import { NotionPortfolioItem } from '../types/notion';

interface Section {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content?: Array<{ title: string; desc: string; link?: string }>;
  backgroundImage: string;
}

interface PortfolioSectionProps {
  section: Section;
  isActive: boolean;
}

const PortfolioSection = ({ section, isActive }: PortfolioSectionProps) => {
  const { data: notionData, loading, error } = useNotionData(section.id);

  // Transform notion data to match existing content format
  const transformedContent = notionData.map((item: NotionPortfolioItem) => ({
    title: item.title,
    desc: item.content,
    link: item.link,
  }));

  // Use Notion data if available, otherwise fall back to static content
  const contentToRender = transformedContent.length > 0 ? transformedContent : section.content;

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
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center h-full flex flex-col justify-center"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Glassmorphism Container */}
        <div className="backdrop-blur-md bg-white/20 rounded-3xl border border-white/30 p-4 sm:p-6 lg:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-2 sm:mb-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {section.title}
          </motion.h1>
          
          <motion.h2
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-3 sm:mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {section.subtitle}
          </motion.h2>
          
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-4 sm:mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {section.description}
          </motion.p>
          
          {/* Loading State */}
          {loading && (
            <motion.div
              className="text-white/70 text-sm sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Loading content...
            </motion.div>
          )}
          
          {/* Error State */}
          {error && (
            <motion.div
              className="text-red-300 text-sm sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Error loading content: {error}
            </motion.div>
          )}
          
          {/* Content Cards */}
          {contentToRender && !loading && !error && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-8"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              {contentToRender.map((item, index) => (
                <motion.div
                  key={index}
                  className="backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 p-3 sm:p-4 lg:p-6 hover:bg-white/20 transition-all duration-300"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-white mb-2 sm:mb-3 hover:underline decoration-2 underline-offset-4 transition-all duration-300">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-white/70">
                        {item.desc}
                      </p>
                    </a>
                  ) : (
                    <>
                      <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-white mb-2 sm:mb-3 hover:underline decoration-2 underline-offset-4 transition-all duration-300 cursor-default">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-white/70">
                        {item.desc}
                      </p>
                    </>
                  )}
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
