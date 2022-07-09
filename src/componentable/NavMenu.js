import {ref} from "vue";

const NavMenu = ref({
    menuStyle: {
        backgroundColor: "#545c64",
        textColor: "#fff",
        activeTextColor: "#ffd04b",
        defaultActiveMenu: "2",
        mode: "horizontal",
        class: "el-menu-demo"
    }, menus: [{
        id: '1',
        span: 2,
        messageMenu: '图标',
        index: '',
        disabled: false,
        countOffset: false,
        subMenu: false,
        children: null
    }, {
        id: '2',
        span: 2,
        messageMenu: '首页',
        index: 'home',
        disabled: false,
        countOffset: false,
        subMenu: false,
        children: null
    }, {
        id: '3',
        span: 6,
        messageMenu: '搜索问题',
        index: '',
        disabled: false,
        countOffset: false,
        subMenu: false,
        children: null
    }, {
        id: '4',
        span: 2,
        messageMenu: '发表问题',
        index: 'publish',
        disabled: false,
        countOffset: true,
        subMenu: false,
        children: null
    }, {
        id: '5', span: 2, messageMenu: null, index: '', disabled: false, countOffset: false, subMenu: true, children: [{
            id: '1', messageMenu: '个人中心', index: 'user', disabled: false,
        }, {
            id: '2', messageMenu: '消息', index: 'user/userMsg', disabled: false,
        }, {
            id: '3', messageMenu: '退出', index: 'quit', disabled: false,
        }]
    }]
})

const selectMenu = (url, router, route) => {
    if (url !== '' && url !== 'user/userMsg') {
        router.push({name: url})
    } else {
        router.push({path: '/user/userMsg'})
    }
}

const countOffsetUtil = (id, menus, flag) => {
    let ret = 0;
    if (flag) {
        let count = 0;
        for (let i = 0; i < id; i++) {
            count += menus[i].span;
        }
        ret = 24 - count - menus[id].span;
    }
    return ret;
}

export {
    selectMenu, NavMenu, countOffsetUtil
}