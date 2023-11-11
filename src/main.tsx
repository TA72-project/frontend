import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/loginPage/loginPage.tsx";
import pages from './datas/pages.tsx';
import { AuthProvider } from './components/template/authProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            {pages.map((element)=>(
                <Route key={element.text} path={"/"+element.path} element={element.element}/>
            ))}
          <Route path="/" element={<LoginPage/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
