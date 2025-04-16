"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Org {
  id: string;
  name: string;
  roles: { id: string; name: string }[];
}

export default function OrgDetail() {
  const { id } = useParams();
  const [org, setOrg] = useState<Org | null>(null);
  const [roleName, setRoleName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/orgs/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch org');
          return res.json();
        })
        .then((data) => setOrg(data))
        .catch(() => setOrg(null));
    }
  }, [id]);

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roleName, orgId: id }),
      });

      if (res.ok) {
        const newRole = await res.json();
        setOrg((prev) =>
          prev
            ? { ...prev, roles: [...prev.roles, newRole] }
            : { id: id as string, name: '', roles: [newRole] }
        );
        setRoleName('');
      } else {
        setError('Failed to add role');
      }
    } catch {
      setError('Something went wrong');
    }
  };

  if (!org) {
    return <div>Org not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-5">{org.name}</h1>
      <h2 className="text-xl font-semibold mb-3">Add Role</h2>
      <form onSubmit={handleAddRole} className="mb-6 space-y-4">
        <div>
          <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
            Role Name
          </label>
          <input
            id="roleName"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Add Role
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-3">Roles</h2>
      {org.roles?.length === 0 || !org.roles ? (
        <p>No roles yet.</p>
      ) : (
        <ul className="space-y-2">
          {org.roles.map((role) => (
            <li key={role.id} className="border p-3 rounded-md">
              {role.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}