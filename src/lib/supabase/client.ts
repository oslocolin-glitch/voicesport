import { createBrowserClient } from "@supabase/ssr";

let _client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: {}, error: new Error("Auth not configured") }),
        signUp: async () => ({ data: {}, error: new Error("Auth not configured") }),
        signInWithOAuth: async () => ({ data: {}, error: new Error("Auth not configured") }),
        signOut: async () => ({ error: null }),
      },
    } as unknown as ReturnType<typeof createBrowserClient>;
  }

  _client = createBrowserClient(url, key);
  return _client;
}
