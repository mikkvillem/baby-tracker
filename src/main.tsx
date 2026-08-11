import { render } from 'preact'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import './store/theme'

render(<RouterProvider router={router} />, document.getElementById('app')!)
