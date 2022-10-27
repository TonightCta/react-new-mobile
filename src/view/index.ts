import React from 'react';
const LoginView = React.lazy(() => import('../view/login/login'));
const OverView = React.lazy(() => import('../view/overview/overview'));
const MerchantView = React.lazy(() => import('../view/merchant/merchant'));
const NotFoundView = React.lazy(() => import('../view/not_found/n_found'));
const UnKnow = React.lazy(() => import('../view/unknow/index'));
const MarketDetail = React.lazy(() => import('../view/unknow/detail/detail'));
const FeeIndex = React.lazy(() => import('../view/fee/index'))

export {
    LoginView,
    OverView,
    MerchantView,
    NotFoundView,
    UnKnow,
    MarketDetail,
    FeeIndex
}