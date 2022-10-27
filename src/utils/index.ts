import { useCallback, useEffect, useRef, useState } from "react";

//日期转换
export const DateConvert = (_time: number, _full: number): string => {
    const date = new Date(_time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const day = date.getDate();
    // const hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
    // const min = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
    // const sec = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds();
    return _full === 1 ? `${month}-${day}` : `${year}-${month}-${day}`
}
export const DateConvertOther = (_time: number, ): string => {
    const date = new Date(_time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const day = date.getDate();
    const hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
    const min = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
    return `${year}/${month}/${day} ${hour}:${min}`
}


//邮箱格式校验
export const CheckEmail = (arg: string): boolean => {
    const rule = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return rule.test(arg);
}
//设置币种Logo
export const SetLogo = (_arr: []): any[] => {
    const list = _arr;
    const out : any[] = [];
    list.forEach((e: { coin: string, logo: string }) => {
        // if(e.coin === 'USDT-TRC20'){
        //     e = {
        //         ...e,
        //         logo: require('../assets/images/coin/usdt_tr.png')
        //     };
        //     console.log(e)
        // }
        switch (e.coin) {
            case 'USDT-TRC20':
                e = {
                    ...e,
                    logo: require('../assets/images/coin/usdt_tr.png')
                }
                out.push(e)
                break;
            case 'USDT-ERC20':
                e = {
                    ...e,
                    logo:require('../assets/images/coin/usdt_er.png')
                };
                out.push(e)
                break;
            case 'BTC':
                e = {
                    ...e,
                    logo:require('../assets/images/coin/btc.png')
                };
                out.push(e)
                break;
            case 'DOGE':
                e = {
                    ...e,
                    logo:require('../assets/images/coin/dog.png')
                };
                out.push(e)
                break;
            case 'ETH':
                e = {
                    ...e,
                    logo:require('../assets/images/coin/eth.png')
                };
                out.push(e)
                break;
            case 'LTC':
                e = {
                    ...e,
                    logo:require('../assets/images/coin/ltc.png')
                };
                out.push(e)
                break;
            case 'TRX':
                e = {
                    ...e,
                    logo:require('../assets/images/coin/trx.png')
                };
                out.push(e)
                break;
            case 'XRP':
                e = {
                    ...e,
                    logo:require('../assets/images/coin/xrp.png')
                };
                out.push(e)
                break;
            case 'SHIB':
                e = {
                    ...e,
                    logo:require('../assets/images/coin/shib.png')
                };
                out.push(e)
                break;
            default:
                e = {
                    ...e,
                    logo:require('../assets/images/coin/default_coin.png')
                }
        }
    });
    return out
};

//倒计时
export const useCountdown = (propsCount: number, callback = () => { }) => {
    const [count, setCount] = useState(propsCount)
    const timer = useRef<NodeJS.Timer>();
    const cbtimer: any = useRef()
    cbtimer.current = () => {
        setCount(count - 1)
    }
    const startTimer = useCallback(() => {
        timer.current = setInterval(() => {
            cbtimer.current()
        }, 1000);
        return count
    }, []);
    useEffect(() => {
        if (count <= 0) {
            callback();
            setCount(propsCount);
            clearInterval(timer.current)
        }
    }, [count])
    useEffect(() => {
        return () => {
            setCount(propsCount);
            clearInterval(timer.current)
        }
    }, []);
    return {
        count,
        startTimer,
    }
};