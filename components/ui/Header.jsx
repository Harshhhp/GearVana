import React from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './button';
import { ArrowLeft, CarFront, Heart, Layout } from 'lucide-react';
import { checkUser } from '@/lib/checkUser';

const Header = async ({ isAdminPage = false }) => {
  const user = await checkUser();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="mx-auto px-4 py-2 flex items-center justify-between">
        <Link href={isAdminPage ? '/admin' : '/'}>
          <Image src="/logo-black.png" alt="Logo" width={200} height={60} />
        </Link>

        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <Link href="/">
              <Button className="flex items-center gap-2">
                <ArrowLeft size={18} />
                <span>Back To App</span>
              </Button>
            </Link>
          ) : (
            <>
              <SignedIn>
                {!isAdmin && (
                  <Link href="/reservations">
                    <Button>
                      <Heart size={18} />
                      <span className="hidden md:inline ml-2">Saved Cars</span>
                    </Button>
                  </Link>
                )}
              </SignedIn>

              <SignedIn>
                <Link href="/saved-cars">
                  <Button variant="outline">
                    <CarFront size={18} />
                    <span className="hidden md:inline ml-2">
                      My Reservations
                    </span>
                  </Button>
                </Link>
              </SignedIn>

              {isAdmin && (
                <Link href="/admin">
                  <Button >
                    <Layout size={18} />
                    <span className="hidden md:inline ml-2">Admin Portal</span>
                  </Button>
                </Link>
              )}
            </>
          )}

          <SignedOut>
            <SignInButton forceRedirectUrl="/">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
