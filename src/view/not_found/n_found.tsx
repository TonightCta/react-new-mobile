
import { LeftOutline } from 'antd-mobile-icons';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss'

const NotFound = (): React.ReactElement<ReactNode> => {
    const navigate = useNavigate();
    return (
        <div className='not-found'>
            <p onClick={() => {
                navigate('/')
            }} className="back-btn">
                <LeftOutline />
            </p>
            <img src={require('../../assets/images/not_found.png')} alt="" />
            <p className='not-remark'>哎呦～页面出错了</p>
        </div>
    )
};

export default NotFound;