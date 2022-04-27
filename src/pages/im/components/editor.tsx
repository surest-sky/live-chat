import { useState, useEffect } from 'react';
import { Button, Textarea } from 'react-daisyui';
import { getMessageLen } from '../../../utils/Utils';
import '../styles/editor.scss';

const Editor = ({ session }) => {
    const [message, setMessage] = useState<string>('');
    const [multiline, setMultiline] = useState<boolean>(false);
    const [sendLoading, setSendLoading] = useState<boolean>(false);

    /**
     * 消息发送
     * @param message
     */
    const sendMessage = (message: string) => {
        // setSendLoading(true);
        session?.sendTextMessage(message).subscribe({
            next: m => {
                console.log('send message: message status changed=>', m);
            },
            error: error => {
                console.log(false);
            },
            complete: () => {
                // setSendLoading(false);
            },
        });
    };

    const _sendMessage = () => {
        sendMessage(message);
        setMessage('');
    };

    useEffect(() => {
        if (getMessageLen(message) > 100 || message.indexOf('\n') > -1) {
            setMultiline(true);
        } else {
            setMultiline(false);
        }
    }, [message]);

    return (
        <div className="room-message-editor flex justify-between  items-end">
            <Textarea rows={multiline ? 2 : 1} color={'primary'} bordered={true} value={message} onChange={({ target: { value } }) => setMessage(value)} borderOffset={false} className="editor-item w-full"></Textarea>
            <Button disabled={!message.length} className="ml-2" onClick={_sendMessage} loading={sendLoading}>
                发送
            </Button>
        </div>
    );
};

export default Editor;
