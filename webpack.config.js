const path = require('path');

module.exports = [
  {
    mode: 'production',
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'nestjs-general-interceptor.min.js',
      library: 'nestjs-general-interceptor',
      libraryTarget: 'commonjs-module',
    },
  },
  {
    mode: 'development',
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'nestjs-general-interceptor.js',
      library: 'nestjs-general-interceptor',
      libraryTarget: 'commonjs-module',
    },
    devtool: 'inline-source-map',
  },
];
