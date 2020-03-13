const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const config = {
  entry: {
    main: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    filename: 'js/[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist/')
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader?cacheDirectory=true',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        include: [
          path.resolve(__dirname, '../src')
        ],
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 40960,
              name: 'images/[name].[contenthash:8].[ext]'
              // webpack3 配置 不适用于webpack4
              // fallback: {
              //     loader: 'file-loader',
              //     options: {
              //         name: 'images/[name].[contenthash:8].[ext]'
              //     }
              // }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // #1 happypack: 进行多线程构建，提高构建速度
    // #2 Commitlint
    // 统一规范 commit 格式，让 commit 信息整整齐齐的展示 安装 commitlint 、@commitlint/cli、@commitlint/config - conventional
    // #3 stylelint 样式规范检测

    new webpack.DefinePlugin({
      THREEDIMENSION: JSON.stringify('THREE BODY')
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      filename: 'index.html',
      title: 'hmtl webpack plugin title',
      // 打包好的资源注入到html的位置 default: 'body'
      // true | 'body' body结束标签前
      // 'head' head结束标签前
      inject: 'body',
      // 压缩打包后的html模板文件
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true, // 移除注释
        collapseWhitespace: true, // 折叠空白区域
        removeAttributeQuotes: true, // 移除属性的引号
        removeRedundantAttributes: true, // 删除多余的属性
        collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, '../dist/static'),
        ignore: ['.js']
      }
    ]),
    new CleanWebpackPlugin(),
    // Webpack 进行默认编译时会有很多无用的信息，需要进行清理，只显示少量信息，并便于排错。
    new FriendlyErrorsWebpackPlugin()
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, '../src'),
      'node_modules'
    ],
    alias: {
      styles: path.resolve(__dirname, '../src/styles/'),
      assets: path.resolve(__dirname, '../src/assets/'),
      utils: path.resolve(__dirname, '../src/utils/')
    },
    extensions: [
      '.js', '.json', '.jsx', '.css', '.scss'
    ]
  }
}
// 先定义再导出方便更改配置
module.exports = config