
import { Dialog, DotLoading, InfiniteScroll, List, PullToRefresh, Toast } from 'antd-mobile';
import { CloseOutline, RightOutline } from 'antd-mobile-icons';
import { PullStatus } from 'antd-mobile/es/components/pull-to-refresh';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { IBPayMobile } from '../../../route/router';
import { ButtlistApi, OrderListApi } from '../../../request/api';
import copy from 'copy-to-clipboard';
import { SetLogo } from '../../../utils';
import { useRef } from 'react';

interface Deposit {
    icon: string,
    coin: string,
    created_at: string,
    to: string,
    amount: number,
    from_before_balance: number,
    logo: string,
    id: string,
    link: string,
    mch_name: string,
    type: number | string,
    from: string,
    mch_balance: string
}

const statusRecord: Record<PullStatus, ReactElement | string> = {
    pulling: '用力拉',
    canRelease: '松开吧',
    refreshing: <DotLoading color='primary' />,
    complete: '好啦',
}
const FeeList = (): ReactElement<ReactNode> => {
    const { state } = useContext(IBPayMobile);
    const [detailBox, setDetailBox] = useState<boolean>(false);
    //是否还有更多数据
    const [hasMore, setHasMore] = useState<boolean>(true);
    useEffect(() => {
        listDataService(1)
    }, [state.filter_fee]);
    //页码
    const [page, setPage] = useState<number>(0);
    //数据列表
    const [list, setList] = useState<Deposit[]>([]);
    const listDataService = async (_page?: number) => {
        const { filter_fee } = state;
        const filter = JSON.parse(filter_fee || '{}');
        const params = {
            start: filter.start ? new Date(filter.start).getTime() : '',
            end: filter.end ? new Date(filter.end).getTime() : '',
            type: filter.status ? filter.status : '',
            mch_id: filter.merchant ? filter.merchant : '',
            coin: filter.coin ? filter.coin : '',
            limit: 10,
            page: _page ? _page : page
        };
        const result = await ButtlistApi(params);
        const { data } = result;
        const listWithLogo = SetLogo(data.list);
        if (data.current_page === data.last_page) {
            setHasMore(false)
        } else {
            setHasMore(true)
        }
        if (data.current_page === 1) {
            setList([...listWithLogo]);
        } else {
            setList([...list, ...listWithLogo]);
        };
        return result
    };
    const loadMore = async () => {
        setPage(page + 1)
        page !== 1 && await listDataService();
    };
    const detailMsg = useRef<Deposit>({
        icon: '',
        coin: '',
        created_at: '',
        to: '',
        amount: 0,
        from_before_balance: 0,
        logo: '',
        id: '',
        link: '',
        mch_name: '',
        type: '',
        from: '',
        mch_balance: ''
    })
    const DetailContent = (): ReactElement => {
        return (
            <div className='detail-content'>
                <span className='close-icon' onClick={() => {
                    setDetailBox(false)
                }}>
                    <CloseOutline />
                </span>
                <div className='coin-msg'>
                    <img src={detailMsg.current.logo} alt="" />
                    <div className='name-msg'>
                        <p className='coin-name'>
                            {detailMsg.current.mch_name}
                            <span className='coin'>{detailMsg.current.coin}</span>
                            <span className={`${detailMsg.current.type == 1 ? 'in' : 'out'}`}>{detailMsg.current.type == 1 ? '利润结算' : '余额提取'}</span>
                        </p>
                        <p className='order-date'>{detailMsg.current.created_at}</p>
                    </div>
                </div>
                <ul>
                    <li>
                        <p>操作时间</p>
                        <p>{detailMsg.current.created_at}</p>
                        <p></p>
                    </li>
                    <li>
                        <p>转出地址</p>
                        <p>{detailMsg.current.from}</p>
                        <p className='iconfont icon-a-fuzhi2' onClick={() => {
                            copy(detailMsg.current.from);
                            Toast.show('复制成功')
                        }}></p>
                    </li>
                    <li>
                        <p>目标地址</p>
                        <p>{detailMsg.current.to}</p>
                        <p className='iconfont icon-a-fuzhi2' onClick={() => {
                            copy(detailMsg.current.to);
                            Toast.show('复制成功')
                        }}></p>
                    </li>
                    <li>
                        <p>处理前链上余额</p>
                        <p className=''>{detailMsg.current.from_before_balance}</p>
                    </li>
                    <li>
                        <p>处理前后台余额</p>
                        <p className=''>{detailMsg.current.mch_balance}</p>
                    </li>
                    <li>
                        <p>转出数量</p>
                        <p className='strong-text'>{detailMsg.current.amount}</p>
                    </li>
                </ul>
                <div className='view-outside'>
                    <button color='primary' onClick={() => {
                        window.open(detailMsg.current.link)
                    }}>查看HASH</button>
                </div>
            </div>
        )
    };
    return (
        <div className='deposit-list list-public' >
            <PullToRefresh
                onRefresh={async () => {
                    await sleep(1000)
                    listDataService();
                }}
                renderText={status => {
                    return <div style={{ fontSize: '14px' }}>{statusRecord[status]}</div>
                }}
            >
                <List>
                    <ul>
                        {
                            list.map((item: Deposit, index: number): ReactElement => {
                                return (
                                    <li key={index} onClick={() => {
                                        setDetailBox(true);
                                        detailMsg.current = item;
                                    }}>
                                        <div className='coin-msg'>
                                            <div className='img-text'>
                                                <img src={item.logo} alt="" />
                                                <div className='msg-text'>
                                                    <p>
                                                        {item.mch_name}
                                                        <span>{item.coin}</span>
                                                        <span className={`${item.type == 1 ? 'in' : 'out'}`}>{item.type == 1 ? '利润结算' : '余额提取'}</span>
                                                    </p>
                                                    <p>{item.created_at}</p>
                                                </div>
                                            </div>
                                            <div className='fee-msg'>
                                                <p>
                                                    查看HASH
                                                    <RightOutline fontSize={12} />
                                                </p>
                                            </div>
                                        </div>
                                        <div className='pay-msg'>
                                            <div className='msg-public need-hidden'>
                                                <div className='need-inner'>
                                                    <p>目标地址</p>
                                                    <p>
                                                        {item.to}
                                                    </p>
                                                </div>
                                                <div className='need-inner'>
                                                    <p>处理前链上余额</p>
                                                    <p>
                                                        {Number(item.from_before_balance).toFixed(4)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='msg-public'>
                                                <p>转出数量</p>
                                                <p>
                                                    <span className='strong-text'>{Number(item.amount).toFixed(4)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </List>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
            </PullToRefresh>
            {/* 详情 */}
            <Dialog visible={detailBox} content={< DetailContent />} />
        </div >
    )
};

export default FeeList;