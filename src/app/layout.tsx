import { auth } from '@/auth';
import Link from 'next/link';
import SessionWrapper from '@/components/SessionWrapper';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="bg-gray-100">
        <SessionWrapper>
          <nav className="bg-white shadow p-4">
            <div className="max-w-4xl mx-auto flex justify-between">
              <Link href="/" className="text-xl font-bold">
                Soloflow
              </Link>
              <div className="space-x-4">
                {session ? (
                  <>
                    <Link href="/dashboard" className="text-blue-600 hover:underline">
                      Dashboard
                    </Link>
                    <Link href="/settings" className="text-blue-600 hover:underline">
                      Settings
                    </Link>
                    <form
                      action="/api/auth/signout"
                      method="POST"
                      className="inline"
                    >
                      <button type="submit" className="text-blue-600 hover:underline">
                        Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" className="text-blue-600 hover:underline">
                      Sign In
                    </Link>
                    <Link href="/auth/signup" className="text-blue-600 hover:underline">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}