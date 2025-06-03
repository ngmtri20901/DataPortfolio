
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
    backgroundImage: '/lovable-uploads/f4a08693-230a-40f3-9c33-6f6e83880d54.png'
  },
  {
    id: 'skills',
    title: 'Skills',
    subtitle: 'Technical Expertise',
    description: 'Business Data Analysis • Data Engineering • Data Science',
    content: [
      { title: 'Business Data Analysis', desc: 'SQL, Tableau, Power BI, Excel' },
      { title: 'Data Engineering', desc: 'Python, Apache Spark, AWS, ETL Pipelines' },
      { title: 'Data Science', desc: 'Machine Learning, R, Statistics, Deep Learning' }
    ],
    backgroundImage: '/lovable-uploads/37bc3e22-5f16-4110-a029-5acdb91eb8e8.png'
  },
  {
    id: 'certificates',
    title: 'Certificates',
    subtitle: 'Professional Credentials',
    description: 'Recognized expertise in data analytics and engineering',
    content: [
      { title: 'AWS Certified Data Engineer', desc: 'Advanced cloud data solutions & architecture' },
      { title: 'Google Data Analytics Certificate', desc: 'Professional data analysis & visualization' },
      { title: 'Microsoft Azure Data Scientist', desc: 'Machine learning & AI expertise' },
      { title: 'Tableau Desktop Specialist', desc: 'Advanced data visualization techniques' },
      { title: 'Apache Spark Developer', desc: 'Big data processing & analytics' },
      { title: 'Python Data Science Certification', desc: 'Advanced Python for data analysis' }
    ],
    backgroundImage: '/lovable-uploads/1522c645-995d-4cc9-bda1-ef715af83d9c.png'
  },
  {
    id: 'projects',
    title: 'Projects',
    subtitle: 'Data Solutions Portfolio',
    description: 'Real-world applications of data science and engineering',
    content: [
      { title: 'E-commerce Analytics Dashboard', desc: 'Real-time sales insights with Tableau & SQL' },
      { title: 'Predictive Customer Churn Model', desc: 'ML model reducing churn by 25% using Python' },
      { title: 'ETL Pipeline for Financial Data', desc: 'Automated data processing with Apache Spark' },
      { title: 'Social Media Sentiment Analysis', desc: 'NLP model analyzing customer feedback' },
      { title: 'Supply Chain Optimization', desc: 'Data-driven logistics improvement system' },
      { title: 'Healthcare Data Warehouse', desc: 'Scalable data architecture on AWS' }
    ],
    backgroundImage: '/lovable-uploads/61fe0aa1-04c7-4a4a-a9ad-bb674a9cd287.png'
  },
  {
    id: 'contact',
    title: 'Contact',
    subtitle: 'Let\'s Connect',
    description: 'Ready to collaborate on your next data project',
    content: [
      { title: 'Email', desc: 'data.expert@email.com' },
      { title: 'LinkedIn', desc: 'linkedin.com/in/dataexpert' },
      { title: 'GitHub', desc: 'github.com/dataexpert' }
    ],
    backgroundImage: '/lovable-uploads/5c063a3a-c399-46df-8ee4-f69cee507f8e.png'
  },
  {
    id: 'about',
    title: 'About',
    subtitle: 'The Journey',
    description: 'Passionate about turning data into actionable insights for business growth',
    content: [
      { title: 'Experience', desc: '5+ years in data analytics and engineering' },
      { title: 'Education', desc: 'MS in Data Science, BS in Statistics' },
      { title: 'Passion', desc: 'Bridging the gap between data and business value' }
    ],
    backgroundImage: '/lovable-uploads/c84a2539-0b5c-442c-bc14-93992416b2bc.png'
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
