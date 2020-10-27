// 封装网络请求
import axios from 'axios'
import {Message} from "element-ui";
import da from "element-ui/src/locale/lang/da";

axios.interceptors.response.use(success=>{
    // 相当于ajax的success回调
    // success.status==200是http的响应码，success.data.status是后端传回的json字符串的响应码
    if (success.status && success.status == 200 && success.data.status == 500) {
        // 返回业务上的错误
        Message.error({message:success.data.msg})
        return;
    }
    if (success.data.msg) {
        Message.success({message: success.data.msg})
    }

    return success.data;
}, error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({message:"服务器被吃了！！！"})
    }else if (error.response.status == 403) {
        Message.error({message: "权限不足，请联系管理员"});
    }else if (error.response.status == 401) {
        Message.error({message: "尚未登陆，请登录"});
    } else {
        if (error.response.data.msg) {
            Message.error({message: error.response.data.msg});
        } else {
            Message.error({message: "未知错误！"})
        }
    }
    return;
});

// 定义一个前缀
let base = '';
// spring security默认不支持json传值，默认为kv格式
export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&';
            }

            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

// 传递json的post方法
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    });
};

// 传递json的put方法
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    });
};

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    });
};

export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    });
};
