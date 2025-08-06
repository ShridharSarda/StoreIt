'use client';

import { useState } from 'react';
import { account, databases } from '@/appwrite/config';
import { ID } from 'appwrite';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const userId = ID.unique();
      await account.create(userId, email, password, name);

      await databases.createDocument(
        '688876d70013b34ad685',
        '688b964e003def998847',
        ID.unique(),
        {
          name,
          email,
        }
      );

      await account.createSession(email, password);

      router.push('/login');
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error creating account');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign Up</h2>

        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        <button
          onClick={handleSignup}
          className="w-full py-3 rounded-full bg-red-400 text-white font-semibold hover:bg-red-500 transition duration-300"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-red-400 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
