"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account, storage } from "@/appwrite/config";
import Sidebar from "@/components/Sidebar";

const BUCKET_ID = "688876fc003b6222d452";

type FileType = {
  $id: string;
  name: string;
};

export default function ImagesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<FileType[]>([]);
  const router = useRouter();

  const fetchFiles = async () => {
    try {
      const fileList = await storage.listFiles(BUCKET_ID);
      setFiles(fileList.files as FileType[]);
    } catch (e) {
      console.error("Failed to fetch files:", e);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await account.get();
        setUser(res);
        await fetchFiles();
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading || !user)
    return <p className="text-center mt-10">Loading...</p>;

  const imageFiles = files.filter((f) =>
    f.name.toLowerCase().match(/\.(png|jpg|jpeg|gif|webp)$/)
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4">All Images</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imageFiles.map((file) => (
            <div key={file.$id} className="bg-white border rounded p-2">
              <img
                src={storage.getFileView(BUCKET_ID, file.$id)}
                alt={file.name}
                className="h-32 object-contain"
              />
              <p className="truncate">{file.name}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
