

import lodash from 'lodash';
import { addBlukContacts, getContacts } from 'src/services/chat_db';
import { uploadFile } from 'src/services/upload';

// 给联系人添加一条消息
export const addContactUserMessage = async (message) => {
    const contacts = await getContacts()
    console.log(message)
    const _contacts = contacts.map(item => {
        console.log(item.uid.toString() === message.from || item.uid.toString() === message.to)
        if (message.from === item.uid.toString()) {
            item.lastMessage = message
        }
        if (message.to === item.uid.toString()) {
            item.lastMessage = message
        }
        return item;
    });
    addBlukContacts(_contacts)
}

/**
 * 粘贴板图片处理
 * @param {*} event
 * @returns
 */
export const pasteImage = (event): string => {
    let file,
        items = event.clipboardData.items;
    if (!items) {
        return Promise.resolve(false);
    }

    // 检测剪贴板是否包含图片
    if (items && items.length) {
        const type = lodash.get(items, '[0].type');
        if (type !== -1) {
            file = lodash.get(items, '0').getAsFile();
            if (!file) {
                return Promise.resolve(false);
            }
        }
    }

    let base64,
        reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = async function (e) {
            base64 = e.target.result;
            resolve(base64);
        };
        reader.readAsDataURL(file);
    });
};

/** 上传 Base64 图片 */
export const uploadBase64File = async base64 => {
    var arr = base64.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    const base64File = new Blob([u8arr], { type: mime });
    const rand = new Date().getTime()
    const url = await uploadFile(base64File, `${rand}.png`);
    return Promise.resolve(url);
};
