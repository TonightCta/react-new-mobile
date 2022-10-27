import { createContext, ReactElement, ReactNode, Suspense, useReducer } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import App from '../App';
import RouteLoading from '../components/n-loading';
import { defaultContext, defaultState, defaultStateInit, initState } from '../reducer';
import { Context } from '../utils/types';
import * as View from '../view/index';

export const IBPayMobile = createContext<Context>(defaultContext);

const RouteConfig = (): ReactElement<ReactNode> => {
    const [state, dispatch] = useReducer(initState, defaultState, defaultStateInit);
    return (
        <HashRouter>
            <IBPayMobile.Provider value={{ state, dispatch }}>
                <Routes>
                    <Route path='/' element={<App />}>
                        {/* 概览 */}
                        <Route index element={<Suspense fallback={<RouteLoading />}>
                            <View.OverView />
                        </Suspense>}></Route>
                        {/* 利润/余额 */}
                        <Route path='/fee' element={<Suspense fallback={<RouteLoading />}>
                            <View.FeeIndex />
                        </Suspense>}></Route>
                        {/* 商户 */}
                        <Route path='/merchant' element={<Suspense fallback={<RouteLoading />}>
                            <View.MerchantView />
                        </Suspense>}></Route>
                    </Route>
                    {/* 登录 */}
                    <Route path='/login' element={<Suspense fallback={<RouteLoading />}>
                        <View.LoginView />
                    </Suspense>} />
                    {/* 404 */}
                    <Route path='*' element={<Suspense fallback={<RouteLoading />}>
                        <View.NotFoundView />
                    </Suspense>} />
                    {/* Unknow */}
                    {/* <Route path='/' element={<Suspense fallback={<RouteLoading />}>
                        <View.UnKnow />
                    </Suspense>} />
                    <Route path='/market-detail' element={<Suspense fallback={<RouteLoading />}>
                        <View.MarketDetail />
                    </Suspense>} /> */}
                </Routes>
            </IBPayMobile.Provider>
        </HashRouter>
    )
};

export default RouteConfig;