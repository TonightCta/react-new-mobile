
import { Badge, Tabs } from 'antd-mobile';
import { ReactElement, ReactNode } from 'react';
import List from './components/list';
import './index.scss'
import HistoryList from './components/history';

const UnKnow = (): ReactElement<ReactNode> => {
    return (
        <div className='unknow-index'>
            <div className='index-title'>
                Market
                <img src={require('../../assets/images/custormer.png')} alt="" />
            </div>
            <div className=''>
                <Tabs>
                    <Tabs.Tab title={
                        <Badge content='20' style={{ '--right': '-14px', '--top': '8px' }}>
                            Today
                        </Badge>
                    } key='1'>
                        <List type={1} />
                    </Tabs.Tab>
                    <Tabs.Tab title={
                        <Badge content='99+' style={{ '--right': '-24px', '--top': '8px' }}>
                            History
                        </Badge>
                    } key='2'>
                        <HistoryList type={2}/>
                    </Tabs.Tab>
                </Tabs>
            </div>
        </div>
    )
};


export default UnKnow;