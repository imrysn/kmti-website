import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Careers.css';
import { CareersPageProps } from './Careers.types';
import careersBg from '../../assets/careersbg.jpg';
import kmtiModel from '../../assets/kmti-model.png';
import mapsIcon from '../../assets/icons/maps-icon.png';
import clockIcon from '../../assets/icons/clock-icon.png';
import insuranceIcon from '../../assets/icons/insurance-icon.png';
import benefitsIcon from '../../assets/icons/benefits-icon.png';
import thirteenthMonthIcon from '../../assets/icons/13thmonth-icon.png';
import allowanceIcon from '../../assets/icons/allowance-icon.png';
import careerIcon from '../../assets/icons/career-icon.png';
import checkIcon from '../../assets/icons/check-icon.png';
import teamPhoto from '../../assets/aboutPage/ourpeople4.jpg';
import contactIcon from '../../assets/icons/contact.png';
import emailIcon from '../../assets/icons/email-icon.png';
import Button from '../../components/ui/Button/Button';
import { ApplyCard, WhyWorkWithUsCard, HowToApplyCard } from '../../components/ui/Card/Card';

const Careers: React.FC<CareersPageProps> = () => {
  const navigate = useNavigate();

  const navigateToAbout = () => {
    navigate('/about');
  };

  const navigateToPositions = () => {
    const positionsContainer = document.querySelector('.careers-positions-container');
    positionsContainer?.scrollIntoView({ behavior: 'smooth' });
  };

  const whyWorkWithUs = [
    {
      id: 1,
      title: 'MEDICAL INSURANCE',
      description: '100% Company paid medical insurance for regular employees',
      icon: insuranceIcon,
    },
    {
      id: 2,
      title: 'GOVERNMENT BENEFITS',
      description: 'Complete mandated statutory benefits including SSS, Pag-IBIG, and PhilHealth',
      icon: benefitsIcon,
    },
    {
      id: 3,
      title: '13TH MONTH PAY',
      description: 'Guaranteed 13th month pay as mandated by Philippine labor law',
      icon: thirteenthMonthIcon,
    },
    {
      id: 4,
      title: 'MULTIPLE ALLOWANCE',
      description: 'Transportation, meal, uniform, and rice subsidy allowances for regular employees',
      icon: allowanceIcon,
    },
    {
      id: 5,
      title: 'LONG-TERM CAREER',
      description: 'Stable employment with opportunities for long-term professional growth',
      icon: careerIcon,
    },
  ];

  return (
    <div className="careers-page">
      <section className="hero-section" style={{ backgroundImage: `url(${careersBg})` }}>
        <div className="hero-overlay"></div>
        <img src={kmtiModel} alt="KMTI Team" className="careers-hero-model" />
        <div className="hero-container container">
          <div className="hero-content">
            <h1 className="hero-title">Build the future with us</h1>
            <p className="careers-hero-description">
              Join a team of passionate innovators creating technology that makes a real difference. <br /> We're looking for talented individuals who share our vision of building exceptional products.
            </p>
            <div className="hero-buttons">
              <Button variant="style1" onClick={navigateToPositions} width="255px" height="55px">VIEW OPEN POSITIONS</Button>
              <Button variant="style2" onClick={navigateToAbout} width="255px" height="55px">ABOUT US</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="careers-positions-section">
        <div className="careers-positions-container container">
          <h2 className="careers-positions-title">OPEN POSITION</h2>
          <p className="careers-positions-subtitle">
            Find your next career opportunity and help us build something amazing
          </p>
          <div className="careers-positions-grid">
            <ApplyCard
              title="ENGINEERING STAFF / CAD OPERATOR"
              location="Dasmariñas City, Cavite"
              type="Full-Time"
              locationIcon={mapsIcon}
              typeIcon={clockIcon}
              description="Join our engineering team with expertise in AutoCAD, SolidWorks and iCAD for 2D & 3D drawing. Seeking candidates with strong leadership, teamwork abilities, and mathematical knowledge who are willing to learn and work under minimum supervision."
              skills={['AutoCAD', 'SolidWorks', 'iCAD', '2D Detailing', '3D Drawing', 'Mathematics']}
              requirements={[
                'Male / Female 18 years old and above',
                'Knowledge in AutoCAD, SolidWorks and iCAD (2D & 3D Drawing)',
                'Knowledgeable in relevant mathematical concepts',
                'Strong leadership and teamwork skills',
                'Attention to detail and precision'
              ]}
              preferredCourses={['Mechanical Engineering', 'Civil Engineering', 'Architecture', 'On-the-job Training', 'Industrial Engineering']}
              onApply={() => {
                window.open('https://www.linkedin.com/company/kusakabe-maeno-tech-inc/jobs/', '_blank');
              }}
            />
            <ApplyCard
              title="ACCOUNTING / ADMIN STAFF"
              location="Dasmarinas City, Cavite"
              type="Full-Time"
              locationIcon={mapsIcon}
              typeIcon={clockIcon}
              description="Assist with day-to-day operations of the Admin functions and duties. Provide clerical and administrative support. Conduct end-to-end recruitment process. Responsible for Comprehensation and Benefits, and for DOLE Monthly/Annual Reports."
              requirements={[
                'Computer literate',
                'Good to excellent communication skills (oral and written)',
                'Strong personality and positive work attitude',
                'Results oriented and can work under pressure',
                'Strong time-management skills and multitasking',
                'Fresh graduates are encouraged to applu',
                'Knowledge of accounting principles',
                'Experience with DOLE reporting is a plus'
              ]}
              preferredCourses={['Human Resource Development Management', 'BS in Business Administration', 'Accounting', 'Management']}
              onApply={() => {
                window.open('https://www.linkedin.com/company/kusakabe-maeno-tech-inc/jobs/', '_blank');
              }}
            />
          </div>
        </div>
      </section>

      <section className="why-work-withus-section">
        <div className="why-work-withus-container container">
          <h2 className="why-work-withus-title">WHY WORK WITH US</h2>
          <p className="why-work-withus-subtitle">
            We believe in taking care of our team so they can do their best work.
          </p>
          <div className="why-work-withus-grid">
            {whyWorkWithUs.map((item) => (
              <WhyWorkWithUsCard
                key={item.id}
                icon={item.icon}
                title={item.title}
                subtitle={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="meet-our-team-section">
        <div className="meet-our-team-container container">
          <div className="meet-our-team-content">
            <h2 className="meet-our-team-title">Meet Our Team</h2>
            <p className="meet-our-team-description">
              We're a diverse group of makers, thinkers, and problem-solvers. We bring different perspectives, experiences, and expertise to every project.
            </p>
            <ul className="meet-our-team-list">
              <li>
                <img src={checkIcon} alt="Check" className="meet-our-team-check-icon" />
                <span>Collaborative and inclusive environment</span>
              </li>
              <li>
                <img src={checkIcon} alt="Check" className="meet-our-team-check-icon" />
                <span>Opportunities for growth and learning</span>
              </li>
              <li>
                <img src={checkIcon} alt="Check" className="meet-our-team-check-icon" />
                <span>Work on meaningful projects with real impact</span>
              </li>
            </ul>
            <div className="meet-our-team-button">
              <Button variant="style2" onClick={navigateToAbout}>LEARN MORE ABOUT US</Button>
            </div>
          </div>
          <div className="meet-our-team-image-wrapper">
            <img src={teamPhoto} alt="KMTI Team" className="meet-our-team-image" />
          </div>
        </div>
      </section>

      <section className="how-to-apply-section">
        <div className="how-to-apply-container container">
          <h2 className="how-to-apply-title">HOW TO APPLY</h2>
          <p className="how-to-apply-subtitle">
            Ready to start your engineering career with KMTI? Here's how to get in touch with us.
          </p>
          <div className="how-to-apply-grid">
            <HowToApplyCard
              icon={mapsIcon}
              title="VISIT OUR OFFICE"
            >
              <p>Submit your resume in person at our KMTI office:</p>
              <div className="address">
                Team Quest Building FCIE<br />
                Langkaan Dasmarinas City, Cavite<br />
                (Near PLDT)
              </div>
              <p>Contact Person: Ms. Raine Royo</p>
            </HowToApplyCard>
            <HowToApplyCard
              title="CONTACT"
            >
              <div className="contact-item">
                <img src={contactIcon} alt="Phone" className="contact-item-icon" />
                <div className="contact-item-content">
                  <div className="contact-item-label">Phone</div>
                  <div className="contact-item-value">(046) 413-4509</div>
                </div>
              </div>
              <div className="contact-item">
                <img src={emailIcon} alt="Email" className="contact-item-icon" />
                <div className="contact-item-content">
                  <div className="contact-item-label">Email</div>
                  <div className="contact-item-value">info@kmti.com.ph</div>
                </div>
              </div>
            </HowToApplyCard>
          </div>
          <div className="ready-to-join-section">
            <h2 className="ready-to-join-title">Ready to Join Us?</h2>
            <p className="ready-to-join-description">
              We're always looking for exceptional engineering talent. Even if you don't see a perfect match, we'd love to hear from you and learn about your unique skills and interests.
            </p>
            <div className="ready-to-join-buttons">
              <Button
                variant="style2"
                onClick={() => window.open('https://www.linkedin.com/company/kusakabe-maeno-tech-inc/', '_blank')}
              >
                VISIT LINKEDIN
              </Button>
              <Button
                variant="style2"
                onClick={() => window.open('https://www.facebook.com', '_blank')}
              >
                VISIT FACEBOOK
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;