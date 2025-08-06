'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account, storage } from "@/appwrite/config";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import FileGrid from "@/components/FileGrid";
import SearchBar from "@/components/SearchBar";
import FileUpload from "@/components/FileUpload";

const BUCKET_ID = "688876fc003b6222d452";

type FileType = {
  $id: string;
  name: string;
  bucketId: string;
  $createdAt: string;
  sizeOriginal: number;
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<FileType[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [modalFile, setModalFile] = useState<FileType | null>(null);
  const [modalFileDetails, setModalFileDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    return <p className="text-center mt-10">Loading user...</p>;

  // Filter files based on search input
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentFiles = [...files]
    .sort((a, b) => b.$createdAt.localeCompare(a.$createdAt))
    .slice(0, 3);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 space-y-6">
        <Topbar
          userEmail={user.email}
          onUploadSuccess={fetchFiles}
          onLogout={async () => {
            await account.deleteSession("current");
            router.push("/login");
          }}
        />

        <FileUpload onUploadSuccess={fetchFiles} />

        <SearchBar onSearch={(query) => setSearchQuery(query)} />

        {/* Storage + Recent Files */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Storage Card */}
          <div className="bg-rose-500 text-white p-6 rounded-2xl shadow-md flex items-center justify-between w-full md:w-1/2">
            <div className="relative flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="white"
                  strokeWidth="8"
                  fill="transparent"
                  className="opacity-20"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="white"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 35}
                  strokeDashoffset={(2 * Math.PI * 35) * (1 - 0.0003)}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-lg font-bold">0.03%</div>
                <div className="text-xs">Space used</div>
              </div>
            </div>
            <div className="ml-4">
              <div className="font-semibold text-lg">Available Storage</div>
              <div className="text-sm">661.6 KB / 2GB</div>
            </div>
          </div>

          {/* Recent Files */}
          <div className="flex-1 w-full">
            <h2 className="text-lg font-semibold mb-3">Recent Files</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              {recentFiles.map((file) => (
                <div  
                  key={file.$id}
                  className="relative bg-white border rounded-lg p-3 shadow flex flex-col items-center"
                >
                  <img
                    src={storage.getFileView(BUCKET_ID, file.$id)}
                    alt={file.name}
                    className="h-24 object-contain"
                  />
                  <p className="truncate mt-2 text-sm text-center">
                    {file.name}
                  </p>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === file.$id ? null : file.$id)
                      }
                      className="text-gray-600 text-lg px-2 hover:bg-gray-100 rounded-full"
                    >
                      &#x22EE;
                    </button>
                    {openMenuId === file.$id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
                        <button
                          onClick={async () => {
                            const metadata = await storage.getFile(
                              BUCKET_ID,
                              file.$id
                            );
                            setModalFile(file);
                            setModalFileDetails(metadata);
                            setOpenMenuId(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          View Info
                        </button>
                          <button
  onClick={async () => {
    const newName = prompt("Enter new file name:", file.name);
    if (!newName || newName === file.name) {
      setOpenMenuId(null);
      return;
    }

    try {
      // Download the file blob
      const res = await fetch(storage.getFileView(BUCKET_ID, file.$id));
      const blob = await res.blob();

      // Convert blob to File
      const renamedFile = new File([blob], newName, {
        type: blob.type,
        lastModified: Date.now(),
      });

      // Upload the new file
      await storage.createFile(BUCKET_ID, "unique()", renamedFile);

      // Delete the old file
      await storage.deleteFile(BUCKET_ID, file.$id);

      // Refresh file list
      await fetchFiles();
    } catch (err) {
      console.error("Rename failed:", err);
      alert("Failed to rename file.");
    }

    setOpenMenuId(null);
  }}
  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
>
  Rename
</button>

                        <button
                          onClick={async () => {
                            const confirmDelete = confirm(`Delete "${file.name}"?`);
                            if (confirmDelete) {
                              try {
                                await storage.deleteFile(BUCKET_ID, file.$id);
                                await fetchFiles();
                              } catch (err) {
                                console.error("Failed to delete:", err);
                              }
                            }
                            setOpenMenuId(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Files Grid */}
        <h2 className="text-xl font-semibold">All Files</h2>
        <FileGrid
          files={filteredFiles}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          setModalFile={setModalFile}
          fetchFiles={fetchFiles}
        />
      </main>

      {/* Info Modal */}
      {modalFile && modalFileDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => {
            setModalFile(null);
            setModalFileDetails(null);
          }}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">File Info</h2>
            <img
              src={storage.getFilePreview(BUCKET_ID, modalFile.$id)}
              alt={modalFile.name}
              className="w-full mb-4 rounded"
            />
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Name:</strong> {modalFileDetails.name}</p>
              <p><strong>Size:</strong> {(modalFileDetails.sizeOriginal / 1024).toFixed(2)} KB</p>
              <p><strong>Uploaded:</strong> {new Date(modalFileDetails.dateCreated).toLocaleString()}</p>
            </div>
            <button
              onClick={() => {
                setModalFile(null);
                setModalFileDetails(null);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
