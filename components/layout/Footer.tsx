import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border p-4 text-center text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} TradeConnect. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
