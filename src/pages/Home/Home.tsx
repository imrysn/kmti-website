import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { HomePageProps } from './Home.types';
import homeBg from '../../assets/homebg.jpeg';
import Button from '../../components/ui/Button/Button';
import Card, { ServiceCard } from '../../components/ui/Card/Card';
import ProjectCarousel from '../../components/ui/ProjectCarousel/ProjectCarousel';
import precisionIcon from '../../assets/icons/precision-icon.png';
import innovationIcon from '../../assets/icons/innovation-icon.png';
import experienceIcon from '../../assets/icons/experience-icon.png';
import icon3D from '../../assets/icons/cube.png';
import icon2D from '../../assets/icons/cubes.png';
import inspectionIcon from '../../assets/icons/parts-inspection-icon.png';
import assemblyIcon from '../../assets/icons/machine-assembly-icon.png';
import dedemplerImage from '../../assets/image3D/dedempler.png';
import looperImage from '../../assets/image3D/looper.png';
import formingImage from '../../assets/image3D/forming.png';
import shearImage from '../../assets/image3D/shear.png';
import finishingImage from '../../assets/image3D/finishing.png';
import finishingLineImage from '../../assets/image3D/finishingLine.png';
import millingImage from '../../assets/image3D/milling.png';
import furnaceImage from '../../assets/image3D/furnace.png';

