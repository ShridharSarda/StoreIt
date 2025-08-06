  'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  userEmail: string;
  onUploadSuccess: () => void;
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ userEmail, onUploadSuccess, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-300">
      <div className="text-lg font-semibold">StoreIt</div>

      <div className="relative" ref={menuRef}>
        <button
          className="text-gray-600 text-2xl px-2 py-1 rounded hover:bg-gray-200"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          &#x22EE;
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">
              {userEmail}
            </div>
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
