
import { Popover } from 'antd-mobile';
import { ReactElement, ReactNode, useContext } from 'react';
import { useState } from 'react';
import { IBPayMobile } from '../../../route/router';
import { useEffect } from 'react';
import { MerchantViewApi } from '../../../request/api';

interface Inner {
    name: string,
    list: { coin: string, total: number | string }[]
}

interface Card {
    icon: string,
    title: string,
    count: number,
    background: string,
    more: Inner[],
    more_icon?: string,
    uint?: string,
    bg_icon:string,
}

const source = [
    {
        icon: 'icon-a-bianzu50',
        title: '总商户',
        count: 0,
        background: 'linear-gradient(47deg, #FF98B7 0%, #FF7398 100%)',
        more: [],
        bg_icon:require('../../../assets/images/count_card/card_1.png')
    },
    {
        icon: 'icon-a-bianzu9',
        title: '总提币',
        count: 0,
        background: 'linear-gradient(45deg, #D7ACFC 0%, #B27AFF 100%)',
        more: [
            {
                name: '商户',
                list: [
                    {
                        coin: 'TRX',
                        total: 0
                    }
                ],
            },
            {
                name: '用户',
                list: [
                    {
                        coin: 'USDT-TRC20',
                        total: 0
                    }
                ],
            }
        ],
        uint: 'U',
        more_icon: require('../../../assets/images/count_card/arrow_1.png'),
        bg_icon:require('../../../assets/images/count_card/card_2.png')
    },
    {
        icon: 'icon-a-bianzu501',
        title: '总充值',
        count: 0,
        background: 'linear-gradient(44deg, #8AE3BE 0%, #53C390 100%)',
        more: [
            {
                name: '商户',
                list: [
                    {
                        coin: 'ETH',
                        total: 0
                    }
                ],
            },
            {
                name: '用户',
                list: [
                    {
                        coin: 'DOGE',
                        total: 0
                    }
                ],
            }
        ],
        uint: 'U',
        more_icon: require('../../../assets/images/count_card/arrow_2.png'),
        bg_icon:require('../../../assets/images/count_card/card_3.png')
    },
    {
        icon: 'icon-a-bianzu51',
        title: '总手续费',
        count: 0,
        background: 'linear-gradient(46deg, #E7DC5D 0%, #E5CA4D 100%)',
        more: [
            {
                name: '充值手续费',
                list: [
                    {
                        coin: 'BTC',
                        total: 0
                    }
                ],
            },
            {
                name: '提现手续费',
                list: [
                    {
                        coin: 'AAVE',
                        total: 0
                    }
                ],
            },
            {
                name: '矿工费',
                list: [
                    {
                        coin: 'AAVE',
                        total: 0
                    }
                ],
            },
        ],
        uint: 'U',
        more_icon: require('../../../assets/images/count_card/arrow_3.png'),
        bg_icon:require('../../../assets/images/count_card/card_4.png')
    },
    {
        icon: 'icon-a-bianzu511',
        title: '已结利润',
        count: 0,
        background: 'linear-gradient(46deg, #FFC970 0%, #F39F47 100%)',
        more: [
            {
                name: '商户',
                list: [
                    {
                        coin: 'BTC',
                        total: 0
                    }
                ],
            },
        ],
        uint: 'U',
        more_icon: require('../../../assets/images/count_card/arrow_5.png'),
        bg_icon:require('../../../assets/images/count_card/card_5.png')
    }
]

const CountCard = (): ReactElement<ReactNode> => {
    const { state } = useContext(IBPayMobile);
    const [list, setList] = useState<Card[]>(source);
    useEffect(() => {
        return () => {
            setList(source)
        }
    }, []);
    useEffect(() => {
        assetsInfo();
    },[state.merchant_id])
    const assetsInfo = async () => {
        const { merchant_id } = state;
        const result = await MerchantViewApi({
            mch_id: merchant_id
        });
        const list = source;
        const { data } = result;
        list[0].count = data.merchantsNumber;
        list[1].count = data.totalWithdraw.toFixed(0);
        list[1].more[0].list = data.merchantsWithdraws;
        list[1].more[1].list = data.usersWithdraws;
        list[2].count = data.totalDeposit.toFixed(0);
        list[2].more[0].list = data.merchantsDeposits;
        list[2].more[1].list = data.usersDeposits;
        list[3].count = data.totalFee.toFixed(0);
        list[3].more[0].list = data.allDepositFee;
        list[3].more[1].list = data.allWithdrawFee;
        list[3].more[2].list = data.allMinerFee;
        list[4].count = data.totalCheckout.toFixed(0);
        list[4].more[0].list = data.checkoutHistory;
        setList([...list])
    }
    const PopCon = (props: { list: Inner[] }): ReactElement => {
        return (
            <div className='popver-content'>
                {
                    props.list.map((item: Inner, index: number): ReactElement => {
                        return (
                            <div className='content-inner' key={index}>
                                <p className='inner-title'>{item.name}</p>
                                <ul>
                                    {
                                        item.list.map((inner, indexInner): ReactElement => {
                                            return (
                                                <li key={indexInner}>
                                                    <p>{inner.coin}</p>
                                                    <p>{inner.total}</p>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    return (
        <div className='count-card'>
            <ul>
                {
                    list.map((item: Card, index: number): ReactElement<ReactNode> => {
                        return (
                            <li key={index} style={{ background: item.background }}>
                                <div className='item-name'>
                                    <span className={`iconfont ${item.icon}`}></span>
                                    {item.title}
                                    {item.more.length > 0 &&
                                        <Popover
                                            content={<PopCon list={item.more} />}
                                            trigger='click'
                                            placement='bottom'
                                        >
                                            <div className='count-detail'>
                                                <p>明细</p>
                                                <img src={item.more_icon} />
                                            </div>
                                        </Popover>}
                                </div>
                                <div className='item-count'>
                                    <p className='count-text'>{item.count}&nbsp;{item.uint && item.uint}</p>
                                </div>
                                <div className='item-bg-icon'>
                                    <img src={item.bg_icon} alt="" />
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
};

export default CountCard;