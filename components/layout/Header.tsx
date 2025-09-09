import React from 'react';
import Link from 'next/link';
import { UserButton, auth } from '@clerk/nextjs';

const Header = () => {
  const { userId } = auth();

  return (
    <header className="bg-background border-b border-border p-4 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-2xl font-bold text-foreground">TradeConnect</h1>
      </Link>
      <nav className="flex items-center space-x-4">
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
          {userId ? (
            <li>
              <Link href="/user" className="text-muted-foreground hover:text-foreground">
                Profile
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link href="/sign-in" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="text-muted-foreground hover:text-foreground">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
        {userId && <UserButton afterSignOutUrl="/" />}
      </nav>
    </header>
  );
};

export default Header;
