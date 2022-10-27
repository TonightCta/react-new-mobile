
import { Button, Popup } from 'antd-mobile';
import { CloseOutline, DownOutline } from 'antd-mobile-icons';
import { ReactElement, ReactNode, useState } from 'react';
import { FilterD, Type } from '../../../../utils/types';
import './index.scss'
import SelectCoin from './components/select_coin';
import SelectDate from './components/select_date';
import SelectMerchant from './components/select_merchant';
import { useContext } from 'react';
import { IBPayMobile } from '../../../../route/router';

interface Filter {
    merchant: boolean,
    coin: boolean,
    date: boolean,
    dateType: number
}

const source: FilterD = {
    merchant: '',
    merchant_name:'',
    merchant_email:'',
    coin: '',
    order_id: '',
    address: '',
    start: '',
    end: '',
    min: '',
    max: '',
    hash: '',
};

const FilterDeposit = (): ReactElement<ReactNode> => {
    const { dispatch } = useContext(IBPayMobile)
    const [filterBox, setFilterBox] = useState<boolean>(false);
    const [filterMsg, setFilterMsg] = useState<FilterD>(source);
    const [selectPopup, setSelectPopup] = useState<Filter>({
        merchant: false,
        coin: false,
        date: false,
        dateType: 1
    })
    return (
        <div className='filter-deposit filter-public'>
            <p className='iconfont icon-shaixuan' onClick={() => {
                setFilterBox(true);
            }}></p>
            {/* 筛选弹框 */}
            <Popup visible={filterBox} onMaskClick={() => {
                setFilterBox(false)
            }}>
                <div className='filter-title'>
                    <p>全部筛选</p>
                    <span onClick={() => {
                        setFilterBox(false)
                    }}><CloseOutline /></span>
                </div>
                <div className='filter-inner'>
                    <div className='select-popup'>
                        <div className='select-popup-inner'>
                            <p className='inner-label'>商家</p>
                            <div className='inner-dom' onClick={() => {
                                setSelectPopup({
                                    ...selectPopup,
                                    merchant: true
                                })
                            }}>
                                <p>{filterMsg.merchant ? filterMsg.merchant_name : '请选择商家'}</p>
                                <span><DownOutline /></span>
                            </div>
                        </div>
                        <div className='select-popup-inner'>
                            <p className='inner-label'>币种</p>
                            <div className='inner-dom' onClick={() => {
                                setSelectPopup({
                                    ...selectPopup,
                                    coin: true
                                })
                            }}>
                                <p>{filterMsg.coin ? filterMsg.coin : '请选择币种'}</p>
                                <span><DownOutline /></span>
                            </div>
                        </div>
                    </div>
                    <div className='filter-input'>
                        <p className='inner-label'>订单号</p>
                        <div className='input-inner'>
                            <input type="text" value={filterMsg.order_id} onChange={(e) => {
                                setFilterMsg({
                                    ...filterMsg,
                                    order_id: e.target.value
                                })
                            }} placeholder='请输入订单号' />
                        </div>
                    </div>
                    <div className='filter-input'>
                        <p className='inner-label'>地址</p>
                        <div className='input-inner'>
                            <input type="text" value={filterMsg.address} onChange={(e) => {
                                setFilterMsg({
                                    ...filterMsg,
                                    address: e.target.value
                                })
                            }} placeholder='请输入地址' />
                        </div>
                    </div>
                    <div className='select-date'>
                        <p className='inner-label'>到账时间</p>
                        <div className='date-dom'>
                            <div className='date-inner' onClick={() => {
                                setSelectPopup({
                                    ...selectPopup,
                                    dateType: 1,
                                    date: true
                                })
                            }}>
                                <p>{filterMsg.start ? filterMsg.start : '开始日期'}</p>
                                <p className='iconfont icon-rili'></p>
                            </div>
                            <div className='date-mask'></div>
                            <div className='date-inner' onClick={() => {
                                setSelectPopup({
                                    ...selectPopup,
                                    dateType: 2,
                                    date: true
                                })
                            }}>
                                <p>{filterMsg.end ? filterMsg.end : '结束日期'}</p>
                                <p className='iconfont icon-rili'></p>
                            </div>
                        </div>
                    </div>
                    <div className='select-date'>
                        <p className='inner-label'>到账金额</p>
                        <div className='date-dom'>
                            <div className='date-inner'>
                                <input type="number" value={filterMsg.min} onChange={(e) => {
                                    setFilterMsg({
                                        ...filterMsg,
                                        min: e.target.value
                                    })
                                }} placeholder='最小金额' />
                            </div>
                            <div className='date-mask'></div>
                            <div className='date-inner'>
                                <input type="number" value={filterMsg.max} onChange={(e) => {
                                    setFilterMsg({
                                        ...filterMsg,
                                        max: e.target.value
                                    })
                                }} placeholder='最大金额' />
                            </div>
                        </div>
                    </div>
                    <div className='filter-input'>
                        <p className='inner-label'>交易HASH</p>
                        <div className='input-inner'>
                            <input type="text" value={filterMsg.hash} onChange={(e) => {
                                setFilterMsg({
                                    ...filterMsg,
                                    hash: e.target.value
                                })
                            }} placeholder='请输入交易HASH' />
                        </div>
                    </div>
                    <div className='oper-btn'>
                        <Button color='default' onClick={() => {
                            setFilterMsg(source)
                        }}>重置</Button>
                        <Button color='primary' onClick={() => {
                            dispatch({
                                type: Type.SET_DEPOSIT_FILTER,
                                payload: {
                                    filter_deposit: JSON.stringify(filterMsg)
                                }
                            });
                            setFilterBox(false)
                        }}>确认</Button>
                    </div>
                </div>
            </Popup>
            {/* 选择商家 */}
            <SelectMerchant value={selectPopup.merchant} merchartResult={(value: string,name:string,email:string) => {
                setFilterMsg({
                    ...filterMsg,
                    merchant: value,
                    merchant_name:name,
                    merchant_email:email
                })
            }} resetValue={(value: boolean) => {
                setSelectPopup({
                    ...selectPopup,
                    merchant: value
                })
            }} />
            {/* 选择币种 */}
            <SelectCoin value={selectPopup.coin} coinResult={(value: string) => {
                setFilterMsg({
                    ...filterMsg,
                    coin: value
                })
            }} resetValue={(value: boolean) => {
                setSelectPopup({
                    ...selectPopup,
                    coin: value
                })
            }} />
            {/* 选择时间 */}
            <SelectDate type={selectPopup.dateType} value={selectPopup.date} dateResult={(value: string) => {
                if (selectPopup.dateType === 1) {
                    setFilterMsg({
                        ...filterMsg,
                        start: value
                    })
                } else {
                    setFilterMsg({
                        ...filterMsg,
                        end: value
                    })
                }
            }} resetValue={(value: boolean) => {
                setSelectPopup({
                    ...selectPopup,
                    date: value
                })
            }} />
        </div>
    )
};

export default FilterDeposit;