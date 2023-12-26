import React from 'react'
import './assets/index.css'
import { router } from './lib/routes';
import { store } from './redux/store';
import { Provider } from "react-redux";
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "@tanstack/react-router";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
