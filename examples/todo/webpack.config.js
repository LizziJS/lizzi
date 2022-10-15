const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    main: "./app",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "public", "app.html"),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-loader",
            options: {
              esModule: false,
              modules: {
                localIdentName: "[local]__[hash:base64]__",
              },
            },
          },
        ],
      },
      {
        test: /\.html/,
        use: [
          {
            loader: "html-loader",
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)/,
        use: ["file-loader"],
      },
      {
        test: /\.(mp3)/,
        use: ["file-loader"],
      },
      {
        test: /\.(ttf|woff|woff2|eot)/,
        use: ["file-loader"],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
