
import { ReactElement, ReactNode } from 'react';
import FilterFee from './filter';

const FeeNav = (): ReactElement<ReactNode> => {
    return (
        <div className='merchant-nav'>
            <p>余额/利润提取</p>
            <FilterFee/>
        </div>
    )
};
export default FeeNav;