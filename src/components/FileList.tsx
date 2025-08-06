'use client';

import { useEffect, useState } from 'react';
import { storage } from '@/appwrite/config';

const BUCKET_ID = '688876fc003b6222d452'; // your bucket ID
 const FileList = () => {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await storage.listFiles(BUCKET_ID);
        setFiles(res.files);
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (fileId: string) => {
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
      alert('Deleted!');
      setFiles(files.filter(file => file.$id !== fileId));
    } catch (err) {
      console.error(err);
    }
  };

  const getPreviewLink = (fileId: string) => {
  return storage.getFilePreview(BUCKET_ID, fileId);
};

  return (
    <div className="space-y-4 mt-4">
      {files.map((file) => (
        <div key={file.$id} className="border p-2 rounded shadow flex justify-between items-center">
          <a href={getPreviewLink(file.$id)} target="_blank" rel="noopener noreferrer" className="text-blue-600">
            {file.name}
          </a>
          <button onClick={() => handleDelete(file.$id)} className="text-red-500 hover:underline">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default FileList;
