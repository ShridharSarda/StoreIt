"use client";

import { useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />
      <button
        type="submit"
        className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600"
      >
        Search
      </button>
    </form>
  );
}
