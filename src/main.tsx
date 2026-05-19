import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app.tsx'
import './index.css'
import RootLayout from './layout.tsx'
import { BrowserRouter, Route, Routes } from "react-router";
import { LayoutPages } from './layout-pages.tsx'
import { Welcome } from './pages/welcome.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route element={<LayoutPages />}>
            <Route path="/welcome" element={<Welcome />} />
          </Route>
          <Route path="/" element={<App />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  </StrictMode>,
)
