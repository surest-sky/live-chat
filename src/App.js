import { Modal, Message } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userAuthApi, userInfoApi } from 'src/api/im/im';
import { getAuthInfo } from 'src/services/auth';
import Routers from './routers/index';
import store from 'src/store/index';
import { updateAuthInfo, updateUserInfo } from 'src/store/reducer/container';
import Loading from 'src/components/Loading'
import './static/main.scss';

function App() {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const reLogin = () => {
        setLoading(false)
        Message.error("请重新登录 !")
        navigate('/auth');
    }

    const fetchUserInfo = async (authInfo) => {
        const { data } = await userInfoApi({ Uid: [authInfo.Uid] });
        console.log('authInfo2', authInfo.Uid);
        console.log('data', data.Data[0]);
        store.dispatch(updateUserInfo(data.Data[0]));
    };

    function fetchUserAuth() {
        const userInfo = getAuthInfo()
        if (!userInfo.Token) {
            reLogin()
            return
        }
        setLoading(true);
        userAuthApi({ Token: userInfo.Token }).then(res => {
            const data = res.data.Data
            store.dispatch(updateAuthInfo(data));
            console.log("res", res.data.Data)
            fetchUserInfo(data)
        }).catch(err => {
            console.log(err)
            reLogin()
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        if (pathname.replace(/\//g, '') === 'auth') {
            setLoading(false)
            return
        }
        fetchUserAuth()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="app">
            <Modal className="room-modal" closeIcon={null} footer={null} visible={true} autoFocus={false} focusLock={true}>
                {loading ? <Loading text={'启动中'} /> : <Routers />}
            </Modal>

        </div>
    );
}

export default App;
