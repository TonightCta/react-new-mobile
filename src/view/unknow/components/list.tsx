
import { DotLoading, InfiniteScroll, List, PullToRefresh } from 'antd-mobile';
import { RightOutline, SearchOutline } from 'antd-mobile-icons';
import { PullStatus } from 'antd-mobile/es/components/pull-to-refresh';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { ReactElement, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useContext } from 'react';
import { IBPayMobile } from '../../../route/router';
import { Type } from '../../../utils/types';
import { useEffect } from 'react';
import { MockData } from '../../../utils/mock'

interface Porps {
    type: number
}

export interface ListInter {
    name: string,
    date: string,
    from: string,
    to: string,
    from_icon: string,
    to_icon: string,
    number: number,
    from_count: number,
    to_count: number,
}
const loadMore = async () => {
    await sleep(1000);
}

const statusRecord: Record<PullStatus, string> = {
    pulling: 'Pull hard',
    canRelease: 'Let go',
    refreshing: 'Loading...',
    complete: 'Done',
}
const ListMine = (props: Porps): ReactElement<ReactNode> => {
    const [hasMore, setHasMore] = useState<boolean>(false);
    const navigate = useNavigate();
    const { dispatch } = useContext(IBPayMobile);
    const [conTest, setConTest] = useState<ListInter[]>([]);
    const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
        return (
            <>
                {hasMore ? (
                    <>
                        <span>Loading</span>
                        <DotLoading />
                    </>
                ) : (
                    <span>--- No more ---</span>
                )}
            </>
        )
    }
    useEffect(() => {
        setConTest(MockData(props.type))
    }, [props.type]);
    return (
        <div className='list-public'>
            <div className='search-list'>
                <input type="number" placeholder='Type here numbering' />
                <span><SearchOutline /></span>
            </div>
            <PullToRefresh
                onRefresh={async () => {
                    await sleep(1000)
                }}
                renderText={status => {
                    return <div style={{ fontSize: 14 }}>{statusRecord[status]}</div>
                }}
            >
                <ul>
                    {
                        conTest.map((el: ListInter, index: number): ReactElement => {
                            return (
                                <li key={index} onClick={() => {
                                    // /market-detail
                                    dispatch({
                                        type: Type.SET_MARKET,
                                        payload: {
                                            market: JSON.stringify(el)
                                        }
                                    })
                                    navigate('/market-detail')
                                }}>
                                    <div className='list-title'>
                                        <p>{el.name}</p>
                                        <p>{el.date}</p>
                                    </div>
                                    <div className='vs-msg'>
                                        <div className='left-msg'>
                                            <p>
                                                <img src={el.from_icon} alt="" />
                                                {el.from}
                                            </p>
                                            <p>VS</p>
                                            <p>
                                                <img src={el.to_icon} alt="" />
                                                {el.to}
                                            </p>
                                        </div>
                                        <div className='right-view'>
                                            <p><RightOutline /></p>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} >
                    <InfiniteScrollContent hasMore={hasMore} />
                </InfiniteScroll>
            </PullToRefresh>

        </div>
    )
};

export default ListMine;