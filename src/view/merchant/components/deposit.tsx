
import { Dialog, DotLoading, InfiniteScroll, List, PullToRefresh, Toast } from 'antd-mobile';
import { CloseOutline, RightOutline } from 'antd-mobile-icons';
import { PullStatus } from 'antd-mobile/es/components/pull-to-refresh';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { IBPayMobile } from '../../../route/router';
import { OrderListApi } from '../../../request/api';
import copy from 'copy-to-clipboard';
import { SetLogo } from '../../../utils';
import { useRef } from 'react';

interface Deposit {
    icon: string,
    coin: string,
    created_at: string,
    to: string,
    amount: number,
    logo: string,
    id: string,
    url: string,
    merchant: {
        name: string
    }
}

const statusRecord: Record<PullStatus, ReactElement | string> = {
    pulling: '用力拉',
    canRelease: '松开吧',
    refreshing: <DotLoading color='primary' />,
    complete: '好啦',
}
const DepositList = (): ReactElement<ReactNode> => {
    const { state } = useContext(IBPayMobile);
    const [detailBox, setDetailBox] = useState<boolean>(false);
    //是否还有更多数据
    const [hasMore, setHasMore] = useState<boolean>(true);
    useEffect(() => {
        listDataService(1)
    }, [state.filter_deposit]);
    //页码
    const [page, setPage] = useState<number>(0);
    //数据列表
    const [list, setList] = useState<Deposit[]>([]);
    const listDataService = async (_page?: number) => {
        const { filter_deposit } = state;
        const filter = JSON.parse(filter_deposit || '{}');
        const params = {
            trxNo: filter.order_id ? filter.order_id : '',
            asset: filter.coin ? filter.coin : '',
            startTime: filter.start ? new Date(filter.start).getTime() : '',
            endTime: filter.end ? new Date(filter.end).getTime() : '',
            amountLowerLimit: filter.min ? filter.min : '',
            amountUpperLimit: filter.max ? filter.max : '',
            toAddress: filter.address ? filter.address : '',
            txHash: filter.hash ? filter.hash : '',
            state: filter.status ? filter.status : '',
            merchant_id: filter.merchant ? filter.merchant : '',
            limit: 10,
            isMerchant: 1,
            page: _page ? _page : page
        };
        const result = await OrderListApi(params);
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
        logo: '',
        id: '',
        url: '',
        merchant: {
            name: ''
        }
    })
    const DetailContent = (): ReactElement => {
        return (
            <div className='detail-content'>
                <span className='close-icon' onClick={() => {
                    setDetailBox(false)
                }}>
                    <CloseOutline />
                </span>
                <img src={detailMsg.current.logo} alt="" />
                <p className='coin-name'>{detailMsg.current.coin}</p>
                <p className='order-date'>{detailMsg.current.created_at}</p>
                <ul>
                    <li>
                        <p>商户名称</p>
                        <p>{detailMsg.current.merchant.name}</p>
                        <p className='iconfont icon-a-fuzhi2' onClick={() => {
                            copy(detailMsg.current.merchant.name);
                            Toast.show('复制成功')
                        }}></p>
                    </li>
                    <li>
                        <p>订单号</p>
                        <p>{detailMsg.current.id}</p>
                        <p></p>
                    </li>
                    <li>
                        <p>充币地址</p>
                        <p>{detailMsg.current.to}</p>
                        <p className='iconfont icon-a-fuzhi2' onClick={() => {
                            copy(detailMsg.current.to);
                            Toast.show('复制成功')
                        }}></p>
                    </li>
                    <li>
                        <p>提币金额</p>
                        <p className='strong-text'>{detailMsg.current.amount}</p>
                        <p className='iconfont icon-a-fuzhi2' onClick={() => {
                            copy(String(detailMsg.current.amount));
                            Toast.show('复制成功')
                        }}></p>
                    </li>
                    <li>
                        <button color='primary' onClick={() => {
                            window.open(detailMsg.current.url)
                        }}>查看HASH</button>
                    </li>
                </ul>
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
                                                    <p>{item.merchant.name} <span>{item.coin}</span> </p>
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
                                                <p>充币地址</p>
                                                <p>
                                                    {item.to}
                                                </p>
                                                <span className='iconfont icon-a-fuzhi2' onClick={(e) => {
                                                    e.stopPropagation();
                                                    copy(item.to)
                                                    Toast.show('复制成功')
                                                }}></span>
                                            </div>
                                            <div className='msg-public'>
                                                <p>充值金额</p>
                                                <p>
                                                    <span className='strong-text'>{item.amount.toFixed(4)}</span>
                                                    <span className='iconfont icon-a-fuzhi2' onClick={(e) => {
                                                        e.stopPropagation();
                                                        copy(String(item.amount));
                                                        Toast.show('复制成功')
                                                    }}></span>
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

export default DepositList;