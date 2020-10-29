// 将后端获取到的菜单对象中的component字符串转为对象
import {getRequest} from "@/utils/api";

export const initMenu=(router, store)=>{
    // 用户的正常跳转（非F5刷新）
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest("/system/config/menu").then(data => {
        if (data) {
            let fmtRoutes = formatRoutes(data);
            router.addRoutes(fmtRoutes);
            store.commit("initRoutes", fmtRoutes) // 都是格式化之后的fmtRoutes
        }
    });
}

export const formatRoutes = (routes) => {
    let fmRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router; // 批量定义，相当于let path = router.path;let component = router.component
        // 假如有children且是一级菜单的children
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children,
            // 动态加载component
            // TODO 收藏夹有
            component(resolve) {
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve);
                }else if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                }else if (component.startsWith("Per")) {
                    require(['../views/per/' + component + '.vue'], resolve);
                }else if (component.startsWith("Sal")) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                }else if (component.startsWith("Sta")) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                }else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }

            }
        }
        fmRoutes.push(fmRouter);
    });
    return fmRoutes;
};
