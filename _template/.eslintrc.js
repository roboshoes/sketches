module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        ecmaVersion:  2018,
        ecmaFeatures: { modules: true },
        sourceType: "module",
        project: "./tsconfig.json",
    },
    "extends": ["@roboshoes/eslint-config"],
    "rules": {},
};
