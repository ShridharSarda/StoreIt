 'use client';

import FileUpload from '@/components/FileUpload';
import FileList from '@/components/FileList';

export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">StoreIt - File Storage App</h1>
      <FileUpload />
      <FileList />
    </div>
  );
}
