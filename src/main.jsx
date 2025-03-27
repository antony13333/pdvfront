import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Pedidos from './Pedidos.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PedidosFinalizados from './PedidosFinalizados.jsx'
import HistoricoNotas from './HistoricoNotas.jsx'
const route = createBrowserRouter([
  {path:"/",
    element: <App/>
  },
  {path:"/Pedidos",
    element: <Pedidos/>
  },
  {path:"/PedidosFinalizados",
    element:<PedidosFinalizados/>
  },
  {path:"/Notas",
    element:<HistoricoNotas/>
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={route} />
  </StrictMode>,
)
