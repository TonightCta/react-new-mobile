
import { Popover, Popup, Toast } from 'antd-mobile';
import { ReactElement, ReactNode, useState } from 'react';
import { useContext } from 'react';
import { IBPayMobile } from '../../../route/router';
import { useEffect } from 'react';
import { WalletViewApi } from '../../../request/api';
import copy from 'copy-to-clipboard'
import { Type } from '../../../utils/types';

interface Balance {
    icon: string,
    uint: string,
    title: string,
    tootip?: string,
    count: number,
    detail: Inner[],
    btn: string,
    bg_color: string,
    btn_color:string,
    btn_text_color:string,
}

export interface Inner {
    coin: string,
    amount: number,
    address: string
}

const source: Balance[] = [
    {
        icon: require('../../../assets/images/balance_card/card_1.png'),
        uint: 'U',
        title: '代付',
        count: 0,
        btn: 'deposit',
        detail: [
            {
                coin: 'USDT-TRC20',
                amount: 0,
                address: ''
            }
        ],
        bg_color: '#EDFFF2',
        btn_color:'#D8FDE2',
        btn_text_color:'#3EBB5E'
    },
    {
        icon: require('../../../assets/images/balance_card/card_2.png'),
        uint: 'TRX',
        title: '代付矿工费',
        tootip: '商户代付时链上所需的矿工费',
        count: 0,
        btn: 'deposit',
        detail: [
            {
                coin: 'USDT-TRC20',
                amount: 0,
                address: ''
            }
        ],
        bg_color: '#F6F6FF',
        btn_color:'#E7E7FF',
        btn_text_color:'#795DFF'
    },
    {
        icon: require('../../../assets/images/balance_card/card_3.png'),
        uint: 'U',
        title: '提现',
        count: 0,
        btn: 'withdraw',
        detail: [
            {
                coin: 'USDT-TRC20',
                amount: 0,
                address: ''
            }
        ],
        bg_color: '#FFFAF6',
        btn_color:'#FFF1E6',
        btn_text_color:'#E9873E'
    },
    {
        icon: require('../../../assets/images/balance_card/card_4.png'),
        uint: 'TRX',
        title: '提现矿工费',
        tootip: '商户提现时链上所需的矿工费',
        count: 0,
        btn: 'deposit',
        detail: [
            {
                coin: 'USDT-TRC20',
                amount: 0,
                address: ''
            },
            {
                coin: 'TRX',
                amount: 0,
                address: ''
            }
        ],
        bg_color: '#FFF8F9',
        btn_color:'#FFE9EC',
        btn_text_color:'#FA3E49'
    },
]

const BalanceCard = (): ReactElement<ReactNode> => {
    const [list, setList] = useState<Balance[]>(source);
    const { state, dispatch } = useContext(IBPayMobile);
    useEffect(() => {
        return () => {
            setList(source)
        }
    }, []);
    const walletViewService = async () => {
        const { merchant_id, account } = state;
        const reuslt = await WalletViewApi({
            mch_id: merchant_id || JSON.parse(account || '{}')?.merchantInfo.mch_id
        });
        const list = source;
        const { data } = reuslt;
        list[0].count = data.mchAvailableTotal;
        list[0].detail = data.mchAvailable;
        list[1].count = data.mchFeeAvailableTotal;
        list[1].detail = data.mchFeeAvailable;
        list[2].count = data.userAvailableTotal;
        list[2].detail = data.userAvailable;
        list[3].count = data.userFeeAvailableTotal;
        list[3].detail = data.userFeeAvailable;
        const arr: Inner[] = data.usersDeposits.map((item: { total: string; coin: string; url: string; }) => {
            return {
                amount: item.total,
                coin: item.coin,
                address: item.url
            }
        })
        dispatch({
            type: Type.SET_DEPOSIT_FEE,
            payload: {
                deposit_fee: arr
            }
        });
        setList([...list])
    };
    useEffect(() => {
        walletViewService();
    }, [state.merchant_id, state.reload])//eslint-disable-line
    //地址展示弹框
    const [copyAddressBox, setCopyAddressBox] = useState<boolean>(false);
    const [addressList, setAddressList] = useState<{ coin: string, address: string }[]>([]);
    const PopBalance = (props: { list: Inner[] }): ReactElement => {
        return (
            <div className='popver-content'>
                <ul className='balance-pop'>
                    {
                        props.list.map((item: Inner, index: number): ReactElement => {
                            return (
                                <li key={index}>
                                    <p>{item.coin}</p>
                                    <p>{item.amount}</p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    };
    return (
        <div className='balance-card'>
            <ul>
                {
                    list.map((item: Balance, index: number): ReactElement => {
                        return (
                            <li key={index} style={{ background: item.bg_color }}>
                                <div className='left-m'>
                                    <div className='coin-msg'>
                                        <img src={item.icon} alt="" />
                                        <div className='balance-inner'>
                                            <div className='inner-name'>
                                                <p>{item.title}</p>
                                                {item.tootip && <Popover
                                                    content={<p className='tooltip-mine'>{item.tootip}</p>}
                                                    trigger='click'
                                                    placement='top'
                                                >
                                                    <p className='iconfont icon-wenhao1'></p>
                                                </Popover>}
                                            </div>
                                            <p className='inner-count'>{Number(item.count).toFixed(4)}&nbsp;{item.uint}</p>
                                        </div>
                                    </div>
                                    <div className='card-oper'>
                                        <Popover
                                            content={<PopBalance list={item.detail} />}
                                            trigger='click'
                                            placement='bottom'
                                        >
                                            <p className='coin-detail'>
                                                币种明细
                                                <span className='iconfont icon-a-xialajiantouxiaobeifen3'></span>
                                            </p>
                                        </Popover>
                                        {
                                            item.btn === 'deposit' && <p className='coin-detail address-detail' onClick={() => {
                                                const { detail } = item;
                                                const address: ({ coin: string, address: string })[] = [];
                                                detail.forEach((e: Inner) => {
                                                    address.push({
                                                        coin: e.coin,
                                                        address: e.address
                                                    });
                                                });
                                                setAddressList([...address]);
                                                setCopyAddressBox(true);
                                            }}>
                                                地址管理
                                                <span className='iconfont icon-a-xialajiantouxiaobeifen3'></span>
                                            </p>
                                        }
                                    </div>
                                </div>
                                <div className='oper-btn' style={{background:item.btn_color}} onClick={() => {
                                    Toast.show('移动站功能建设中，如需使用此功能请移步至PC站')
                                }}>
                                    <p style={{color:item.btn_text_color}}>去{item.btn === 'deposit' ? '充值' : '提现'}</p>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            {/* 复制地址 */}
            <Popup
                visible={copyAddressBox}
                onMaskClick={() => {
                    setCopyAddressBox(false)
                }}
                bodyStyle={{ height: '60vh' }}
            >
                <div className='copy-address-box'>
                    <p className='iconfont icon-close2' onClick={() => {
                        setCopyAddressBox(false)
                    }}></p>
                    <ul>
                        {
                            addressList.map((item: { coin: string, address: string }, index: number): ReactElement => {
                                return (
                                    <li key={index}>
                                        <div className='left-address'>
                                            <p>
                                                <span> {item.coin}</span>
                                            </p>
                                            <p>{item.address ? item.address : '-'}</p>
                                        </div>
                                        <p className='copy-btn' onClick={() => {
                                            copy(item.address);
                                            Toast.show(`复制 ${item.coin} 地址成功`);
                                        }}>复制</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </Popup>
        </div>
    )
};
export default BalanceCard;