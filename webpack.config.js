const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    example: "./src/example.js"
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js"
  },
  devServer: {
    host: "localhost",
    port: 1111,
    contentBase: path.resolve(__dirname, "./dist")
  },
  plugins: [
    new HtmlPlugin({
      template: "./index.html"
    })
  ]
};
