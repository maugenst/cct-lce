module.exports = {
  extends: ["prettier"],
  plugins: ["prettier"],
  rules: {
    // let git (.gitattributes) handle this
    "linebreak-style": "off",
    // allow unused function arguments for convenience and documentary purposes
    "prettier/prettier": "error",
  },
  overrides: [
    {
      files: ["**/*.test.js"],
      env: {
        jest: true,
      },
    },
  ],
};
