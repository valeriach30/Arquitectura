export const mfConfig = {
  name: "home",
  exposes: {
    "./Header": "./src/Header.tsx",
    "./Footer": "./src/Footer.tsx",
    "./styles": "./src/index.css",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
  dts: false, // Disable automatic type generation to avoid errors
};
