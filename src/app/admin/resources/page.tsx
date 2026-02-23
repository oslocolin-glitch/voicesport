"use client";

import { BookOpen, Search, Filter } from "lucide-react";

export default function AdminResourcesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-400" />
          Resource Management
        </h2>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input placeholder="Search resources..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-violet-500 transition" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-400 hover:text-white transition">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <BookOpen className="w-10 h-10 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">No resources yet</p>
        <p className="text-gray-500 text-sm mt-1">Submitted resources will appear here for review and approval.</p>
      </div>
    </div>
  );
}
