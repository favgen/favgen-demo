/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "airbnb-base",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "import/extensions": [
      "error",
      {
        js: "ignorePackages",
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      { packageDir: [".", "./packages/client", "./packages/server"] },
    ],
  },
};
