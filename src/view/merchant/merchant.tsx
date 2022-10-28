
import { ReactElement, ReactNode } from 'react';
import DepositList from './components/deposit';
import WithdrawList from './components/withdraw';
import { IBPayMobile } from '../../route/router';
import './index.scss'
import { useContext } from 'react';
import { Type } from '../../utils/types';
import FilterWithdraw from './components/filter/filter_withdraw';
import FilterDeposit from './components/filter/filter_deposit';
import { useState } from 'react';

const MerchantView = (): ReactElement<ReactNode> => {
    const { state, dispatch } = useContext(IBPayMobile);
    const [activeTab, setActiveTab] = useState<string>('1');
    const upDateTabStatus = (__type: number) => {
        dispatch({
            type: Type.SET_WITHDRAW_FILTER,
            payload: {
                filter_withdraw: ''
            }
        })
        dispatch({
            type: Type.SET_DEPOSIT_FILTER,
            payload: {
                filter_deposit: ''
            }
        });
        dispatch({
            type: Type.SET_LIST_TYPE,
            payload: {
                list_type: __type
            }
        })
    }
    return (
        <div className='merchant-view'>
            <div className='tabs-mine'>
                <div className='tabs-service'>
                    <ul>
                        <li className={`${activeTab === '1' ? 'active-tab' : ''}`} onClick={() => {
                            upDateTabStatus(1);
                            setActiveTab('1')
                        }}>
                            提币订单
                        </li>
                        <li className={`${activeTab === '2' ? 'active-tab' : ''}`} onClick={() => {
                            upDateTabStatus(2)
                            setActiveTab('2')
                        }}>
                            充币订单
                        </li>
                    </ul>
                    <div className='filter-box'>
                        {state.list_type === 1 ? <FilterWithdraw /> : <FilterDeposit />}
                    </div>
                </div>
                {
                    state.list_type === 1 ? <WithdrawList /> : <DepositList />
                }
            </div>
        </div>
    )
};

export default MerchantView;