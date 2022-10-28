
import { ReactElement, ReactNode } from 'react';
import AccountCard from './components/account_card';
import BalanceCard from './components/balance_card';
import ChartsCard from './components/charts_card';
import './index.scss'
import { useContext } from 'react';
import { IBPayMobile } from '../../route/router';
import { useEffect } from 'react';
import { Type } from '../../utils/types';

const OverView = (): ReactElement<ReactNode> => {
    const { state, dispatch } = useContext(IBPayMobile);
    const account = JSON.parse(state.account || '{}');
    useEffect(() => {
        return () => {
            dispatch({
                type: Type.SET_MERCHANT,
                payload: {
                    merchant_id: ''
                }
            })
        }
    }, [])
    return (
        <div className='over-view'>
            {/* 账户信息 */}
            <AccountCard />
            {/* 余额信息 */}
            <BalanceCard />
            {/* 图表数据 */}
            <ChartsCard />
        </div>
    )
};

export default OverView;