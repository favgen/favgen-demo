/* eslint-env node */
module.exports = {
  "*.{css,scss,html,vue}": "npm run stylelint --",
  "*.{vue,js,cjs,mjs}": "npm run lint --",
  "*.{json,vue,js,cjs,mjs}": "npm run prettify --",
};
