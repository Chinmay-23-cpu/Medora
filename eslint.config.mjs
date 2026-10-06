import type { Config } from "eslint";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**"],
  },
];

export default eslintConfig as Config[];
