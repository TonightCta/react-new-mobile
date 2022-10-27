import './App.scss';
import { ReactElement } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { IBPayMobile } from './route/router';
import { useContext } from 'react';
import NavBottom from './components/nav/nav';

const App = (): ReactElement => {
  const { state } = useContext(IBPayMobile);
  return (
    <div className="App">
      {
        state.app_token
          ? <div className='private-route'>
              <div className='router-view'>
                <Outlet />
              </div>
              <NavBottom />
            </div>
          : <Navigate to='/login' />
      }
    </div>
  );
}

export default App;
