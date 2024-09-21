// scripts/ts-node-script.js
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
  },
});
require("./hadithWord");
