
import { ReactElement, ReactNode } from 'react';
import './index.scss'
import { useEffect, useContext } from 'react';
import { IBPayMobile } from '../../../route/router';
import { useNavigate } from 'react-router-dom';
import { LeftOutline } from 'antd-mobile-icons';
import { ListInter } from '../components/list'
import copy from 'copy-to-clipboard'
import { Toast } from 'antd-mobile';


const MarketDetail = (): ReactElement<ReactNode> => {
    const { state } = useContext(IBPayMobile);
    const navigate = useNavigate();
    const detail: ListInter = JSON.parse(state.market || '{}');
    useEffect(() => {
        console.log(state.market);
    }, [])
    return (
        <div className='market-detail'>
            <div className='detail-title'>
                <span onClick={() => {
                    navigate('/')
                }}><LeftOutline /></span>
                Contest Details
            </div>
            <div className='detail-content'>
                <div className='top-icon-number'>
                    <img src={detail.from_icon} alt="" />
                    <div>
                        <p>Contest Numbering:</p>
                        <p>{detail.number}</p>
                        <p className='iconfont icon-a-fuzhibeifen2' onClick={() => {
                            copy(String(detail.number));
                            Toast.show('复制成功')
                        }}></p>
                    </div>
                    <img src={detail.to_icon} alt="" />
                </div>
                <div className='bottom-count'>
                    <div className='count-public'>
                        <p className='text-overflow'>{detail.from}</p>
                        <p>{detail.from_count}</p>
                    </div>
                    <div className='date-public'>
                        <p>{detail.date.substring(6, 11)}</p>
                        <p>{detail.date.substring(11, 17)}</p>
                    </div>
                    <div className='count-public'>
                        <p className='text-overflow'>{detail.to}</p>
                        <p>{detail.to_count}</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MarketDetail;