
import React from 'react';
import MobileNavbar from '../ui/MobileNavbar';
import { useLocation } from 'react-router-dom';

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, hideNavbar = false }) => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  
  return (
    <div className="mobile-container">
      <div className="page-container">
        {children}
      </div>
      {!hideNavbar && !isAdmin && <MobileNavbar />}
    </div>
  );
};

export default MobileLayout;
