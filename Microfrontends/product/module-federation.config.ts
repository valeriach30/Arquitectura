export const mfConfig = {
  name: "product",
  exposes: {},
  remotes: {
    home: "home@http://localhost:3000/mf-manifest.json",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
    // Share CSS related dependencies if any
  },
  dts: false, // Disable automatic type generation
};
