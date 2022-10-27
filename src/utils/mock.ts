import { ListInter } from '../view/unknow/components/list'
export const MockData = (_type:number): ListInter[] => {

    // 球队
    const pairList = [
        {
            name: 'PSIM Yogyakarta',
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/4235.png',
        },
        {
            name: "Hapoel Bik'at HaYarden",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/6147.png',
        },
        {
            name: "Dimona",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/6142.png',
        },
        {
            name: "Persekat",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/6142.png',
        },
        {
            name: "Bà Ria Vũng Tàu",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/13270.png',
        },
        {
            name: "Daejeon Korail",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/7068.png',
        },
        {
            name: "Cheonan City",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/7060.png',
        },
        {
            name: "Changwon City",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/7059.png',
        },
        {
            name: "South Korea",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/17.png',
        },
        {
            name: "Costa Rica",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/29.png',
        },
        {
            name: "Can Tho",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/9169.png',
        },
        {
            name: "Long An",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/9165.png',
        },
        {
            name: "Beitar Tel Aviv Ramla",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/4480.png',
        },
        {
            name: "Maccabi Shaarayim",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/4506.png',
        },
        {
            name: "PSCS Cilacap",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/4233.png',
        },
        {
            name: "Persegres Gresik United",
            icon: 'https://pbfb.oss-us-east-1.aliyuncs.com/teams/15800.png',
        },
    ];
    const nameOption = ['Liga 2', 'V.League 2', 'K3 League', 'Friendlies', 'Liga Alef', 'League One', 'Premier League Cup', 'Reserve League', 'Serie D - Girone A', 'III Liga - Group 2', '3. liga - MSFL']
    //生成从minNum到maxNum的随机数
    const randomNum = (minNum: number, maxNum: number) => {
        return parseInt(String(Math.random() * (maxNum - minNum + 1) + minNum), 10);
    };
    
    const parseTime = (time:any, cFormat:string) : string => {
        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
                time = parseInt(time)
            }
            if ((typeof time === 'number') && (time.toString().length === 10)) {
                time = time * 1000
            }
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            let value = formatObj[key as keyof typeof formatObj];
            if (key === 'a') {
                return ['日', '一', '二', '三', '四', '五', '六'][value]
            }
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
    }
    //随机日期
    const randomDate = (type:number) : string => {
        // 1 = 今天，随机时间
        // 2 = 最近一个月 , 全随机
        let start = new Date()
        const end = new Date()
        if (type === 1){
            start = new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate(), 1)
        }else{
            let currentYear =  new Date().getFullYear()
            let currentMonth =  new Date().getMonth()
            let currentDate =  new Date().getDate()
            let currentHours =  new Date().getHours()
            if (currentMonth === 0){
                currentYear = currentYear - 1
                currentMonth = 11
            }
            start = new Date(currentYear,currentMonth, randomNum(1,currentDate), randomNum(0,currentHours))
    
        }
        return parseTime(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),'{y}/{m}/{d} {h}:{i}');
    };
    let len = _type === 1 ? 20 : 123;
    let dataList = [];
    const nameLen = nameOption.length
    const pairLen = pairList.length
    for (let i = 0; i < len; i++) {
        const nameIndex = randomNum(0, nameLen - 1);
        const fromIndex = randomNum(0, pairLen - 1);
        let toIndex = fromIndex;
        if (fromIndex === pairLen - 1) {
            toIndex = 0;
        }
        toIndex += 1;
        dataList.push(
            {
                name: nameOption[nameIndex],
                date:randomDate(_type),
                from: pairList[fromIndex].name,
                to: pairList[toIndex].name,
                from_icon: pairList[fromIndex].icon,
                to_icon: pairList[toIndex].icon,
                from_count: Math.floor(Math.random() * 3) + 1,
                to_count: Math.floor(Math.random() * 3) + 1,
                number: randomNum((fromIndex + 1) * 1000, (fromIndex + 1) * 100000),
            }
        )
    };
    return dataList;
}