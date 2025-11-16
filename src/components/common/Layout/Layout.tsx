import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ChatbotButton from '../ChatbotButton';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default Layout;