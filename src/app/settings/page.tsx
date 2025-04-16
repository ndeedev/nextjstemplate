"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    theme: 'light',
    language: 'en',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        setError('Failed to update settings');
      }
    } catch {
      setError('Something went wrong');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-5">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) =>
                setSettings({ ...settings, notificationsEnabled: e.target.checked })
              }
              className="mr-2"
            />
            Notifications
          </label>
        </div>
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <select
            id="theme"
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
            className="mt-1 w-full border rounded-md p-2"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <input
            id="language"
            type="text"
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            className="mt-1 w-full border rounded-md p-2"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}