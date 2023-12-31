import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage/loginPage.tsx";
import pages from "./datas/pages.tsx";
import { AuthProvider } from "./context/auth/authProvider.tsx";
import { SnackbarProvider } from "./context/snackbar/snackbarProvider.tsx";
import NotFoundPage from "./pages/notFoundPage/notFoundPage.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider>
          <Routes>
            {pages.map((element) => (
              <Route
                key={element.text}
                path={"/" + element.path}
                element={element.element}
              />
            ))}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate replace={true} to="/login" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
