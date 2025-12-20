'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminLogin = pathname === '/xd/login';

  if (isAdminLogin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}

