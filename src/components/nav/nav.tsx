
import { ReactElement, ReactNode, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TabBar } from 'antd-mobile'
import './index.scss'
import { IBPayMobile } from '../../route/router';

const NavBottom = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = useContext(IBPayMobile);
    const admin = JSON.parse(state.account || '{}')?.merchantInfo.is_admin;
    const [activeRouter, setActiveRouter] = useState<string>('home')
    useEffect(() => {
        const { pathname } = location;
        switch (pathname) {
            case '/':
                setActiveRouter('home')
                break;
            case '/fee':
                setActiveRouter('fee');
                break;
            case '/merchant':
                setActiveRouter('todo');
                break;
            default:
                setActiveRouter('home')
        }
    }, [])
    const tabs = !!admin ? [
        {
            key: 'home',
            title: '概览',
            icon: <span className='iconfont icon-a-bianzu71'></span>,
        },
        {
            key: 'fee',
            title: '利润/余额',
            icon: <span className='iconfont icon-a-bianzu7'></span>,
        },
        {
            key: 'todo',
            title: '商家',
            icon: <span className='iconfont icon-merchant'></span>,
        }
    ] : [
        {
            key: 'home',
            title: '概览',
            icon: <span className='iconfont icon-a-bianzu71'></span>,
        },
        {
            key: 'todo',
            title: '商家',
            icon: <span className='iconfont icon-merchant'></span>,
        }
    ];
    return (
        <div className='nav-bottom'>
            <TabBar onChange={(e) => {
                switch (e) {
                    case 'home':
                        navigate('/');
                        setActiveRouter('home')
                        break;
                    case 'fee':
                        navigate('/fee');
                        setActiveRouter('fee')
                        break;
                    case 'todo':
                        navigate('/merchant');
                        setActiveRouter('todo');
                        break;
                    default:
                        setActiveRouter('home')
                        navigate('/')
                }
            }} activeKey={activeRouter}>
                {
                    tabs.map((item): ReactElement => {
                        return (
                            <TabBar.Item key={item.key} icon={item.icon} title={item.title}></TabBar.Item>
                        )
                    })
                }
            </TabBar>
        </div>
    )
};

export default NavBottom;