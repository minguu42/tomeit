module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  plugins: ["stylelint-order"],
  ignoreFiles: ["**/node_modules/**"],
  rules: {
    "at-rule-no-unknown": null,
  },
};
