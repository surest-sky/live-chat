import { useEffect, useRef, useState } from 'react';
import { Image } from '@arco-design/web-react';
import { delay } from 'rxjs';
import { ChatMessage } from 'src/core/chat_message';
import { MessageType } from 'src/core/message';
import { LiveChat } from 'src/core/live_chat';
import { Session } from 'src/core/session';
import Editor from './components/editor';
import Message from './components/message';
import { Avatar } from 'react-daisyui';
import { initChat } from './store/chat';
import Tools from './components/tools';
import dayjs from 'dayjs';
import { scrollToBottom } from 'src/utils/Utils';

const Room = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const editorRef = useRef<any>(null);
    const [imageVisible, setVisible] = useState<any>({
        visible: false,
        src: '',
    });

    useEffect(() => {
        session?.setMessageListener(message => {
            setMessages(messages => [...messages, message]);
            setTimeout(() => {
                scrollToBottom('.room-content');
            }, 100);
        });
        return () => session?.setMessageListener(null);
    }, [session]);

    const started = () => {
        // 获取或初始化聊天会话
        LiveChat.getInstance()
            .getOrInitSession()
            .pipe(delay(1000))
            .subscribe({
                next: se => {
                    setSession(se);
                    setMessages(se.getMessages());
                    setLoading(false);
                },
                error: error => {
                    console.log(error);
                },
                complete: () => {},
            });
    };

    useEffect(() => {
        initChat(started);

        $('body').on('click', 'img', (element: any) => {
            const src = element.target.getAttribute('src');
            setVisible({ visible: true, src: src });
        });
    }, []);

    const dateLine = (at, key) => {
        const dateDayjs = dayjs(at * 1000);
        const _date = dateDayjs.format('YYYY-MM-DD HH:mm:ss');
        // format('YYYY-MM-DD HH:mm:ss');
        // console.log('key', key);
        if (key === 0) {
            return _date;
        }

        let lastAt = dayjs(messages[key - 1].SendAt * 1000);
        if (dateDayjs.diff(lastAt, 'minute') > 1) {
            return _date;
        }

        const fl: any = key / 5;
        if (fl % 1 === 0) {
            return _date;
        }

        // let lastAt;
        // if (key > 5) {
        //     const fl: any = key / 5;
        //     lastAt = dayjs(messages[key - 4 * parseInt(fl)].SendAt * 1000);
        //     console.log(lastAt.diff(dateDayjs, 'minute'));
        //     if (lastAt.diff(dateDayjs, 'minute') <= -1) {
        //         return _date;
        //     }
        // }

        // console.log(messages[key - 1]);
        // // 当前 message 与 上一条 message 大于 5分钟则显示
        // lastAt = dayjs(messages[key - 1].SendAt * 1000);
        // console.log("lastAt.diff(dateDayjs, 'minutes')", lastAt.diff(dateDayjs, 'minute'));
        // if (lastAt.diff(dateDayjs, 'minute') > 1) {
        //     return _date;
        // }
        return false;
    };

    const sendFileMessage = (message: string, type: MessageType, callback: any) => {
        session.send(message, type).subscribe({
            next: m => {
                console.log('send message: message status changed=>', m);
            },
            error: error => {
                callback && callback();
            },
            complete: () => {
                callback && callback();
            },
        });
    };

    const MsgList = messages.map((message, key) => {
        const _dateline = dateLine(message.SendAt, key);
        return (
            <div>
                {_dateline ? <div className="text-center text-gray-500 text-xs mb-5 mt-5">{_dateline}</div> : <></>}
                <Message setVisible={setVisible} key={message.SendAt} message={message} />
            </div>
        );
    });

    let content: any;
    if (loading) {
        content = <div className="font-bold text-center room-content-title">连接中...</div>;
    } else {
        content = (
            <>
                <div className="font-bold text-center room-content-title flex justify-between">
                    <div className="flex items-center">
                        <Avatar shape={'circle'} size={'xs'} className="title-avatar mr-2" />
                        <span className=" title-name">锋</span>
                    </div>
                    <div className="flower">
                        <Tools sendFileMessage={sendFileMessage} />
                    </div>
                </div>
                {/* <div className="room-body flex justify-between"> */}
                <div className="room-body">
                    {/* <div className="contacts">
                        <div className="contact">

                        </div>
                    </div> */}
                    <div className="chat-body">
                        <div className="room-content scrollbar">
                            <div className="room-content-wrapper">{MsgList}</div>
                        </div>
                        <Editor editorRef={editorRef} sendFileMessage={sendFileMessage} />
                    </div>
                </div>

                <Image.Preview
                    src={imageVisible.src}
                    visible={imageVisible.visible}
                    onVisibleChange={() => {
                        setVisible({ visible: false, src: '' });
                    }}
                />
            </>
        );
    }

    return <div className="room">{content}</div>;
};

export default Room;