const Home: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();

  const navigateToProjects = () => {
    navigate('/projects');
  };

  const navigateToContact = () => {
    navigate('/contact');
  };

  const whyChooseUs = [
    {
      id: 1,
      title: 'PRECISION',
      description: 'Our team delivers accurate and efficient results through advanced design techniques and strict attention to detail in every project.',
      icon: precisionIcon,
    },
    {
      id: 2,
      title: 'INNOVATION',
      description: 'We develop creative engineering solutions using the latest tools and technology to bring your ideas to life with efficiency and quality.',
      icon: innovationIcon,
    },
    {
      id: 3,
      title: 'EXPERIENCE',
      description: 'With years of expertise in machine design and fabrication, we provide reliable solutions built on proven knowledge and dedication.',
      icon: experienceIcon,
    },
  ];

  const services = [
    {
      id: 1,
      title: '3D MODELING',
      description: 'We transform client data into accurate 3D models to visualize designs and detect potential issues early. This process allows for easy review, modification, and validation before proceeding to detailed drawings.',
      icon: icon3D,
    },
    {
      id: 2,
      title: '2D DETAILING',
      description: 'Our 2D detailing process ensures every dimension, material, and component is clearly defined for production. We create precise technical drawings that serve as the foundation for efficient manufacturing.',
      icon: icon2D,
    },
    {
      id: 3,
      title: 'PARTS INSPECTIONS',
      description: 'We conduct through inspection and quality checks on fabricated parts to ensure accuracy and consistency with design specifications. Using advanced measuring tools, we guarantee top-notch quality before assembly.',
      icon: inspectionIcon,
    },
    {
      id: 4,
      title: 'MACHINE ASSEMBLY',
      description: 'In collaboration with our trusted partners, we provide reliable assembly services for completed parts and machinery. Our goal is to deliver high-performance, ready-to-use systems built with precision and efficiency.',
      icon: assemblyIcon,
    },
  ];

  const projects = [
    {
      id: 1,
      title: 'DEDIMPLER AND FACER',
      description: 'Tube and pipes that require facing and or internal and external chamfering can be processed in line with the tube mill or off line.',
      category: 'MECHANICAL TUBE',
      image: dedemplerImage,
    },
    {
      id: 2,
      title: 'LOOPER MACHINE',
      description: 'Horizontal loopers store strip on a horizontal rotary table. Where the space is available this is the most efficient and cheapest method of storing strip without causing any surface damage.',
      category: 'MECHANICAL TUBE',
      image: looperImage,
    },
    {
      id: 3,
      title: 'FORMING AND SIZING',
      description: 'After metal strips has been welded and combined it will undergo forming to produce the needed shape of steel.',
      category: 'MECHANICAL TUBE',
      image: formingImage,
    },
    {
      id: 4,
      title: 'SHEAR WELDER MACHINE',
      description: 'Shear and end welders crop the tail and nose of each coil. The two coil ends are then aligned and the joint welded using TIG, MIG or MAG depending on the material and thickness being welded. Single and twin torch versions are available.',
      category: 'MECHANICAL TUBE',
      image: shearImage,
    },
    {
      id: 5,
      title: 'FINISHING TABLE',
      description: 'Extension of transfer table in the finishing line.',
      category: 'FINISHING TABLE',
      image: finishingImage,
    },
    {
      id: 6,
      title: 'FINISHING LINE',
      description: 'After pipes were cut into standard lengths it will be passed to the finishing line to be arranged and bundled ready for distribution.',
      category: 'Run out',
      image: finishingLineImage,
    },
    {
      id: 7,
      title: 'MILLING CUTOFF MACHINE',
      description: 'Milling Cutoff Machine uses two milling saws to cut to length pipe and structural section tubes. The cut finishes eliminates the need for facing.',
      category: 'MECHANICAL TUBE',
      image: millingImage,
    },
    {
      id: 8,
      title: 'FURNACE',
      description: 'Furnace is used for melting large batches of glass, in which heat is supplied by a flame playing over the glass surface, and regenerative heating of combustion air and gas is usually employed.',
      category: 'STRUCTURAL',
      image: furnaceImage,
    },
  ];

  return (
    <div className="home-page">
      <section className="hero-section" style={{ backgroundImage: `url(${homeBg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-container container">
          <div className="hero-content">
            <h1 className="hero-title">BRINGING YOUR VISION <br /> INTO CREATION, WITH <br /> PRECISION</h1>
            <div className="hero-buttons">
              <Button variant="style1" onClick={navigateToContact}>CONTACT US</Button>
              <Button variant="style2" onClick={navigateToProjects}>VIEW PROJECTS</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="why-choose-us-section">
        <div className="section-container container">
          <h2 className="section-title">WHY CHOOSE US</h2>
          <div className="cards-grid">
            {whyChooseUs.map((item) => (
              <Card
                key={item.id}
                icon={item.icon}
                title={item.title}
                subtitle={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="section-container container">
          <h2 className="section-title">OUR SERVICES</h2>
          <p className="section-subtitle">
            Comprehensive engineering solutions tailored to your specific needs, powered by cutting-edge technology and decades of expertise.
          </p>
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                subtitle={service.description}
                linkText="LEARN MORE"
                linkHref="/services"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="vision-reality-section">
        <div className="section-container container">
          <h2 className="section-title">BRINGING VISION TO REALITY</h2>
          <p className="section-subtitle">
            See how our precision - driven designs turn ideas into successful engineering solutions.
          </p>
          <ProjectCarousel projects={projects} />
        </div>
      </section>

      <section className="about-section">
        <div className="section-container container">
          <h2 className="section-title">ABOUT US</h2>
          <p className="about-description">
            Kusakabe & Maeno Tech., Inc. is a trusted engineering partner specializing in precision design, fabrication, and assembly. With years of industry experience and strong partnerships with Kusakabe Electric & Machinery Co., Ltd. Next Engineering Co., Ltd and Maeno Giken Inc., we deliver high-quality engineering solutions tailored to meet our clients’ specific needs. Our team of skilled professionals combines innovation, technology, and expertise to transform ideas into efficient, reliable, and practical designs. We take pride in our commitment to accuracy, quality, and customer satisfaction — bringing your vision into creation, with precision.
          </p>
          <a href="/about" className="about-link">Learn more about us →</a>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container container">
          <h2 className="cta-title">Ready to build your next project?</h2>
          <div className="cta-buttons">
            <Button variant="style2" onClick={navigateToContact}>CONTACT US</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;