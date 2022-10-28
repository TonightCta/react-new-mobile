
import { ReactElement, ReactNode, useState } from 'react';
import { useContext } from 'react';
import { IBPayMobile } from '../../../route/router';
import { useEffect } from 'react';
import SelectMerchant from '../../merchant/components/filter/components/select_merchant';
import { Type } from '../../../utils/types';
import { Button, Popover, Toast } from 'antd-mobile';
import OperAssets from './oper_assets';
import { CheckBalanceApi, CheckProfitApi } from '../../../request/api';
import { Inner } from './balance_card';
import CountCard from './count_card';

interface Account {
    name: string,
    email: string,
    ga: number,
    is_admin: boolean,
    last_login_time: string,
    mch_id: string,
    id: string
}

export interface Profit {
    trx: number,
    usdt: number,
    mch_id: string
}

export interface Balance {
    trx: number,
    trx2: number,
    usdt: number,
    mch_id: string
}


const AccountCard = (): ReactElement<ReactNode> => {
    const { state, dispatch } = useContext(IBPayMobile);
    const [selectMerchantBox, setSelectMerchantBox] = useState<boolean>(false);
    const admin = JSON.parse(state.account || '{}')?.merchantInfo.is_admin;
    const [account, setAccount] = useState<Account>({
        name: '',
        email: '',
        ga: 0,
        is_admin: false,
        last_login_time: '',
        mch_id: '',
        id: '',
    });
    const { deposit_fee } = state || [];
    console.log(state)
    const [visible, setVisible] = useState<boolean>(false);
    const [assetType, setAssetType] = useState<number>(1)
    useEffect(() => {
        setAccount(JSON.parse(state.account || '{}')?.merchantInfo);
    }, []);
    //利润信息
    const [settleMsg, setSettleMsg] = useState<Profit>({
        trx: 0,
        usdt: 0,
        mch_id: account.mch_id,
    });
    //余额信息
    const [balanceMsg, setBalanceMsg] = useState<Balance>({
        trx: 0,
        trx2: 0,
        usdt: 0,
        mch_id: account.mch_id,
    });
    const PopBalance = (): ReactElement => {
        return (
            <div className='popver-content'>
                <ul className='balance-pop'>
                    {
                        (deposit_fee as []).map((item: Inner, index: number): ReactElement => {
                            return (
                                <li key={index}>
                                    <p>{item.coin}</p>
                                    <p>{item.amount}</p>
                                </li>
                            )
                        })
                    }
                </ul>
                {
                    deposit_fee?.length === 0 && <p className='no-data'>暂无数据</p>
                }
            </div>
        )
    };
    return (
        <div className='account-card'>
            <div className='account-name-avtar' onClick={admin ? () => {
                setSelectMerchantBox(true)
            } : () => { }}>
                <div className='ib-avatar'>
                    <div className='avatar-box'>
                        <img src={require('../../../assets/images/a.png')} alt="" />
                    </div>
                    <p>{account.name}</p>
                </div>
                <div className='select-merchant-icon'>
                    {admin && <p className='iconfont icon-xiala'></p>}
                </div>
            </div>
            {/* {
                account.ga != undefined && <div className={`auth-status ${account.ga === 1 && 'has-auth'}`}>
                    {account.ga === 0 ? '未' : '已'}绑定
                    {account.ga === 0 && <img src={require('../../../assets/images/right_arrow.png')} alt="" />}
                </div>
            } */}
            {/* 账户操作 */}
            {
                admin && <div className='account-oper'>
                    <div color='primary' className={`auth-status ${account.ga === 1 && 'has-auth'}`}> {account.ga === 0 ? '未' : '已'}绑定</div>
                    <Button color='primary' size='small' onClick={async () => {
                        Toast.show({
                            content: '查询中...',
                            duration: 0,
                            icon: 'loading',
                        })
                        const result = await CheckProfitApi({
                            mchId: account.mch_id ? account.mch_id : account.id
                        });
                        const { code, data } = result;
                        Toast.clear();
                        if (code !== 200) {
                            Toast.show(result.message);
                            return
                        }
                        if (!data.needCheckout) {
                            Toast.show(`最少结算数量为 ${data.minUsdtProfit} USDT`);
                            return
                        };
                        setSettleMsg({
                            ...settleMsg,
                            trx: data.trxProfit,
                            usdt: data.usdtProfit,
                        });
                        setAssetType(1);
                        setVisible(true);
                    }}>利润结算</Button>
                    <Button color='primary' size='small' onClick={async () => {
                        Toast.show({
                            content: '查询中...',
                            duration: 0,
                            icon: 'loading',
                        })
                        const result = await CheckBalanceApi({
                            mchId: account.mch_id ? account.mch_id : account.id
                        });
                        const { code, data } = result;
                        Toast.clear();
                        if (code !== 200) {
                            Toast.show(result.message);
                            return
                        }
                        setBalanceMsg({
                            ...balanceMsg,
                            trx: data.mchFeeAvailableTotal,
                            trx2: data.userFeeAvailableTotal,
                            usdt: data.mchAvailableTotal,
                        });
                        setAssetType(2);
                        setVisible(true);
                    }}>提取余额</Button>

                    <Popover
                        content={<PopBalance />}
                        trigger='click'
                        placement='bottom'
                    >
                        <Button color='primary' size='small'>
                            充值收益
                            {/* <span className='iconfont icon-bizhongmingxi'></span> */}
                        </Button>
                    </Popover>
                </div>
            }
            <div className='login-msg'>
                <div className='msg-public'>
                    <p>商户号</p>
                    <p>{account.mch_id}</p>
                </div>
                <div className='msg-public'>
                    <p>邮箱</p>
                    <p>{account.email}</p>
                </div>
                <div className='msg-public'>
                    <p>上次登录时间</p>
                    <p>{account.last_login_time}</p>
                </div>
            </div>
            <SelectMerchant value={selectMerchantBox} resetValue={(value: boolean) => {
                setSelectMerchantBox(value)
            }} selectMerchant={(value: any) => {
                setAccount(value);
                dispatch({
                    type: Type.SET_MERCHANT,
                    payload: {
                        merchant_id: value.id
                    }
                });
                setSettleMsg({
                    ...settleMsg,
                    mch_id: value.id
                })
                setBalanceMsg({
                    ...balanceMsg,
                    mch_id: value.id
                })
            }} />
            <OperAssets value={visible} profit={settleMsg} balance={balanceMsg} resetModal={(val: boolean): void => {
                setVisible(val);
            }} type={assetType} />
            {/* 流水信息 */}
            {admin && <CountCard />}
        </div>
    )
};
export default AccountCard;