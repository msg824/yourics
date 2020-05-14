import React from 'react';
import axios from 'axios';
import './css/KidsMain.css';


class KidsMain extends React.Component {
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
        <div className="cotainer-kids-main0">
            
            <div className="backhome2">
                    <a href="http://localhost:3000/">
                        <img src="/images/backhome2.png" alt="move home"></img>
                    </a>
                </div>

                <div className="sns-place">
                    <img src="/images/SNS.png" alt="share SNS"/>
                </div>
                
            <div className="container-kids-main">
                {/* 로고, 노래검색 */}
                <header>
                    <div className="kidsmain-logo">
                    <img src="/images/yourics_kids_logo.png" alt="Yourics kids" /> 
                    </div>

                    <div className="search">
                        노래 검색 div
                    </div>
                  
                </header>

                {/* 동영상, 가사 */}
                <div className="kidsmain-div">
                    <div className="kvideo">
                        동영상 div
                    </div>
                    <div className="klyrics">
                        가사 div
                    </div>
                </div>
                
            </div>
        </div>    
        ) 
    }
}

export default KidsMain;