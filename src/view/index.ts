import React from 'react';
const LoginView = React.lazy(() => import('../view/login/login'));
const OverView = React.lazy(() => import('../view/overview/overview'));
const MerchantView = React.lazy(() => import('../view/merchant/merchant'));
const NotFoundView = React.lazy(() => import('../view/not_found/n_found'));
const FeeIndex = React.lazy(() => import('../view/fee/index'));
const AuthIndex = React.lazy(() => import('../view/google/google_auth'));

export {
    LoginView,
    OverView,
    MerchantView,
    NotFoundView,
    FeeIndex,
    AuthIndex
}