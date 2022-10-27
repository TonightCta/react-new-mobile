
import { Button, Modal } from 'antd-mobile';
import { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Toast } from 'antd-mobile';
import { Balance, Profit } from './account_card';
import { ClearBalanceApi, SendCodeApi, SettleProfitApi } from '../../../request/api';
import { useCountdown } from '../../../utils';
import { useContext } from 'react';
import { IBPayMobile } from '../../../route/router';
import { Type } from '../../../utils/types';

interface Props {
    value: boolean,
    type: number,// 1 ---> 利润结算  2 ---> 余额提取
    resetModal: (val: boolean) => void,
    profit: Profit,
    balance: Balance
}

interface Verify {
    address: string,
    amount: number | string,
    trade: string,
    code: number | string,
    auth: number | string
};

const source: Verify = {
    address: '',
    amount: '',
    trade: '',
    code: '',
    auth: ''
}


const OperAssets = (props: Props): ReactElement<ReactNode> => {
    const [visible, setVisible] = useState<boolean>(false);
    //监听modal状态
    useEffect(() => {
        setVisible(props.value);
    }, [props.value]);
    //重置
    useEffect(() => {
        setAssetList([]);
        !visible && props.resetModal(false);
    }, [visible]);
    const [assetList, setAssetList] = useState<number[]>([]);
    const editAsset = (_type: number) => {
        const arr: number[] = [];
        assetList.indexOf(_type) > -1 ? arr.splice(assetList.indexOf(_type), 1) : arr.push(_type);
        setAssetList(arr);
    };
    //利润结算额度
    const [profit, setProfit] = useState<Profit>(props.profit);
    //余额提取额度
    const [balance, setBalance] = useState<Balance>(props.balance);
    useEffect(() => {
        setVisible(props.value)
    }, [props.value]);
    useEffect(() => {
        setProfit(props.profit)
    }, [props.profit]);
    useEffect(() => {
        setBalance(props.balance)
    }, [props.balance])

    const ModalContent = (): ReactElement => {
        //检验信息
        const [verifyMsg, setVerifyMsg] = useState<Verify>(source);
        //倒计时
        const { count, startTimer } = useCountdown(60);
        useEffect(() => {
            setVerifyMsg(source);
        }, [visible]);
        const { dispatch } = useContext(IBPayMobile);
        //全部
        const setAllBalance = (_num: number): void => {
            setVerifyMsg({
                ...verifyMsg,
                amount: _num
            })
        };
        //显示密码
        const [showPass, setShowPass] = useState<string>('password');
        //发送验证码
        const sendCodeService = async () => {
            const result = await SendCodeApi({
                scene: 3,
            });
            const { code } = result;
            if (code !== 200) {
                Toast.show(result.message);
                return;
            };
            Toast.show('验证码发送成功');
            startTimer();
        };
        //loading
        const [waitResult,setWaitLoading] = useState<boolean>(false);
        const submitAssetOper = async () => {
            if (assetList.length < 1) {
                Toast.show(`请选择${props.type === 1 ? '结算' : '提取'}币种`);
                return
            }
            if (!verifyMsg.address) {
                Toast.show(`请输入${props.type === 1 ? '结算' : '提取'}地址`);
                return;
            };
            if (!verifyMsg.amount) {
                Toast.show(`请输入${props.type === 1 ? '结算' : '提取'}金额`);
                return;
            };
            if (!verifyMsg.trade) {
                Toast.show('请输入交易密码');
                return;
            };
            if (!verifyMsg.code) {
                Toast.show('请输入邮箱验证码');
                return;
            };
            if (!verifyMsg.auth) {
                Toast.show('请输入谷歌验证码');
                return;
            };
            //利润结算
            const profitService = async () => {
                const balance: number = assetList[0] === 2 ? props.profit.trx : props.profit.usdt;
                if (verifyMsg.amount > balance) {
                    Toast.show(`最大可操作 ${assetList[0] === 2 ? 'TRX' : 'USDT'} 利润为 ${balance}`);
                    return;
                };
                setWaitLoading(true);
                const result = await SettleProfitApi({
                    mchId: props.profit.mch_id,
                    address: verifyMsg.address,
                    pay_password: verifyMsg.trade,
                    email_code: verifyMsg.code,
                    ga_code: verifyMsg.auth,
                    checkOne: assetList[0],
                    amount: verifyMsg.amount
                });
                const { code } = result;
                setWaitLoading(false);
                if (code !== 200) {
                    Toast.show(result.message);
                    return;
                };
                Toast.show('结算成功');
                setVisible(false);
            };
            //余额提取
            const balanceService = async () => {
                const balance: number = assetList[0] === 1 && props.balance.trx2 || assetList[0] === 2 && props.balance.trx || props.balance.usdt;
                if (verifyMsg.amount > balance) {
                    Toast.show(`最大可操作 ${assetList[0] === 1 && 'TRX提现余额' || assetList[0] === 2 && 'TRX代付余额' || 'USDT-TRC20'} 余额为 ${balance}`);
                    return
                };
                setWaitLoading(true);
                const result = await ClearBalanceApi({
                    mchId: props.balance.mch_id,
                    address: verifyMsg.address,
                    pay_password: verifyMsg.trade,
                    email_code: verifyMsg.code,
                    ga_code: verifyMsg.auth,
                    checkOne: assetList[0],
                    amount: verifyMsg.amount
                });
                const { code } = result;
                setWaitLoading(false);
                if (code !== 200) {
                    Toast.show(result.message);
                    return;
                };
                Toast.show('提取成功');
                setVisible(false);
            };
            props.type === 1 ? profitService() : balanceService();
            dispatch({
                type:Type.SET_RELOAD,
                payload:{
                    reload:new Date().getTime()
                }
            })
        };
        return (
            <div className='modal-content'>
                <div className='content-title'>
                    <p></p>
                    <p>{props.type === 1 ? '利润结算' : '余额提取'}</p>
                    <p className='iconfont icon-close2' onClick={() => {
                        setVisible(false);
                    }}></p>
                </div>
                <div className='content-inner'>
                    <p className='inner-title'>
                        请选择{props.type === 1 ? '结算' : '提取'}币种<span>(单选)</span>
                    </p>
                    {/* 利润结算 */}
                    {props.type === 1 && <ul>
                        {/* 2 */}
                        <li onClick={() => { editAsset(2) }} className={`${assetList.indexOf(2) > -1 ? 'active-settlement' : ''}`}>
                            <p className='select-radio'>
                                <span className='iconfont icon-hook'></span>
                            </p>
                            <div className='select-type'>
                                <div className='type-left'>
                                    <img src={require('../../../assets/images/oper_icon.png')} alt="" />
                                    <p>TRX收益</p>
                                </div>
                                <p className='type-balance'>
                                    {Number(profit.trx).toFixed(2)}
                                    <span onClick={(e) => {
                                        e.stopPropagation();
                                        setAllBalance(profit.trx)
                                    }}>全部</span>
                                </p>
                            </div>
                        </li>
                        {/* 1 */}
                        <li onClick={() => { editAsset(1) }} className={`${assetList.indexOf(1) > -1 ? 'active-settlement' : ''}`}>
                            <p className='select-radio'>
                                <span className='iconfont icon-hook'></span>
                            </p>
                            <div className='select-type'>
                                <div className='type-left'>
                                    <img src={require('../../../assets/images/oper_icon.png')} alt="" />
                                    <p>USDT-TRC20收益</p>
                                </div>
                                <p className='type-balance'>
                                    {Number(profit.usdt).toFixed(2)}
                                    <span onClick={(e) => {
                                        e.stopPropagation();
                                        setAllBalance(profit.usdt)
                                    }}>全部</span>
                                </p>
                            </div>
                        </li>
                    </ul>}
                    {/* 余额提取 */}
                    {props.type === 2 && <ul>
                        {/* 2 */}
                        <li onClick={() => { editAsset(2) }} className={`${assetList.indexOf(2) > -1 ? 'active-settlement' : ''}`}>
                            <p className='select-radio'>
                                <span className='iconfont icon-hook'></span>
                            </p>
                            <div className='select-type'>
                                <div className='type-left'>
                                    <img src={require('../../../assets/images/oper_icon.png')} alt="" />
                                    <p>TRX代付余额</p>
                                </div>
                                <p className='type-balance'>
                                    {Number(balance.trx).toFixed(2)}
                                    <span onClick={(e) => {
                                        e.stopPropagation();
                                        setAllBalance(balance.trx)
                                    }}>全部</span>
                                </p>
                            </div>
                        </li>
                        {/* 1 */}
                        <li onClick={() => { editAsset(1) }} className={`${assetList.indexOf(1) > -1 ? 'active-settlement' : ''}`}>
                            <p className='select-radio'>
                                <span className='iconfont icon-hook'></span>
                            </p>
                            <div className='select-type'>
                                <div className='type-left'>
                                    <img src={require('../../../assets/images/oper_icon.png')} alt="" />
                                    <p>TRX提现余额</p>
                                </div>
                                <p className='type-balance'>
                                    {Number(balance.trx2).toFixed(2)}
                                    <span onClick={(e) => {
                                        e.stopPropagation();
                                        setAllBalance(balance.trx2)
                                    }}>全部</span>
                                </p>
                            </div>
                        </li>
                        {/* 3 */}
                        <li onClick={() => { editAsset(3) }} className={`${assetList.indexOf(3) > -1 ? 'active-settlement' : ''}`}>
                            <p className='select-radio'>
                                <span className='iconfont icon-hook'></span>
                            </p>
                            <div className='select-type'>
                                <div className='type-left'>
                                    <img src={require('../../../assets/images/oper_icon.png')} alt="" />
                                    <p>USDT-TRC20余额</p>
                                </div>
                                <p className='type-balance'>
                                    {Number(balance.usdt).toFixed(2)}
                                    <span onClick={(e) => {
                                        e.stopPropagation();
                                        setAllBalance(balance.usdt)
                                    }}>全部</span>
                                </p>
                            </div>
                        </li>
                    </ul>}
                    <div className='inp-box'>

                        <div className='inp-box-inner'>
                            <p className='inner-label'>{props.type === 1 ? '结算' : '提取'}地址</p>
                            <input type="text" value={verifyMsg.address} onChange={(e) => {
                                setVerifyMsg({
                                    ...verifyMsg,
                                    address: e.target.value
                                })
                            }} placeholder={`请输入${props.type === 1 ? '结算' : '提取'}地址`} />
                        </div>
                        <div className='inp-box-inner'>
                            <p className='inner-label'>{props.type === 1 ? '结算' : '提取'}金额</p>
                            <input type="number" value={verifyMsg.amount} onChange={(e) => {
                                setVerifyMsg({
                                    ...verifyMsg,
                                    amount: e.target.value
                                })
                            }} placeholder={`请输入${props.type === 1 ? '结算' : '提取'}金额`} />
                        </div>
                        <div className='inp-box-inner'>
                            <p className='inner-label'>交易密码</p>
                            <input type={showPass} autoComplete="new-password" value={verifyMsg.trade} onChange={(e) => {
                                setVerifyMsg({
                                    ...verifyMsg,
                                    trade: e.target.value
                                })
                            }} placeholder='请输入交易密码' />
                            <p className={`iconfont ${showPass === 'password' ? 'icon-yanjing-guanbeifen' : 'icon-yanjing-guan'}`} onClick={() => {
                                setShowPass(showPass === 'password' ? 'text' : 'password')
                            }}></p>
                        </div>
                        <div className='inp-box-inner'>
                            <p className='inner-label'>邮箱验证码</p>
                            <input type="number" value={verifyMsg.code} onChange={(e) => {
                                setVerifyMsg({
                                    ...verifyMsg,
                                    code: e.target.value
                                })
                            }} placeholder='请输入邮箱验证码' />
                            <p className={`send-code ${count < 60 ? 'disable-send' : ''}`} onClick={count === 60 ? () => { sendCodeService() } : () => { }}>
                                {count === 60 ? '发送验证码' : `${count} s`}
                            </p>
                        </div>
                        <div className='inp-box-inner'>
                            <p className='inner-label'>谷歌验证码</p>
                            <input type="number" value={verifyMsg.auth} onChange={(e) => {
                                setVerifyMsg({
                                    ...verifyMsg,
                                    auth: e.target.value
                                })
                            }} placeholder="请输入谷歌验证码" />
                        </div>
                        <div className='submit-btn'>
                            <Button color='primary' onClick={() => {
                                setVisible(false);
                            }}>取消</Button>
                            <Button color='primary' loading={waitResult} onClick={() => {
                                submitAssetOper()
                            }}>确定</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='oper-assets'>
            <Modal
                visible={visible}
                content={<ModalContent />}
                closeOnMaskClick
                header={null}
                className="oper-assets-modal"
                onClose={() => {
                    setVisible(false)
                }}
            />
        </div>
    )
};

export default OperAssets;