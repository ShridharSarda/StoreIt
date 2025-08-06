'use client';

import { useState } from 'react';
import { storage, ID, account, Permission, Role } from '@/appwrite/config';

type FileUploadProps = {
  onUploadSuccess?: () => void;
};

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first!');
    setUploading(true);

    try {
      const user = await account.get();

      const uploaded = await storage.createFile(
        '688876fc003b6222d452',
        ID.unique(),
        file,
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id))
        ]
      );

      alert(`File uploaded: ${uploaded.name}`);
      setFile(null);

      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. See console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  );
}
