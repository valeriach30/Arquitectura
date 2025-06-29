export const mfConfig = {
  name: "home",
  exposes: {
    "./Header": "./src/Header.tsx",
    "./Footer": "./src/Footer.tsx",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
  dts: false, // Disable automatic type generation to avoid errors
};
