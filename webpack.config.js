const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js', //入口文件
  output: {  // 出口定义
    path: path.resolve(__dirname, 'dist'), // 输出文件的目标路径
    filename: '[name].js' // 文件名[name].js默认
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/, // 不匹配选项（优先级高于test和include)
        use: 'babel-loader'
      }
  ]},
  plugins: [  // 插进的引用, 压缩，分离美化
    new webpack.HotModuleReplacementPlugin(),// Hot Module Replacement 的插件 避免手动刷新
    new webpack.NamedModulesPlugin(),// 用于启动 HMR 时可以显示模块的相对路径
    new HtmlWebpackPlugin({  // 将模板html的头部和尾部添加css和js模板
      file: 'index.html', // 输出文件的文件名称，默认为index.html
      template: './index.html'
    }),
  ]
}