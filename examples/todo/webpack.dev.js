const path = require("path");
const config = require("./webpack.config");

module.exports = {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
  ...config,
};
