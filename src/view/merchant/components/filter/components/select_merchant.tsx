
import { Popup } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { ReactElement, ReactNode, useState } from 'react';
import { MerchantListApi } from '../../../../../request/api'
import { useEffect } from 'react';
import '../index.scss'

interface Props {
    value: boolean,
    merchartResult?: (merchant: string, name: string, email: string) => void,
    resetValue: (value: boolean) => void,
    selectMerchant?: (merchant: any) => void;
}


interface Merchant {
    name: string,
    email: string,
    id: string,
    last_login_time: string,
    is_admin: boolean
}

interface Source {
    last_login_time: string,
    name: string,
    email: string,
    mch_id: string;
    is_admin: number
}

const SelectMerchant = (props: Props): ReactElement<ReactNode> => {
    const [visible, setVisible] = useState<boolean>(false);
    useEffect(() => {
        setVisible(props.value)
    }, [props.value]);
    const closePopup = () => {
        setVisible(false);
        props.resetValue(false);
    };
    useEffect(() => {
        merchentListService();
        return () => {
            setMerchantList([])
        }
    }, [])
    // const merchantList: string[] = [
    //     '海绵宝宝',
    //     '派大星',
    //     '蟹老板',
    //     '姗蒂',
    //     '章鱼哥'
    // ];
    const [merchantList, setMerchantList] = useState<Merchant[]>([]);

    const merchentListService = async () => {
        const result = await MerchantListApi({
            limit: 200,
            page: 1
        });
        const { data } = result;
        setMerchantList(data.list.map((item:Source) => {
            return {
                name: item.name,
                email: item.email,
                id: item.mch_id,
                last_login_time: item.last_login_time,
                is_admin:item.is_admin === 1 ? true : false 
            }
        }));
    };

    return (
        <div>
            <Popup visible={visible} onMaskClick={() => {
                closePopup()
            }}>
                <div className='select-merchant'>
                    <p className='merchant-title'>
                        选择商家
                        <CloseOutline onClick={() => {
                            closePopup()
                        }} />
                    </p>
                    {/* <div className='search-inp'>
                        <input type="text" placeholder='请输入商家名称' />
                        <span><SearchOutline /></span>
                    </div> */}
                    <ul>
                        {
                            merchantList.map((item: Merchant, index: number): ReactElement => {
                                return (
                                    <li key={index} onClick={() => {
                                        props.selectMerchant && props.selectMerchant(item)
                                        props.merchartResult && props.merchartResult(item.id, item.name, item.email);
                                        closePopup();
                                    }}>
                                        <p>{item.name}({item.email})</p>
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

export default SelectMerchant;