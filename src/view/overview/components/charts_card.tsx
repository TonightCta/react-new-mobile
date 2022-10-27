
import { DatePicker, Popover, Toast } from 'antd-mobile';
import { Action } from 'antd-mobile/es/components/action-sheet';
import { ReactElement, ReactNode, useState } from 'react';
import * as echarts from 'echarts';
import html2canvas from 'html2canvas';
import { useEffect } from 'react';
import dayjs from 'dayjs'
import { DateConvert } from '../../../utils';
import { useContext } from 'react';
import { IBPayMobile } from '../../../route/router';
import { BillViewApi } from '../../../request/api';

const today = dayjs();
const now = new Date(today.subtract(7, 'day').toDate());

const ChartsCard = (): ReactElement<ReactNode> => {
    const { state } = useContext(IBPayMobile);
    const [coin, setCoin] = useState<string>('TRX');
    const [actions, setAction] = useState<Action[]>([
        { key: 'trx', text: 'TRX' },
        { key: 'usdt', text: 'USDT-TRC20' },
    ])
    const [selectDateBoxStart, setSelectBoxStart] = useState<boolean>(false);
    const [selectDateBoxEnd, setSelectBoxEnd] = useState<boolean>(false);
    const [filterDate, setFilterDate] = useState<{ start: string, end: string }>({
        start: '',
        end: ''
    });
    const billViewService = async () => {
        const { merchant_id,account } = state;
        const result = await BillViewApi({
            mch_id: merchant_id || JSON.parse(account || '{}')?.merchantInfo.mch_id,
            coin: coin,
            start: filterDate.start,
            end: filterDate.end
        });
        const { data } = result;
        const date = data.deposits.map((item: { date: string; }) => {
            return item.date.substring(5,10);
        });
        const deposits = data.deposits.map((item: { total: string; }) => {
            return item.total;
        });
        const withdraw = data.withdraw.map((item: { total: string; }) => {
            return item.total;
        });
        const userDeposits = data.userDeposits.map((item: { total: string; }) => {
            return item.total;
        });
        const userWithdraw = data.userWithdraw.map((item: { total: string; }) => {
            return item.total;
        });
        initEcharts(date,deposits,withdraw,userDeposits,userWithdraw)
    }
    //下载echarts
    const downEcharts = () => {
        html2canvas(document.getElementById("charts-box") as HTMLElement).then(
            (canvas) => {
                const img = canvas
                    .toDataURL("image/png")
                    .replace("image/png", "image-octet/stream");
                const downImg = document.createElement("a");
                downImg.download = "经营概况.png";
                downImg.href = img;
                document.body.appendChild(downImg);
                downImg.click();
                downImg.remove();
            }
        );
    };
    const initEcharts = (date:[],deposits:[],withdraw:[],userDeposits:[],userWithdraw:[]) => {
        const option = {
            tooltip: {
                trigger: "axis",
                formatter: (params: any) => {
                    let result = "";
                    params.forEach((e: any) => {
                        result +=
                            `<div style="margin-top:12px;display:flex;justify-content: space-between;"><div style="display:flex;"><p style="transform:scale(0.7);">${e.marker}</p>` +
                            `<p>${e.seriesName}</p></div>` +
                            `<p style="margin-left:16px;">${Number(e.value).toFixed(
                                4
                            )}&nbsp;${coin === "TRX" ? coin : "U"
                            }</p></div>`;
                    });
                    return params[0].name + result;
                },
            },
            legend: {
                data: [
                    "商户充值",
                    "商户提币",
                    "用户提币",
                    "用户充值",
                ],
                icon: "circle",
                itemWidth: 6,
                itemGap: 9,
                top: '4%',
                textStyle: {
                    fontSize: 12,
                    color: "#999",
                },
            },
            grid: {
                left: "3%",
                right: "6%",
                bottom: "4%",
                top: '20%',
                containLabel: true,
            },
            xAxis: [
                {
                    type: "category",
                    boundaryGap: false,
                    data: date,
                    axisTick: false,
                    offset: 10,
                    axisLabel: {
                        color: "#999999",
                        fontSize: 12,
                    },
                    axisLine: false,
                },
            ],
            yAxis: [
                {
                    alignTicks: true,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#F5F5FC",
                            width: 2,
                        },
                    },
                    axisLabel: {
                        color: "#999999",
                    },
                    splitLine: false,
                },
            ],
            series: [
                {
                    name: "商户充值",
                    type: "line",
                    stack: "Total",
                    itemStyle: {
                        color: "rgb(101,220,123)",
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "rgba(101,220,123,.3)",
                            },
                            {
                                offset: 1,
                                color: "rgba(101,220,123,.1)",
                            },
                        ]),
                    },
                    emphasis: {
                        focus: "series",
                    },
                    data: deposits,
                },
                {
                    name: "商户提币",
                    type: "line",
                    stack: "Total",
                    itemStyle: {
                        color: "rgb(76,227,249)",
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "rgba(76,227,249,.3)",
                            },
                            {
                                offset: 1,
                                color: "rgba(76,227,249,0.1)",
                            },
                        ]),
                    },
                    emphasis: {
                        focus: "series",
                    },
                    data: withdraw,
                },
                {
                    name: "用户提币",
                    type: "line",
                    stack: "Total",
                    itemStyle: {
                        color: "rgb(255,212,130)",
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "rgba(255,212,130,.4)",
                            },
                            {
                                offset: 1,
                                color: "rgba(255,212,130,0.2)",
                            },
                        ]),
                    },
                    emphasis: {
                        focus: "series",
                    },
                    data: userWithdraw,
                },
                {
                    name: "用户充值",
                    type: "line",
                    stack: "Total",
                    itemStyle: {
                        color: "rgb(107,128,251)",
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "rgba(107,128,251,.3)",
                            },
                            {
                                offset: 1,
                                color: "rgba(107,128,251,0.1)",
                            },
                        ]),
                    },
                    emphasis: {
                        focus: "series",
                    },
                    data: userDeposits,
                },
            ],
        };
        let chartsBox = echarts.getInstanceByDom(document.getElementById('charts-box') as HTMLElement);
        if (!chartsBox) {
            chartsBox = echarts.init(document.getElementById('charts-box') as HTMLElement);
        };
        chartsBox.setOption(option);
    }
    useEffect(() => {
        billViewService();
    }, [coin, filterDate.start,filterDate.end,state.merchant_id]);
    useEffect(() => {
        const { account } = state;
        const support = JSON.parse(account || '{}').coinStatementList.map((item: { asset: any; }) => {
            return {
                key: item.asset,
                text: item.asset
            }
        });
        setAction(support)
    }, [])
    return (
        <div className='charts-card'>
            <div className='charts-title-msg'>
                <p className='msg-name'>经营概况</p>
                <div className='oper-box'>
                    <div className='select-date other-padding' onClick={() => {
                        setSelectBoxStart(true)
                    }}>
                        <p className={`date-text ${!filterDate.end ? 'holder-text' : ''}`}>{filterDate.end ? filterDate.start : '开始时间'}</p>
                        <p className='mask-'>-</p>
                        <p className={`date-text ${!filterDate.end ? 'holder-text' : ''}`}>{filterDate.end ? filterDate.end : '结束时间'}</p>
                        <p className='iconfont icon-rili'></p>
                    </div>
                    <Popover.Menu
                        actions={actions.map(action => ({
                            ...action,
                            icon: null,
                        }))}
                        onAction={(node: any) => {
                            setCoin(node.text)
                        }}
                        placement='bottomLeft'
                        trigger='click'
                    >
                        <div className='select-coin'>
                            <p>{coin}</p>&nbsp;<p className='iconfont icon-xialajiantouxiaobeifen'></p>
                        </div>
                    </Popover.Menu>
                    <div className='select-date down-charts' onClick={() => { downEcharts() }}>
                        <p className='iconfont icon-cangpeitubiao_xiazaipandiandanxiazaidayinmoban'></p>
                    </div>
                </div>
            </div>
            <div className='charts-box' id="charts-box"></div>
            {/* 选择日期 - 开始时间 */}
            <DatePicker
                title='开始时间'
                visible={selectDateBoxStart}
                onClose={() => {
                    setSelectBoxStart(false)
                }}
                precision="day"
                max={now}
                onConfirm={val => {
                    setSelectBoxStart(false)
                    setSelectBoxEnd(true)
                    setFilterDate({
                        ...filterDate,
                        start: DateConvert(new Date(val).getTime(), 1)
                    })
                }}
            />
            <DatePicker
                title='结束时间'
                visible={selectDateBoxEnd}
                onClose={() => {
                    setSelectBoxEnd(false)
                }}
                precision="day"
                max={new Date()}
                onConfirm={val => {
                    Toast.show(val.toDateString());
                    setFilterDate({
                        ...filterDate,
                        end: DateConvert(new Date(val).getTime(), 1)
                    })
                }}
            />
        </div>
    )
};

export default ChartsCard;