"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface TopbarProps {
  onUploadSuccess: () => void;
  onLogout: () => void;
}

export default function Topbar({ onUploadSuccess, onLogout }: TopbarProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between bg-white px-4 py-2 shadow">
      <h1 className="text-xl font-semibold">File Storage</h1>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={onLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit</span>
        </Button>
      </div>
    </div>
  );
}
