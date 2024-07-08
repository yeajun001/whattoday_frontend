import React from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./main";
import Mainlin from "./mainlin";
import Signin from "./signin";
import LoginMain from './loginmain';
import MyPage from "./MyPage";
import Cal from "./Cal";
import Schedule from "./Schedule";
import Eat from "./Eat";

const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/mainlin" element={<Mainlin />} />
                <Route path="/Signin" element={<Signin />} />
                <Route path="/loginmain" element={<LoginMain />} />
                <Route path="/MyPage" element={<MyPage />} />
                <Route path="/Cal" element={<Cal />} />
                <Route path="/Schedule" element={<Schedule />} />
                <Route path="/Eat" element={<Eat />} />
            </Routes>
        </Router>
    );
}

export default App;
