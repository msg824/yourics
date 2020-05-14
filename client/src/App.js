import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// import { TransitionGroup, CSSTransition } from "react-transition-group";

import MainPage from './components/MainPage/MainPage';
import KidsPage from './components/KidsPage/KidsHome';
import TitlePage from './components/TitlePage/TitlePage';
import KidsMain from './components/KidsMain/KidsMain'

// React Router 정의
function App() {
    return (
        <div className="App">
            <Router>
        	    <Switch>
                    <Route exact path="/" children={<Home/>} /> {/* 아래 Home 함수 호출 */}
                    <Route path="/main" children={<MainPage/>} /> {/* MainPage 호출 */}
                    <Route path="/kids" children={<KidsPage/>} /> {/* KidsPage 호출 */}
                    <Route path="/title" children={<TitlePage/>} />
                    <Route path="/kidsmain" children={<KidsMain/>} />
                </Switch>
            </Router>
        </div>
    );
};

// Home 페이지 html 여기에 구현 (App.css)
function Home() {
    return (
        <div className="container-home">

            <div className="link-kids">
                    <div className="logo-place">
                        <Link to="/kids">
                            <img src="/images/yourics_h_kids_logo.png" alt="move Yourics Kids"></img>
                        </Link>
                    </div>
                </div>

            <div className="sns-place">
                <img src="/images/sns.png" alt="share SNS"></img>
            </div>

            <div className="DesignPage">
                <Link to="/title">
                <p> 타이틀 페이지 </p>
                </Link>
                <Link to="/kidsmain">
                <p> 키즈메인 페이지 </p>
                </Link>
            </div>

            <div className="container-background">
                <img src="/images/yourics_home_logo2.png" alt="welcome yourics"></img>
                <div className="link-main">
                    <Link to="/main">
                        <br></br>
                        <img src="/images/play.png" alt="play"></img>
                    </Link> {/* <a href> 태그와 비슷 localhost:3000/main 으로 이동 */}
                </div>
            </div>
        </div>
    )
}

export default App;
