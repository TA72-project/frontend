import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import NavBar from "./components/navbar/navBar.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage/loginPage.tsx";
import pages from "./datas/pages.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar />
      <Routes>
        {pages.map((element) => (
          <Route
            key={element.text}
            path={"/" + element.path}
            element={element.element}
          />
        ))}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
