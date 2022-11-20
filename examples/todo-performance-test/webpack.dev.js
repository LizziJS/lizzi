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
    hot: false,
    liveReload: false,
    open: true,
    compress: true,
    port: 9000,
  },
  ...config,
};
