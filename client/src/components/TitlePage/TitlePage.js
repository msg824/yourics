import React from 'react';
import axios from 'axios';
import './css/TitlePage.css';


class TitlePage extends React.Component {
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
            
            <div className="container-kidst">

                <div className="backhome2">
                    <a href="http://localhost:3000/">
                        <img src="/images/backhome2.png" alt="move home"></img>
                    </a>
                </div>

                <div className="sns-place">
                    <img src="/images/SNS.png" alt="share SNS"/>
                </div>
                            
                <div className="container-kids-title">
                {/* 로고, 노래검색 */}
                <header>
                    <div className="kids_logo">
                        <img src="/images/yourics_kids_logo.png" alt="Yourics kids"/>
                    </div>
                    <div className="kids_search">
                        노래 검색 div
                    </div>
                </header>

                <div className="title2-ul">
                    <ul className="title2-list">
                        <li><img src="/images/tpinkpong.png" alt="pinkpong" /></li>
                    </ul>
                </div>
               
                <div className="title-div">
                    <div className="videot">
                        타이틀 동영상 Div1
                    </div>
                    <div className="videot">
                        타이틀 동영상 Div2
                    </div>
                    <div className="videot">
                        타이틀 동영상 Div3
                    </div>
                </div>

                <div className="title-div">
                    <div className="videot">
                        타이틀 동영상 Div4
                    </div>
                    <div className="videot">
                        타이틀 동영상 Div5
                    </div>
                    <div className="videot">
                        타이틀 동영상 Div6
                    </div>
                </div>

                </div>
            </div>
        ) 
    }
}

export default TitlePage;