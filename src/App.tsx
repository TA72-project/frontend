import { Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./components/navbar/navBar.tsx";
import pages from "./datas/pages.tsx";
import LoginPage from "./pages/loginPage/loginPage.tsx";

export default function App() {
  const location = useLocation();
  const showNavBar = location.pathname !== "/login";

  return (
    <>
      {showNavBar && <NavBar />}
      <Routes>
        {pages.map((element) => (
          <Route
            key={element.text}
            path={"/" + element.path}
            element={element.element}
          />
        ))}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}
