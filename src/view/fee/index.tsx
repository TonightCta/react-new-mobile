
import { ReactElement, ReactNode } from 'react';
import FilterFee from './components/filter';
import FeeList from './components/list';
import './index.scss'

const FeeIndex = (): ReactElement<ReactNode> => {
    return (
        <div className='fee-index merchant-view'>
            <div className='fee-nav'>
                <p className='nav-name'>利润/余额提取</p>
                <div className='filter-box'>
                    <FilterFee />
                </div>
            </div>
            <div className='tabs-mine'>
                <FeeList />
            </div>
        </div>
    )
};

export default FeeIndex;