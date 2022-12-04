const path = require("path");
const config = require("./webpack.config");

module.exports = {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    historyApiFallback: {
      index: "index.html",
    },
    open: true,
    compress: true,
    port: 9000,
  },
  ...config,
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/",
  },
};
