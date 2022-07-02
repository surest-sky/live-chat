import { Modal, Message } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { userAuthApi, userInfoApi } from 'src/api/im/im';
import { getAuthInfo } from 'src/services/auth';
import store from 'src/store/index';
import { updateAuthInfo, updateUserInfo } from 'src/store/reducer/container';
import Loading from 'src/components/Loading'
import { initChatSession } from 'src/core/services'
import '../../static/main.scss';

const Layout = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const reLogin = () => {
        setLoading(false)
        Message.error("请登录 !")
        navigate('/auth');
    }

    const fetchUserInfo = async (authInfo) => {
        const { data } = await userInfoApi({ Uid: [authInfo.Uid] });
        store.dispatch(updateUserInfo(data.Data[0]));
        initChatSession(() => { setLoading(false) })
    };

    function fetchUserAuth() {
        const userInfo = getAuthInfo()
        if (!userInfo || !userInfo.Token) {
            reLogin()
            return
        }
        setLoading(true);
        userAuthApi({ Token: userInfo.Token }).then(res => {
            const data = res.data.Data
            if (!data) {
                reLogin()
            }
            store.dispatch(updateAuthInfo(data));
            fetchUserInfo(data)
        }).catch(err => {
            reLogin()
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
        <div class="layout-container">
            <Modal className="room-modal" closeIcon={null} footer={null} visible={true} autoFocus={false} focusLock={true}>
                {loading ? <Loading text={'启动中'} /> : <Outlet />}
            </Modal>
        </div>
    );
};

export default Layout;