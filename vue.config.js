const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {  
      proxy: {
        '/blogApi': {
			target: 'https://117.72.163.99:8880', //访问地址
			changeOrigin: true,
			// secure: false, //只有代理https 地址需要次选项
			pathRewrite: {
				'^/blogApi': ''
				}
        },
		// 给 ipCount 再配一条纯 http 代理
		'/openresty': {
	     	target: 'http://www.fyupeng.cn:9999', // ← 你的统计接口
			changeOrigin: true,
			pathRewrite: { '^/openresty': '' }
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

