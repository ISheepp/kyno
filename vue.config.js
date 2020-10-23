// 配置代理对象 实现端口转发
let proxyObj = {};
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8081',
    changeOrigin:true,
    pathRewrite:{
        '^/' : ''  // 拦截到的地址不去修改
    }
};

module.exports={
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
}
