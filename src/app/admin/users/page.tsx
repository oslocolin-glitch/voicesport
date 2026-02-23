"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Users, Shield, Search, ChevronDown, MoreVertical, Mail } from "lucide-react";

type UserRole = "super_admin" | "admin" | "moderator" | "user";

interface ManagedUser {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  created_at: string;
  last_sign_in: string | null;
  provider: string;
}

const ROLES: { value: UserRole; label: string; color: string }[] = [
  { value: "super_admin", label: "Super Admin", color: "text-red-400 bg-red-500/15 border-red-500/30" },
  { value: "admin", label: "Admin", color: "text-violet-400 bg-violet-500/15 border-violet-500/30" },
  { value: "moderator", label: "Moderator", color: "text-amber-400 bg-amber-500/15 border-amber-500/30" },
  { value: "user", label: "Member", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
];

// TODO: Replace with Supabase queries once DB is connected
const sampleUsers: ManagedUser[] = [
  {
    id: "1",
    email: "hakan@collectiveinnovation.no",
    display_name: "Hakan",
    role: "super_admin",
    created_at: "2026-02-23",
    last_sign_in: "2026-02-23",
    provider: "email",
  },
];

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [users] = useState<ManagedUser[]>(sampleUsers);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const isSuperAdmin = user?.user_metadata?.role === "super_admin";

  const filtered = users.filter((u) => {
    const matchesSearch = !search || u.email.toLowerCase().includes(search.toLowerCase()) || u.display_name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    // TODO: Implement Supabase admin API call to update user role
    console.log(`Change user ${userId} role to ${newRole}`);
    setEditingUser(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            User Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-violet-500 transition"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Roles</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Provider</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Sign In</th>
                {isSuperAdmin && <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const roleInfo = ROLES.find((r) => r.value === u.role) || ROLES[3];
                return (
                  <tr key={u.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.display_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{u.display_name}</p>
                          <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editingUser === u.id && isSuperAdmin ? (
                        <select
                          defaultValue={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          onBlur={() => setEditingUser(null)}
                          autoFocus
                          className="px-2 py-1 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white outline-none"
                        >
                          {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-400 capitalize">{u.provider}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-400">{u.created_at}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-gray-400">{u.last_sign_in || "—"}</span>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setEditingUser(editingUser === u.id ? null : u.id)}
                          className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition"
                          title="Change role"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No users found</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-xs text-gray-500">
        <p><strong className="text-gray-400">Note:</strong> User data will populate from Supabase once env vars and DB schema are configured. Currently showing sample data.</p>
        <p className="mt-1">To add users: Supabase Dashboard → Authentication → Users → Add User</p>
      </div>
    </div>
  );
}
