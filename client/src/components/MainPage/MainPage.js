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
            <div className="container-main">
                {/* 로고, 노래검색 */}
                <header>
                    <div className="logo">
                        로고 사진2 div
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
                        <li>kakao</li>
                        <li>insta</li>
                        <li>fackbook</li>
                    </ul>
                </footer>
            </div>
        ) 
    }
}

export default MainPage;