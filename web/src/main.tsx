import './index.css'
import React from 'react'
import { router } from './routes';
import { store } from './redux/store';
import { Provider } from "react-redux";
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
)
