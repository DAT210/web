const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var del = require('del');

// del([
//     'dist/**/*'
// ])

module.exports = {
    entry: './src/js/app.js',
    output: {
      path: __dirname + '/dist',
      filename: 'bundle.js'
    },
    // plugins: [
    //     new HtmlWebpackPlugin({
    //     template: 'src/index.html'
    //     })
    // ],
    module: {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: [  {
                    loader: 'css-loader',
                    options: {
                       importLoaders: 1
                      }
                    }
                    // ,'postcss-loader'
                ]
              })     
          },
          {
            test: /\.(png|jp(e*)g|svg)$/,  
            use: [{
                loader: 'url-loader',
                options: { 
                    limit: 8000, // Convert images < 8kb to base64 strings
                    name: 'images/[hash]-[name].[ext]'
                } 
            },
            {
              loader: "img-loader"
            }]
        },  
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        },
        {
            test: /\.html$/,
            use: [{ loader: "html-loader", options: { minimize: false } }]
          }
        ]
      },
      plugins: [
        // new UglifyJSPlugin(),
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
                template: 'src/index.html'
                })
      ],

  }