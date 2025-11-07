import React, { useState } from 'react';
import './Contact.css';
import { ContactPageProps, FormData } from './Contact.types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Contact: React.FC<ContactPageProps> = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const contactInfo = [
    {
      id: 1,
      type: 'email',
      label: 'Email',
      value: 'info@mycompany.com',
      icon: '✉️',
    },
    {
      id: 2,
      type: 'phone',
      label: 'Phone',
      value: '(555) 123-4567',
      icon: '📞',
    },
    {
      id: 3,
      type: 'address',
      label: 'Address',
      value: '123 Business Street, City, State 12345',
      icon: '📍',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-container container">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            Get in touch with our team for any inquiries or project discussions
          </p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-main-container container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="contact-info-title">Get In Touch</h2>
              <div className="contact-details">
                {contactInfo.map((info) => (
                  <div key={info.id} className="contact-detail">
                    <div className="contact-icon">{info.icon}</div>
                    <div className="contact-text">
                      <strong>{info.label}:</strong>
                      <span>{info.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="contact-hours">
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div className="contact-form">
              <h2 className="form-title">Send us a Message</h2>
              {submitSuccess && (
                <div className="form-success">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              {submitError && (
                <div className="form-error">
                  {submitError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="contact-form-element">
                <div className="form-row">
                  <Input
                    label="Full Name"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <Input
                    label="Phone Number"
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Subject"
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Enter subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="input-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Enter your message here..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="textarea-field"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-map">
        <div className="contact-map-container">
          <div className="map-placeholder">
            <p>Map Location Placeholder</p>
            <p>Google Maps Integration Would Go Here</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;