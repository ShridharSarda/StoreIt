'use client';

import { useState } from 'react';
import { account } from '@/appwrite/config';
import { ID } from 'appwrite';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async () => {
    try {
      const response = await account.createEmailToken(ID.unique(), email);
      setUserId(response.userId);
      setIsOtpSent(true);
      alert('OTP sent to your email!');
    } catch (error) {
      console.error('Send OTP Error:', error);
      alert('Failed to send OTP');
    }
  };

const handleVerifyOtp = async () => {
  try {
 
    const session = await account.createSession(userId, otp);
    console.log('✅ Session created:', session);

    const user = await account.get();
    console.log('✅ Logged in user:', user);

    alert('Login successful!');
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('❌ Verify OTP Error:', error);
    alert('OTP verification failed. Please check the code.');
  }
};


    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign In</h2>

        {!isOtpSent ? (
          <>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
            />

            <button
              onClick={handleSendOtp}
              className="w-full bg-rose-500 text-white py-3 rounded-full font-medium hover:bg-rose-600 transition"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
    <label className="block text-sm font-medium text-gray-600">Enter OTP</label>

    <div className="flex justify-between space-x-2">
      {[...Array(6)].map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          className="w-12 h-12 text-center text-lg border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, ''); // only digits
            if (!value) return;
            const newOtp = otp.split('');
            newOtp[index] = value;
            setOtp(newOtp.join(''));
            if (e.target.nextSibling instanceof HTMLInputElement) {
              e.target.nextSibling.focus();
            }
          }}
        />
      ))}
    </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{' '}
          <a href="/signup" className="text-rose-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}