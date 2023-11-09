import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from "./components/navbar/navBar.tsx";
import pages from "./datas/pages.tsx";
import LoginPage from "./pages/loginPage/loginPage.tsx";
import {useEffect, useState} from "react";

export default function App() {
    const [showNavBar, setShowNavBar] = useState(true);

    useEffect(() => {
        const path = window.location.pathname;
        setShowNavBar(path !== "/");
    }, []);

    return(
        <BrowserRouter>
            {showNavBar && <NavBar/>}
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
    )
}