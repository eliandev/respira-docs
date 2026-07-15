/** @type {import('next').NextConfig} */
const nextConfig = {
  // firebase-admin tiene dependencias nativas: dejar que se resuelva en runtime
  // desde node_modules en vez de que webpack intente empaquetarla.
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin"],
  },
};

export default nextConfig;
