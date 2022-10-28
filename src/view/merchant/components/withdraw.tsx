
import { ReactElement, ReactNode, useState, useRef } from 'react';
import copy from 'copy-to-clipboard';
import { Dialog, DotLoading, InfiniteScroll, List, PullToRefresh, Toast } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep'
import { PullStatus } from 'antd-mobile/es/components/pull-to-refresh';
import { useContext } from 'react';
import { IBPayMobile } from '../../../route/router';
import { useEffect } from 'react';
import { CloseOutline } from 'antd-mobile-icons';
import { WithdrawListApi, SetHashApi, RejectWithdrawApi } from '../../../request/api';
import { SetLogo } from '../../../utils';


interface Withdraw {
    icon: string,
    coin: string,
    created_at: string,
    fee: number,
    to: string,
    merchant: {
        name: string
    },
    amount: number,
    status: string | number,
    logo: string,
    id: string,
    url: string,
    own_order_sn: string,
}

const statusRecord: Record<PullStatus, ReactElement | string> = {
    pulling: '用力拉',
    canRelease: '松开吧',
    refreshing: <DotLoading color='primary' />,
    complete: '好啦',
}

const WithdrawList = (): ReactElement<ReactNode> => {
    const { state } = useContext(IBPayMobile);
    //是否还有更多数据
    const [hasMore, setHasMore] = useState<boolean>(true);
    //填写交易HASH
    const [hashBox, setHashBox] = useState<boolean>(false)
    const HashContent = (): ReactElement => {
        const [hash, setHash] = useState<string>('');
        return (
            <div className='hash-content'>
                <div className='oper-title'>
                    <p>填写HASH</p>
                    <p className='iconfont' onClick={() => {
                        setHashBox(false)
                    }}>
                        <CloseOutline />
                    </p>
                </div>
                <div className='inp-box'>
                    <input type="text" value={hash} onChange={(e) => {
                        setHash(e.target.value);
                    }} placeholder='请填写HASH' />
                </div>
                <div className='oper-btn'>
                    <button className='default-btn' onClick={() => {
                        setHashBox(false)
                    }}>取消</button>
                    <button className='confirm-btn' onClick={async () => {
                        if (!hash) {
                            Toast.show('请输入交易HASH');
                            return;
                        };
                        // txid: this.setAddress,
                        // withdraw_id: this.orderID,
                        const result = await SetHashApi({
                            txid: hash,
                            withdraw_id: detailMsg.current.id
                        });
                        const { code } = result;
                        if (code !== 200) {
                            Toast.show(result.message);
                            return;
                        };
                        Toast.show('设置交易Hash成功');
                        setHashBox(false)
                        listDataService();
                    }}>确认</button>
                </div>
            </div>
        )
    }
    //拒绝提币
    const [rejectBox, setRejectBox] = useState<boolean>(false);
    const RejectContent = (): ReactElement => {
        return (
            <div className='hash-content'>
                <div className='oper-title'>
                    <p className='iconfont' onClick={() => {
                        setRejectBox(false)
                    }}>
                        <CloseOutline />
                    </p>
                </div>
                <p className='reject-remark'>
                    您确定拒绝该商家的提币申请？操作成功后将不可撤回
                </p>
                <div className='oper-btn'>
                    <button className='default-btn' onClick={() => {
                        setRejectBox(false)
                    }}>取消</button>
                    <button className='confirm-btn' onClick={async () => {
                        // withdrawId
                        const result = await RejectWithdrawApi({
                            withdrawId: detailMsg.current.id
                        });
                        const { code } = result;
                        if (code !== 200) {
                            Toast.show(result.message);
                            return;
                        };
                        Toast.show('拒绝成功');
                        setRejectBox(false)
                        listDataService();
                    }}>确认</button>
                </div>
            </div>
        )
    };
    //详情
    const [detailBox, setDetailsBox] = useState<boolean>(false);
    //页码
    const [page, setPage] = useState<number>(0);
    //数据列表
    const [list, setList] = useState<Withdraw[]>([]);
    useEffect(() => {
        setPage(1)
    }, [])
    // --->
    useEffect(() => {
        listDataService(1);
    }, [state.filter_withdraw]);
    //详情信息
    const detailMsg = useRef<Withdraw>({
        icon: '',
        coin: '',
        created_at: '',
        fee: 0,
        to: '',
        merchant: {
            name: ''
        },
        amount: 0,
        status: 0,
        logo: '',
        id: '',
        url: '',
        own_order_sn: '',
    });
    const DetailsContent = (): ReactElement => {
        return (
            <div className='detail-content'>
                <span className='close-icon' onClick={() => {
                    setDetailsBox(false)
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
                        <p>{detailMsg.current.own_order_sn}</p>
                        <p></p>
                    </li>
                    <li>
                        <p>提币地址</p>
                        <p>{detailMsg.current.to}</p>
                        <p className='iconfont icon-a-fuzhi2' onClick={() => {
                            copy(detailMsg.current.to);
                            Toast.show('复制成功')
                        }}></p>
                    </li>
                    <li>
                        <p>手续费</p>
                        <p>{detailMsg.current.fee}</p>
                        <p></p>
                    </li>
                    <li>
                        <p>订单状态</p>
                        <p className={`${detailMsg.current.status == 0 && 'withdraw-pending' ||
                            detailMsg.current.status == 2 && 'withdraw-reject' ||
                            detailMsg.current.status == 3 && 'withdraw-done' || ''
                            }`}>
                            {/* 已拒绝 */}
                            {
                                detailMsg.current.status == 0 && '提币中' ||
                                detailMsg.current.status == 2 && '已拒绝' ||
                                detailMsg.current.status == 3 && '提币完成' || 'UNKNOW'
                            }
                        </p>
                        <p></p>
                    </li>
                    <li>
                        <p>提币金额</p>
                        <p className='strong-text'>{detailMsg.current.amount}</p>
                        <p className='iconfont icon-a-fuzhi2' onClick={() => {
                            copy('test');
                            Toast.show('复制成功')
                        }}></p>
                    </li>
                    <li onClick={() => {
                        setDetailsBox(false);
                    }} className={`${detailMsg.current.status === 3 && 'just-one'}`}>
                        {
                            detailMsg.current.status == 0 && <button className='default-btn' onClick={() => {
                                setRejectBox(true)
                            }}>拒绝</button>
                        }
                        {
                            detailMsg.current.status == 0 && <button className='confirm-btn' onClick={() => {
                                setHashBox(true)
                            }}>填写HASH</button>
                        }
                        {
                            detailMsg.current.status == 3 && <button className='confirm-btn' onClick={() => {
                                window.open(detailMsg.current.url)
                            }}>查看HASH</button>
                        }
                    </li>
                </ul>
            </div>
        )
    }
    //获取数据
    const listDataService = async (_page?: number) => {
        const { filter_withdraw } = state;
        const filter = JSON.parse(filter_withdraw || '{}');
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
        }
        const result = await WithdrawListApi(params);
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
    }
    const loadMore = async () => {
        setPage(page + 1)
        page !== 1 && await listDataService();
    }
    return (
        <div className='withdraw-list list-public'>
            
            <PullToRefresh
                onRefresh={async () => {
                    await sleep(1000);
                    listDataService()
                }}
                renderText={status => {
                    return <div style={{ fontSize: '14px' }}>{statusRecord[status]}</div>
                }}
            >
                <List>
                    <ul>
                        {
                            list.map((item: Withdraw, index: number): ReactElement => {
                                return (
                                    <li key={index} onClick={() => {
                                        detailMsg.current = item
                                    }}>
                                        <div className='coin-msg'>
                                            <div className='img-text'>
                                                <img src={item.logo} alt="" />
                                                <div className='msg-text'>
                                                    <p>{item.merchant.name}<span>{item.coin}</span></p>
                                                    <p>{item.created_at}</p>
                                                </div>
                                            </div>
                                            {/* <div className='fee-msg'>
                                                <p>手续费</p>
                                                <p>{Number(item.fee).toFixed(2)}</p>
                                            </div> */}
                                        </div>
                                        <div className='pay-msg'>
                                            <div className='msg-public need-hidden'>
                                                <div className='need-inner'>
                                                    <p>提币地址</p>
                                                    <p>
                                                        {item.to}
                                                    </p>
                                                    <p>
                                                        <span className='iconfont icon-a-fuzhi2' onClick={() => {
                                                            copy(item.to)
                                                            Toast.show('复制成功')
                                                        }}></span>
                                                    </p>
                                                </div>
                                                <div className='need-inner'>
                                                    <p>手续费</p>
                                                    <p>
                                                        {Number(item.fee).toFixed(2)}
                                                    </p>
                                                    <p>
                                                        <span className='iconfont icon-a-fuzhi2' onClick={() => {
                                                            copy(String(item.fee))
                                                            Toast.show('复制成功')
                                                        }}></span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='msg-public'>
                                                <p>提币金额</p>
                                                <p>
                                                    <span className='strong-text'>{Number(item.amount).toFixed(4)}</span>
                                                    <span className='iconfont icon-a-fuzhi2' onClick={() => {
                                                        copy(String(item.amount));
                                                        Toast.show('复制成功')
                                                    }}></span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className='oper-box'>
                                            {
                                                item.status == 0 && <button className='reject-btn' onClick={() => {
                                                    setRejectBox(true)
                                                }}>拒绝</button>
                                            }
                                            {
                                                item.status == 0 && <button className='primary-btn' onClick={() => {
                                                    setHashBox(true)
                                                }}>填写HASH</button>
                                            }
                                            <button className='primary-btn' onClick={() => {
                                                setDetailsBox(true)
                                            }}>查看</button>
                                            {
                                                item.status == 3 && <button className='done-btn'>提币完成</button>
                                            }
                                            {
                                                item.status == 2 && <button className='done-btn'>已拒绝</button>
                                            }
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </List>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
            </PullToRefresh>
            {/* 填写交易HASH */}
            <Dialog visible={hashBox} content={<HashContent />} />
            {/* 拒绝提币 */}
            <Dialog visible={rejectBox} content={<RejectContent />} />
            {/* 详情 */}
            <Dialog visible={detailBox} closeOnMaskClick content={<DetailsContent />} />
        </div >
    )
};
export default WithdrawList;

