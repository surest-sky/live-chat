## 设计参考

[https://mastergo.com/file/59306269718477](https://mastergo.com/file/59306269718477)

## 效果展示

![效果展示](https://cdn.surest.cn/images/Snipaste_2022-04-25_23-15-38.png)

## 迭代计划

每项后面附带版本号处理时间

-   发送消息即刻滚动到底部 1.0 ✅
-   加入发送时间 1.0 ✅
-   支持历史消息记录查看 1.0
-   支持 img 发送 1.0 ✅ [目前是 base64]
-   支持 语音发送 1.0
-   【兼容 发送进度条 - 真实为上传网络进度条 1.5
-   兼容 上传失败模式 ui 展示 1.0
-   兼容重新发送模式【暂定为 base64 显示】 1.5
-   支持大批量文本自动转 txt 发送 1.0 【超过 600 个字符】参考 钉钉 1.0
-   支持 图片 和 文字同时发送 1.5
-   支持图片发送可预览 1.0 ✅
-   支持可引用模式 - 抄微信 2.0
-   支持视频通话 【方案待定】3.0
-   支持语音通话 【我想把这个语音通话的快速做上去 - 打游戏的时候试试】
-   支持后台快速查看 聊天 1.0
-   兼容 H5 版本 【可能需要不同的 UI 调整】 1.0 ✅
-   支持 基础表情发送 1.0
-   支持输入框可粘贴图片 1.0 ✅

## 启动

    yarn
    cp .env.development.example .env.development
    yarn start

    ------------------------------------------------

    yarn build

## Bug 列表

-   error 发送问题【全局搜：发送失败，好像发送成功了 - /src/pages/im/components/editor.tsx】
