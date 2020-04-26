import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import KidsPage from './components/KidsPage/KidsHome';

// Router 정의
function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/" children={<Home/>} /> {/* 아래 Home 함수 호출 */}
                    <Route path="/main" children={<MainPage/>} /> {/* MainPage 호출 */}
                    <Route path="/kids" children={<KidsPage/>} /> {/* KidsPage 호출 */}
                </Switch>
            </Router>
        </div>
    );
}

// Home 페이지 html 여기에 구현 (App.css)
function Home() {
    return (
        <div className="container-home">
            <div className="link-main">
                <Link to="/main">메인</Link>
            </div>
            <div className="link-kids">
                <Link to="/kids">키즈</Link>
            </div>
        </div>
    )
}

export default App;
