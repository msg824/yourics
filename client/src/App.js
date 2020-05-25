import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// import { TransitionGroup, CSSTransition } from "react-transition-group";

import MainPage from './components/MainPage/MainPage';
import KidsPage from './components/KidsPage/KidsHome';
import TitlePage from './components/TitlePage/TitlePage';
import KidsMain from './components/KidsMain/KidsMain';
import pre from './components/pre/pre';

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
                    <Route path="/pre" children={<pre/>} />
                </Switch>
            </Router>
        </div>
    );
};

// Home 페이지 html 여기에 구현 (App.css)
function Home() {
    return (
        <div className="container-home">
            <div className="home-background">
            <div className="link-kids">
                    
                </div>
            
            {/* <div className="sns-place">
                <img src="/images/sns.png" alt="share SNS"></img>
            </div> */}

            <div className="DesignPage">
                <Link to="/title">
                <p> 타이틀 페이지 </p>
                </Link>
                <Link to="/kidsmain">
                <p> 키즈메인 페이지 </p>
                </Link>
                <Link to="/pre">
                <p> 연습 페이지 </p>
                </Link>
            </div>

            <div className="container-center">
                가사를 보며 음악을 감상해보세요.
                <div className="yourics">
                 YouRics
                </div>
                <div className="link-main">
                    <Link to="/main">
                        <div className="play">
                            시작하기
                        </div>
                    </Link> {/* <a href> 태그와 비슷 localhost:3000/main 으로 이동 */}
                </div>
                    <div className="sun">
                    </div>
                        <div className="YK">
                             아이들을 위한
                        </div>
                        <div className="yourics">
                            YouRics Kids
                        </div>
                        <Link to="/kids">
                        <div className="play">
                            시작하기
                        </div>
                        </Link>
                    </div>
            </div>
            </div>
    )
}

export default App;
