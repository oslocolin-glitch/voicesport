"use client";

import { Bot } from "lucide-react";

export default function AdminAIJobsPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
        <Bot className="w-5 h-5 text-violet-400" />
        AI Transform Jobs
      </h2>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <Bot className="w-10 h-10 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">No AI jobs yet</p>
        <p className="text-gray-500 text-sm mt-1">AI transformation jobs will appear here once users start using AI Studio.</p>
      </div>
    </div>
  );
}
