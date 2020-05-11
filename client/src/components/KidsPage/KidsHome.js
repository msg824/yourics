import React from 'react';
import './css/KidsHome.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import KidsPinkpong from './KidsPinkpong';
//import { FacebookButton, FacebookCount } from "react-social-kr";

// // React Router 정의
// function App() {
//     return (
//         <div className="KidsHome.js">
//             <Router>
//                 <Switch>
//                     <Route exact path="/" children={<Home/>} /> {/* 아래 Home 함수 호출 */}
//                     <Route path="/main" children={<MainPage/>} /> {/* MainPage 호출 */}
//                     <Route path="/kids" children={<KidsPage/>} /> {/* KidsPage 호출 */}
//                     <Route path="/pinkpong" children={<KidsPinkpong/>} /> {/* KidsPinkpong Page 호출 */}
//                 </Switch>
//             </Router>
//         </div>
//     );
// }




// @connect(
//     (state, ownProps) => ({
//       pathname: ownProps.location.pathname
//     }), {})

class KidsHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {

    }

    render() {

        return (
            
            <div className="container-kids">

            <div className="KidsPinkpong">
                <Router>
                    <Switch>
                        <Route path="/pinkpong" component={KidsPinkpong} /> {/* KidsPinkpong Page 호출 */}
                    </Switch>
                </Router>
            </div>

                <div className="backhome2">
                    <a href="http://localhost:3000/">
                        <img src="/images/backhome2.png" alt="move home"></img>
                    </a>
                </div>

                <div className="sns-place">
                    <img src="/images/SNS.png" alt="share SNS"/>
                </div>
                            
                <div className="container-kids-home">
                {/* 로고, 노래검색 */}
                <header>
                    <div className="kids_logo">
                        <img src="/images/yourics_kids_logo.png" alt="Yourics kids"/>
                    </div>
                    <div className="kids_search">
                        노래 검색 div
                    </div>
                </header>

               

                <div className="title-ul">
                    <ul className="title-list">
                        <Link to="/pinkpong">
                        <li><img src="/images/pinkpong.png" alt="pinkpong" /></li>
                        </Link>

                        <li><img src="/images/tayo.png" alt="tayo"/></li>
                        <li><img src="/images/bororo.png" alt="Bororo" /></li>
                    </ul>
                    <ul className="title-list">
                        <li><img src="/images/zuzu.png" alt="secret juju"/></li>
                        <li><img src="/images/frozen.png" alt="frozen"/></li>
                        <li><img src="/images/congson.png" alt="congson"/></li>
                    </ul>
                </div>

                </div>
            </div>
        ) 
    }
}

export default KidsHome;