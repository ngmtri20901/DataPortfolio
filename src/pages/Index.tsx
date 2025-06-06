import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingAnimation from '../components/LoadingAnimation';
import PortfolioSection from '../components/PortfolioSection';
import VerticalNavigation from '../components/VerticalNavigation';
import CustomCursor from '../components/CustomCursor';

const sections = [
  {
    id: 'welcome',
    title: 'Welcome',
    subtitle: 'Data Storyteller & Analytics Expert',
    description: 'Transforming raw data into meaningful insights that drive business decisions',
    backgroundImage: '/lovable-uploads/Welcome.png'
  },
  {
    id: 'skills',
    title: 'Skills',
    subtitle: 'Technical Expertise',
    description: 'Business Data Analysis • Data Engineering • Data Science',
    backgroundImage: '/lovable-uploads/Skills.png'
  },
  {
    id: 'certificates',
    title: 'Certificates',
    subtitle: 'Professional Credentials',
    description: 'Recognized expertise in data analytics and engineering',
    backgroundImage: '/lovable-uploads/Certificates.png'
  },
  {
    id: 'projects',
    title: 'Projects',
    subtitle: 'Data Solutions Portfolio',
    description: 'Real-world applications of data science and engineering',
    backgroundImage: '/lovable-uploads/Projects.png'
  },
  {
    id: 'contact',
    title: 'Contact',
    subtitle: 'Let\'s Connect',
    description: 'Ready to collaborate on your next data project',
    backgroundImage: '/lovable-uploads/Contact.png'
  },
  {
    id: 'about',
    title: 'About',
    subtitle: 'The Journey',
    description: 'Passionate about turning data into actionable insights for business growth',
    backgroundImage: '/lovable-uploads/About.png'
  }
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      
      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        setCurrentSection(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [currentSection]);

  const navigateToSection = (index: number) => {
    setCurrentSection(index);
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <CustomCursor />
      <VerticalNavigation 
        sections={sections} 
        currentSection={currentSection} 
        onNavigate={navigateToSection} 
      />
      
      <AnimatePresence mode="wait">
        <PortfolioSection
          key={currentSection}
          section={sections[currentSection]}
          isActive={true}
        />
      </AnimatePresence>
    </div>
  );
};

export default Index;
