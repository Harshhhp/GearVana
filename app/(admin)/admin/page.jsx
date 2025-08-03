import React from 'react';
import { checkUser } from '@/lib/checkUser';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AdminPage = async () => {
  const user = await checkUser();

  // Redirect non-admins to home
  if (user?.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <main className="flex items-center justify-center h-screen w-full bg-gray-50 dark:bg-black text-center px-4">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Welcome to the Admin Portal
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          You are logged in as an admin.
        </p>
        <Link href="/">
          <Button className="px-6 py-3 text-lg">
            Return to Home
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default AdminPage;