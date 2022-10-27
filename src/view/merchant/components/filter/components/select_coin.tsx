
import { Popup } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { ReactElement, ReactNode, useState } from 'react';
import { useEffect } from 'react';
import '../index.scss'
import { useContext } from 'react';
import { IBPayMobile } from '../../../../../route/router';
import { SetLogo } from '../../../../../utils/index'

interface Props {
    value: boolean,
    coinResult: (value: string) => void,
    resetValue: (value: boolean) => void
}

interface Coin{
    coin:string,
    logo:string
}

const SelectCoin = (props: Props): ReactElement<ReactNode> => {
    const [visible, setVisible] = useState<boolean>(false);
    const { state } = useContext(IBPayMobile);
    const [coin,setCoin] = useState<Coin[]>([]) 
    useEffect(() => {
        const { coinStatementList } = JSON.parse(state.account || '{coinStatementList:[]}');
        const list = coinStatementList.map((item: { asset: string; }) => {
            return {
                ...item,
                coin: item.asset
            }
        });
        setCoin(SetLogo(list))
    }, [])
    useEffect(() => {
        setVisible(props.value)
    }, [props.value]);
    const closePopup = () => {
        props.resetValue(false);
        setVisible(false)
    }
    return (
        <div className='select-coin-parent'>
            <Popup visible={visible} onMaskClick={() => {
                closePopup()
            }}>
                <div className='select-merchant select-coin'>
                    <p className='merchant-title'>
                        选择币种
                        <CloseOutline onClick={() => {
                            closePopup()
                        }} />
                    </p>
                    <ul>
                        {
                            coin.map((item: Coin, index: number): ReactElement => {
                                return (
                                    <li key={index} onClick={() => {
                                        props.coinResult(item.coin);
                                        closePopup();
                                    }}>
                                        <img src={item.logo} alt="" />
                                        <p>{item.coin}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </Popup>
        </div>
    )
};

export default SelectCoin;