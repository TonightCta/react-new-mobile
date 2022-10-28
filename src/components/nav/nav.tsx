
import { ReactElement, ReactNode, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss'
import { IBPayMobile } from '../../route/router';


interface Tab {
    key: string,
    title: string,
    icon: ReactNode
}

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
    const tabs: Tab[] = !!admin ? [
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
    const switchRoute = (_url: string) => {
        switch (_url) {
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
    }
    return (
        <div className='nav-bottom'>
            <p></p>
            <ul>
                {
                    tabs.map((item: Tab, index: number): ReactElement => {
                        return (
                            <li key={index} className={`${activeRouter === item.key ? 'active-nav' : ''}`} onClick={() => {
                                switchRoute(item.key)
                            }}>
                                <p>
                                    {item.title}
                                </p>
                                <p className='active-mask'></p>
                            </li>
                        )
                    })
                }
            </ul>
            <div className='login-out' onClick={() => {
                localStorage.clear();
                navigate('/login')
            }}>
                <p className='iconfont icon-tuichu-6'></p>
            </div>
        </div>
    )
};

export default NavBottom;