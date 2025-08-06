"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", icon: "🏠", path: "/dashboard" },
    { label: "Documents", icon: "📂", path: "/dashboard/documents" },
    { label: "Images", icon: "🖼️", path: "/dashboard/images" },
    { label: "Media", icon: "🎬", path: "/dashboard/media" },
    { label: "Others", icon: "📁", path: "/dashboard/others" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white shadow p-4">
      <div className="text-2xl font-bold mb-6 text-rose-500">StoreIt</div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            className="flex items-center w-full px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
