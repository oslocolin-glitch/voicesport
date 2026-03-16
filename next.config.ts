import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Force www redirect (voicesport.org → www.voicesport.org)
      {
        source: "/:path*",
        has: [{ type: "host", value: "voicesport.org" }],
        destination: "https://www.voicesport.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
