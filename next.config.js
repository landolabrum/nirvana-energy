const isEnvironmentProduction = () => {
  if(typeof window == "object") return window.location.host?.toLowerCase() !== DEV_URL;
  return false;
};

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.s?css$/,
      use: [
        defaultLoaders.babel,
        {
          loader: require("styled-jsx/webpack").loader,
          options: { type: "scoped" },
        },
      ],
    });
    return config;
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // redirects: () => {
  //   return [
  //     { source: '/r/:sponsor', destination: '/enroll/:sponsor', permanent: false },
  //     { source: '/r/:sponsor/:destination', destination: '/enroll/:sponsor/:destination', permanent: false },
  //   ]
  // }
};
if(isEnvironmentProduction())nextConfig = {
  ...nextConfig,
  basePath:  '/nirvana-energy',
  assetPrefix: '/nirvana-energy/',
}
module.exports = nextConfig;
