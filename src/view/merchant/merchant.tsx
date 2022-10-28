
import { Tabs } from 'antd-mobile';
import { ReactElement, ReactNode } from 'react';
import DepositList from './components/deposit';
import MerchantNav from './components/nav';
import WithdrawList from './components/withdraw';
import { IBPayMobile } from '../../route/router';
import './index.scss'
import { useContext } from 'react';
import { Type } from '../../utils/types';

const MerchantView = (): ReactElement<ReactNode> => {
    const { state, dispatch } = useContext(IBPayMobile);
    return (
        <div className='merchant-view'>
            {/* <MerchantNav state={state} /> */}
            <div className='tabs-mine'>
                <Tabs onChange={(e) => {
                    dispatch({
                        type:Type.SET_WITHDRAW_FILTER,
                        payload:{
                            filter_withdraw:''
                        }
                    })
                    dispatch({
                        type:Type.SET_DEPOSIT_FILTER,
                        payload:{
                            filter_deposit:''
                        }
                    })
                    dispatch({
                        type: Type.SET_LIST_TYPE,
                        payload: {
                            list_type: Number(e)
                        }
                    })
                }} defaultActiveKey={String(state.list_type)} style={{ '--title-font-size': '14px' }}>
                    <Tabs.Tab title='提币订单' key='1'>
                        <WithdrawList />
                    </Tabs.Tab>
                    <Tabs.Tab title='充币订单' key='2'>
                        <DepositList />
                    </Tabs.Tab>
                </Tabs>
            </div>
        </div>
    )
};

export default MerchantView;