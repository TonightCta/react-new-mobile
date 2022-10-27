
import { ReactElement, ReactNode, Fragment, useEffect } from 'react';
import 'nprogress/nprogress.css'
const nprogress = require('nprogress');

const RouteLoading = (): ReactElement<ReactNode> => {
    useEffect(() => {
        nprogress.start();
        return () => {
            nprogress.done();
        }
    }, [])
    return (
        <Fragment></Fragment>
    )
};

export default RouteLoading;