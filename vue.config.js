const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {  
      proxy: {
        '/blogApi': {
        target: 'http://localhost:8081', //访问地址
        changeOrigin: true,
        // secure: false, //只有代理https 地址需要次选项
        pathRewrite: {
            '^/blogApi': ''
            }
          }
        },
  },
  // 修改标题
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "rnfblog";
      return args;
    });
  },
})

