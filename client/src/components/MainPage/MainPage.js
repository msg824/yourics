import React from 'react';
import axios from 'axios';
import './css/MainPage.css';


class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    async componentDidMount() {
        const result = await axios.get('http://localhost:5000/youtube');
        console.log(result.data);
    }

    render() {
        return (
        <div className="cotainer-main0">
            <div className="backhome">
                <a href="http://localhost:3000/">
                    <img src="/images/backhome2.png" alt="move home"></img>
                </a>
            </div>

            <div className="container-main">
                {/* 로고, 노래검색 */}
                <header>
                    <div className="logo">
                        
                    <img src="/images/main_logo.png" alt="Yourics" /> 
                    </div>

                    <div className="search">
                        노래 검색 div
                    </div>
                  
                </header>

                {/* 동영상, 가사 */}
                <div className="main-div">
                    <div className="video">
                        동영상 div
                    </div>
                    <div className="lyrics">
                        가사 div
                    </div>
                </div>

                {/* SNS 공유 */}
                <footer>
                    <ul className="sns-list">
                        <li><img src="/images/sns_insta.png" alt="insta" /></li>
                        <li><img src="/images/sns_fb.png" alt="facebook" /></li>
                        <li><img src="/images/sns_kakao.png" alt="kakaotalk" /></li>
                        <li><img src="/images/sns_twitter.png" alt="twitter" /></li>
                    </ul>
                </footer>
            </div>
        </div>    
        ) 
    }
}

export default MainPage;