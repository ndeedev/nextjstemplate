"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Org {
  id: string;
  name: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetch('/api/orgs')
        .then((res) => res.json())
        .then((data) => setOrgs(data));
    }
  }, [status, router]);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/orgs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        const newOrg = await res.json();
        setOrgs([...orgs, newOrg]);
        setName('');
      } else {
        setError('Failed to create org');
      }
    } catch {
      setError('Something went wrong');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-5">Dashboard</h1>
      {session?.user && (
        <p className="mb-4">Welcome, {session.user.name || session.user.email}!</p>
      )}
      <h2 className="text-xl font-semibold mb-3">Create Org</h2>
      <form onSubmit={handleCreateOrg} className="mb-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Org Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Create
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-3">Your Orgs</h2>
      {orgs.length === 0 ? (
        <p>No orgs yet.</p>
      ) : (
        <ul className="space-y-2">
          {orgs.map((org) => (
            <li key={org.id} className="border p-3 rounded-md">
              <Link href={`/org/${org.id}`} className="text-blue-600 hover:underline">
                {org.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <Link href="/settings" className="text-blue-600 hover:underline">
          Update Settings
        </Link>
      </div>
    </div>
  );
}