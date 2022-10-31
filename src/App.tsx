import './App.scss';
import { ReactElement } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { IBPayMobile } from './route/router';
import { useContext } from 'react';
import NavBottom from './components/nav/nav';
import { useEffect } from 'react';

const App = (): ReactElement => {
  const { state } = useContext(IBPayMobile);
  const location = useLocation();
  return (
    <div className="App">
      {
        state.app_token
          ? <div className='private-route'>
              <div className='router-view'>
                <Outlet />
              </div>
              {location.pathname !== '/google-auth' && <NavBottom />}
            </div>
          : <Navigate to='/login' />
      }
    </div>
  );
}

export default App;
