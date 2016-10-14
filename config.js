var Config = {
    site: {
        title: '仿WeChat聊天',
        description: 'SocketIO',
        version: '1.0',
        pagesize: 6,
        ONLINE: "0",
        OFFLINE: "1"
    },
    db: {
        cookieSecret: 'weChatApp',
        name: 'chat',
        host: 'localhost',
        url: 'mongodb://127.0.0.1:27017/chat'
    }
};
module.exports = Config;