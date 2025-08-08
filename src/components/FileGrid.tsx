// components/FileGrid.tsx
"use client";

import { useState } from "react";
import { storage, ID } from "@/appwrite/config";

const BUCKET_ID = "688876fc003b6222d452";

export default function FileGrid({
  files,
  setModalFile,
  fetchFiles,
}: {
  files: {
    $id: string;
    name: string;
    $createdAt: string;
  }[];
  setModalFile: (file: any) => void;
  fetchFiles: () => Promise<void>;
}) {
  // 👇 LOCAL menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {files.map((file) => (
        <div
          key={file.$id}
          className="relative bg-white border rounded p-2 flex flex-col items-center"
        >
          <img
            src={storage.getFileView(BUCKET_ID, file.$id)}
            alt={file.name}
            className="h-24 object-contain cursor-pointer"
            onClick={() => setModalFile(file)}
          />
          <p className="truncate mt-2 text-sm">{file.name}</p>

          {/* 3-dot button */}
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
                  onClick={() => {
                    setModalFile(file);
                    setOpenMenuId(null);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  View Info
                </button>
                <button
                  onClick={async () => {
                    const newName = prompt("Enter new file name:", file.name);
                    if (newName && newName.trim() && newName !== file.name) {
                      try {
                        // Download file content
                        const response = await fetch(
                          storage.getFileView(BUCKET_ID, file.$id)
                        );
                        const blob = await response.blob();

                        // Upload new file
                        await storage.createFile(
                          BUCKET_ID,
                          ID.unique(),
                          new File([blob], newName.trim(), { type: blob.type })
                        );

                        // Delete old file
                        await storage.deleteFile(BUCKET_ID, file.$id);

                        // Refresh files
                        await fetchFiles();
                      } catch (err) {
                        console.error("Rename failed:", err);
                        alert("Failed to rename file.");
                      }
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
                      await storage.deleteFile(BUCKET_ID, file.$id);
                      await fetchFiles();
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
  );
}
