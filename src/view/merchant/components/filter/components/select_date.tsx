
import { DatePicker } from 'antd-mobile';
import { ReactElement, ReactNode, useState } from 'react';
import { useEffect } from 'react';
import { DateConvert } from '../../../../../utils';

interface Props {
    value: boolean,
    type:number,
    dateResult: (date: string) => void,
    resetValue: (value: boolean) => void,
};

const now = new Date()

const SelectDate = (props: Props): ReactElement<ReactNode> => {
    const [visible, setVisible] = useState<boolean>(false);
    useEffect(() => {
        setVisible(props.value)
    }, [props.value]);
    const closePopup = () => {
        setVisible(false);
        props.resetValue(false)
    }
    return (
        <div className='select-date'>
            <DatePicker
                title={`${props.type === 1 ? '开始日期' :'结束日期'}`}
                visible={visible}
                onClose={() => {
                    closePopup()
                }}
                max={now}
                onConfirm={val => {
                    props.dateResult(DateConvert(new Date(val).getTime(), 2))
                }}
            />
        </div>
    )
};

export default SelectDate;