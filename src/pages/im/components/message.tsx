import { Avatar } from 'react-daisyui';
import HtmlApp from 'src/components/HtmlApp';
import { MessageType } from 'src/core/message';
import { SendingStatus } from 'src/core/chat_message';
import xss from 'xss';
import AudioApp from 'src/components/AudioApp';
import { Spin } from '@arco-design/web-react';
import { IconInfoCircle } from '@arco-design/web-react/icon';
import '../styles/message.scss';

function Message(props) {
    const messageAlign = props.message.IsMe ? 'flex-row-reverse to' : 'flex-row form';
    const MessageHtml = ({ message }) => {
        if (message.Type === MessageType.Image) {
            return <img src={message.Content} alt="2" />;
        }
        if (message.Type === MessageType.Audio) {
            return <AudioApp src={message.Content} />;

            // <audio className="mr-2" style={{ height: 36, width: 240 }} src={message.Content} controls />;
        }

        return (
            <div className="room-content-wrapper-item-message break-words">
                <HtmlApp html={xss(props.message.Content)} className="message-item" />
            </div>
        );
    };

    const MessageStatus = ({ sending }) => {
        return <></>;
        if (sending === SendingStatus.Sending) {
            return <Spin />;
        }

        if (sending === SendingStatus.Sent) {
            return <></>;
        }

        if (sending === SendingStatus.Failed) {
            return <IconInfoCircle style={{ color: 'red', marginRight: 2 }} />;
        }

        return <></>;
    };

    return (
        <div className={`flex ${messageAlign} room-content-wrapper-item`}>
            <div className=" room-content-wrapper-item-avatar">
                <Avatar shape={'circle'} size={'xs'} />
            </div>
            {<MessageHtml message={props.message} />}
            <MessageStatus sending={props.message.Sending} />
        </div>
    );
}

export default Message;
