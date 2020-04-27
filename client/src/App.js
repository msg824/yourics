import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import KidsPage from './components/KidsPage/KidsHome';

// React Router 정의
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
          
        <div className="container-background">
          <img src="/images/yourics_home_logo.png"></img>
          
                <div className="link-main">
                <Link to="/main">
                <img src="/images/play.png"></img>    
                </Link> {/* <a href> 태그와 비슷 localhost:3000/main 으로 이동 */}
            </div>
            </div>

            <div className="link-kids">
                <Link to="/kids">
                    <div className="logo-place">
                <img src="/images/home_kids_logo.png"></img>
                </div>
                </Link>
            </div>

            <div className="sns-place">
            <img src="/images/sns.png"></img>
            </div>
        </div>
    )
}

export default App;
