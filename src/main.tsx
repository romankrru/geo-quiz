import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'

import { router } from './router'

import 'normalize.css'
import './shared/theme/vars.css.ts'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  </StrictMode>,
)
