import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-background border-b border-border p-4 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-2xl font-bold text-foreground">TradeConnect</h1>
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/search" className="text-muted-foreground hover:text-foreground">
              Search
            </Link>
          </li>
          <li>
            <Link href="/categories" className="text-muted-foreground hover:text-foreground">
              Categories
            </Link>
          </li>
          <li>
            <Link href="/rfq" className="text-muted-foreground hover:text-foreground">
              RFQ
            </Link>
          </li>
          <li>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground">
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
