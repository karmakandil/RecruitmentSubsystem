'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function PayrollConfigurationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/dashboard/payroll-configuration/policies', label: 'Policies' },
    { href: '/dashboard/payroll-configuration/pay-grades', label: 'Pay Grades' },
    { href: '/dashboard/payroll-configuration/pay-types', label: 'Pay Types' },
    { href: '/dashboard/payroll-configuration/allowances', label: 'Allowances' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/payroll-configuration/policies') {
      return pathname?.startsWith('/dashboard/payroll-configuration/policies');
    }
    if (href === '/dashboard/payroll-configuration/pay-grades') {
      return pathname?.startsWith('/dashboard/payroll-configuration/pay-grades');
    }
    if (href === '/dashboard/payroll-configuration/pay-types') {
      return pathname?.startsWith('/dashboard/payroll-configuration/pay-types');
    }
    if (href === '/dashboard/payroll-configuration/allowances') {
      return pathname?.startsWith('/dashboard/payroll-configuration/allowances');
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Payroll Configuration</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${
                        active
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}