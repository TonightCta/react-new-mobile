
import { ReactElement, ReactNode } from 'react';
import FeeList from './components/list';
import FeeNav from './components/nav';
import './index.scss'

const FeeIndex = (): ReactElement<ReactNode> => {
    return (
        <div className='fee-index merchant-view'>
            <FeeNav/>
            <div className='tabs-mine'>
                <FeeList />
            </div>
        </div>
    )
};

export default FeeIndex;