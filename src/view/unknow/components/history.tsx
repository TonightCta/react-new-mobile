
import { DotLoading, InfiniteScroll, List, PullToRefresh } from 'antd-mobile';
import { SearchOutline } from 'antd-mobile-icons';
import { PullStatus } from 'antd-mobile/es/components/pull-to-refresh';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
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
const HistoryList = (props: Porps): ReactElement<ReactNode> => {
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [conTest,setConTest] = useState<ListInter[]>([]);
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
        setConTest(MockData(156))
    }, [props.type]);
    return (
        <div className='list-history'>
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
                                <li key={index}>
                                    <p className='data-time'>{el.date}</p>
                                    <div className='team-msg'>
                                        <p>{el.name}</p>
                                        <p>{el.from}</p>
                                        <p className='vs-label'>VS</p>
                                        <p>{el.to}</p>
                                    </div>
                                    <p className='data-count'>{el.from_count}:{el.to_count}</p>
                                </li>
                            )
                        })
                    }
                </ul>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} >
                    <InfiniteScrollContent hasMore={hasMore}/>
                </InfiniteScroll>
            </PullToRefresh>

        </div>
    )
};

export default HistoryList;