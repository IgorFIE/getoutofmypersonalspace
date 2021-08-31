const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/game.js',
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: './dist',
  },
};