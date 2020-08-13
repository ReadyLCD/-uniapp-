// 封装request请求的函数，主要是为了优化数据的请求
// 公共基准地址
const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
const request = (config) => {
    // 开启加载中
    uni.showLoading({
        title: '加载中',
        msg: true
    })
    return new Promise((resolve, reject) => {
        uni.request({
            ...config,
            url: baseUrl + config.url,
            success: (res) => {
                console.log(res);
                if (res.data.meta.status == 200 && res.statusCode == 200) {
                    resolve(res.data.message);
                }
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                console.log(123);
                uni.hideLoading();
            }
        })
    })
}

// 导出去
export default {
    request
}