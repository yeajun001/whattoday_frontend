import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./main";
import Mainlin from "./mainlin";
import LoginMain from "./loginmain";
import MyPage from "./MyPage";
import Cal from "./Cal";
import Schedule from "./Schedule";
import Eat from "./Eat";

const App = () => {

    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/mainlin" element={<Mainlin />} />
                <Route path="/loginmain" element={<LoginMain />} />
                <Route path="/MyPage" element={<MyPage />} />
                <Route path="/Cal" element={<Cal />} />
                <Route path="/Schedule" element={<Schedule />} />
                <Route path="/Eat" element={<Eat />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
