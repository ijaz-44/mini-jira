'use client';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full min-h-[calc(100dvh-2rem)] bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
}