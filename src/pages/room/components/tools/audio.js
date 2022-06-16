import { Button } from 'react-daisyui';
import { Button as Abutton } from '@arco-design/web-react';

import { useState, useRef, useEffect } from 'react';
import { ReactComponent as AudioSvg } from 'src/static/svg/audio.svg';
import { ReactComponent as AudioRecordSvg } from 'src/static/svg/audio-record.svg';
import { uploadFile } from 'src/services/upload';

const Audio = ({ audio, sendChatMessage }) => {
    const [sendAudio, setSendAudio] = useState({
        loading: false,
        src: '',
    });

    const send = async audio => {
        setSendAudio({ loading: true, src: '' });
        const { data } = await uploadFile(audio.blob, `${new Date().getTime()}.mp3`);
        setSendAudio({ loading: false, src: data.data.url });
        sendChatMessage(JSON.stringify({ url: data.data.url, duration: audio.duration }));
    };

    return (
        <div className="flex items-center justify-between w-full ml-5">
            <audio className="mr-2" style={{ height: 36, width: 240 }} src={audio.stream} controls />
            <Abutton
                className="w-full"
                type="text"
                loading={sendAudio.loading}
                onClick={() => {
                    send(audio);
                }}
            >
                发送
            </Abutton>
        </div>
    );
};

const AudioRecord = ({ sendChatMessage }) => {
    const [state, setState] = useState('waiting');
    const chunks = useRef([]);
    const recorder = useRef(null);
    const start_int = useRef(0);
    const streamEq = useRef(null);
    const audio = useRef({ duration: 0, stream: '', blob: '' });

    const start = () => {
        recorder.current.start();
        start_int.current = new Date().getTime();
        audio.current = { duration: 0, stream: '', blob: '' };
        setState('recording');
    };

    const stop = () => {
        setState(state => {
            if (recorder.current.state === 'recording') {
                recorder.current.stop();
            }
            streamEq.current.getTracks().forEach(function (track) {
                track.stop();
            });
            return 'waiting';
        });
    };

    const send = async audio => {
        const { data } = await uploadFile(audio.blob, `${new Date().getTime()}.mp3`);
        sendChatMessage(JSON.stringify({ url: data.data.url, duration: audio.duration }));
    };

    useEffect(() => {
        console.log(233);
        initRecord();

        return () => {
            return stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initRecord = () => {
        const recorderSave = () => {
            let blob = new Blob(chunks.current, { type: 'audio/ogg; codecs=opus' }),
                audioStream = URL.createObjectURL(blob),
                //估算时长
                duration = parseInt((new Date().getTime() - start_int.current) / 1000);
            if (duration <= 0) {
                alert('说话时间太短');
                return;
            }
            audio.current = { duration: duration, stream: audioStream, blob: blob };
            send(audio.current);
            chunks.current = [];
        };

        const recorderData = e => {
            chunks.current.push(e.data);
        };

        navigator.mediaDevices.getUserMedia({ audio: true }).then(
            stream => {
                recorder.current = new window.MediaRecorder(stream);
                recorder.current.ondataavailable = recorderData;
                recorder.current.onstop = recorderSave;
                streamEq.current = stream;
            },
            error => {
                alert('出错，请确保已允许浏览器获取录音权限');
            }
        );
    };
    return (
        <div className="flex w-full">
            <Button className="w-full" onMouseUp={stop} onTouchEnd={stop} onTouchStart={start} onMouseDown={start}>
                {state === 'waiting' ? (
                    <>
                        <AudioSvg />
                        <span className="ml-2">长按开始录制</span>
                    </>
                ) : (
                    <>
                        <AudioRecordSvg />
                        <span className="ml-2">松开暂停</span>
                    </>
                )}
            </Button>

            {/* {audio.stream ? <Audio audio={audio} sendChatMessage={sendChatMessage} /> : null} */}
        </div>
    );
};

export default AudioRecord;