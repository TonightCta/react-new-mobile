
import { ReactElement, ReactNode } from 'react';
import { State } from '../../../utils/types';
import FilterDeposit from './filter/filter_deposit';
import FilterWithdraw from './filter/filter_withdraw';

const MerchantNav = (props: { state: State }): ReactElement<ReactNode> => {
    return (
        <div className='merchant-nav'>
            <p>{`商家${props.state.list_type === 1 ? '提币' : '充币'}订单`}</p>
            {
                props.state.list_type === 1 ? <FilterWithdraw /> : <FilterDeposit />
            }
        </div>
    )
};
export default MerchantNav;