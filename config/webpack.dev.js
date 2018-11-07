const path = require("path");
const uglify = require("uglifyjs-webpack-plugin"); //js压缩插件
const htmlPlugin = require("html-webpack-plugin"); //htm打包插件
const extractTextPlugin = require("extract-text-webpack-plugin"); //css分离插件
// var autoprefixer = require('autoprefixer');
var website = {
    //处理静态文件路径
    publicPath: "http://localhost:8888"
}
module.exports = {
    mode: 'development',
    //入口文件配置
    entry: {

        main: './src/main.js',
        main1: './src/main1.js'
    },
    //出口文件配置
    output: {
        //打包的路径
        path: path.resolve(__dirname, '../dist'),
        //打包的文件名
        filename: '[name].js', //[name]告诉我们入口进入什么名字，出来就是什么名字
        publicPath: website.publicPath
    },
    module: {
        //存放模块
        rules: [
            //css loader
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: "css-loader"
                        },
                        // {
                        //     loader: "postcss-loader"
                        // }
                    ]
                })
                //css分离后需要重新配置，下面注释掉
                // use:[
                //     {loader:"style-loader"},
                //     {loader:"css-loader"}
                // ]
            },
            //图片loader
            {
                test: /\.(png|jpg|gif|jpeg)/, //匹配图片后缀
                use: [{
                    loader: 'url-loader', //指定使用的loader和参数
                    options: {
                        limit: 500 //把小于500b的文件打成base64格式，写入js
                    }
                }]
            },
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            },
            { //sass打包
                //需要将sass文件引到main.js中
                test: /\.scss$/,
                use: [{
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            { //sass分离

                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                            loader: "css-loader"
                        },
                        {
                            loader: "sass-loader"
                        }
                    ],

                    fallback: "style-loader"
                })
            },
         

        ],
        plugins: [
            //插件，用于生产模块和各种功能
            new uglify(), //js压缩插件
            new htmlPlugin({
                minify: {
                    //html压缩
                    removeAttributeQuotes: true //removeAttrubuteQuotes是却掉属性的双引号。

                },
                hash: true, //为了开发中js有缓存效果，所以加入hash，可哟避免缓存js
                template: './src/index.html' // 打包的html模板路径和名称
            }),
            new extractTextPlugin("css/index.css") //css分离路径
        ],
        devServer: {
            //配置webpack开发服务
            //设置基本目录
            contentBase: path.resolve(__dirname, '../dist'),
            //服务的ip地址，可以使用ip也可以使用localhost
            host: 'localhost',
            //服务端压缩是否开启
            compress: true,
            //配置服务端口号
            port: 8888
        }
    },
   
}