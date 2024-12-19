import { Outlet } from 'react-router-dom';
import './App.css';
import { ModalManager } from './components';

function App() {
  return (
    <>
      <Outlet />
      <ModalManager />
    </>
  );
}

export default App;
