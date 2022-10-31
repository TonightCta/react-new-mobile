
import { Button, Toast } from 'antd-mobile';
import { ReactElement, ReactNode, useState,useContext,useEffect } from 'react';
import { GoogleAuthApi, GoogleAuthBindApi, MerchantInfoApi } from '../../request/api'
import { Type } from '../../utils/types';
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode.react';
import './index.scss'
import { useNavigate } from 'react-router-dom';
import { IBPayMobile } from '../../route/router';

const AuthIndex = (): ReactElement<ReactNode> => {
    const [authCode, setCode] = useState<number | string>('');
    const [googleCode, setGooleCode] = useState<{ qr: string, text: string }>({
        qr: '',
        text: ''
    })
    const { dispatch } = useContext(IBPayMobile);
    const setQR = async () => {
        const result = await GoogleAuthApi({});
        const { data } = result;
        setGooleCode({
            qr: data.qrcode,
            text: data.secret
        });
    }
    useEffect(() => {
        setQR();
        return () => {
            setGooleCode({
                qr: '',
                text: ''
            })
        }
    }, [])
    const navigate = useNavigate()
    return (
        <div className='auth-index'>
            <div className='auth-name'>
                <p className='iconfont icon-shouqi' onClick={() => {
                    navigate('/');
                }}></p>
                <p>设置谷歌认证</p>
                <p className='iconfont icon-shouqi'></p>
            </div>
            <div className='step-public'>
                <div className='step-index'>
                    Step 1
                </div>
                <p className='remark-text'>根据您的手机系统类型，下载并安装谷歌身份验证器</p>
                <div className='tools-box'>
                    <div className='down-tools'>
                        <p className='tools-name'>Android：</p>
                        <ul>
                            <li>
                                <p className='iconfont icon-android'></p>
                                <p>安卓本地下载</p>
                            </li>
                            <li>
                                <p className='iconfont icon-a-googleplay'></p>
                                <p>Google Play</p>
                            </li>
                        </ul>
                    </div>
                    <div className='down-tools'>
                        <p className='tools-name'>iOS：</p>
                        <ul>
                            <li>
                                <p className='iconfont icon-iOS'></p>
                                <p>iOS下载</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='step-public'>
                <div className='step-index'>
                    Step 2
                </div>
                <p className='remark-text'>
                    使用谷歌身份认证器APP扫描一下二维码，或添加密文进行手工验证
                </p>
                <div className='qr-box'>
                    <QRCode value={googleCode.qr} size={105} id="qrCode" />
                    <div className='qr-text'>
                        <p className='text-content'>密文：{googleCode.text}</p>
                        <div className='reload-code'>
                            <p>
                                <span className='iconfont icon-fuzhi' onClick={() => {
                                    copy(googleCode.text);
                                    Toast.show('复制成功')
                                }}></span>
                            </p>
                            <p>
                                <span className='iconfont icon-shuaxin' onClick={() => { setQR() }}></span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='step-public'>
                <div className='step-index'>
                    Step 3
                </div>
                <p className='remark-text'>
                    填写手机显示的动态密码以激活谷歌两步验证
                </p>
                <div className='inp-code'>
                    <input type="number" value={authCode} onChange={(e) => {
                        setCode(e.target.value)
                    }} placeholder='请输入动态密码' />
                </div>
            </div>
            <div className='submit-btn'>
                <Button color='primary' block onClick={async () => {
                    if (!authCode) {
                        Toast.show('请输入动态密码');
                        return
                    };
                    const result = await GoogleAuthBindApi({
                        code: authCode
                    });
                    const { code } = result;
                    if (code !== 200) {
                        Toast.show(result.message);
                        return;
                    };
                    Toast.show('绑定成功');
                    const info = await MerchantInfoApi({});
                    dispatch({
                        type: Type.SET_ACCOUNT,
                        payload: {
                            account: JSON.stringify(info.data)
                        }
                    });
                    navigate('/');
                }}>启用</Button>
            </div>
        </div>
    )
};

export default AuthIndex;