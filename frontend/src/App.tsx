import { Outlet } from 'react-router-dom';
import './App.css';
import { ModalManager } from './private/Dashboard/components/Modal/ModalManager';

function App() {
  return (
    <>
      <Outlet />
      <ModalManager />
    </>
  );
}

export default App;
