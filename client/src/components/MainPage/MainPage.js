import React from 'react';
import axios from 'axios';
import './css/MainPage.css';

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: null,
            searchValue: '',
            videoName: null,
            videoId: null
        }
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
    }

    componentDidMount() {
        
    }

    // input 에 텍스트 입력시 state 값 변경
    searchChange(event) {
        this.setState({ searchValue: event.target.value })
    }

    // 검색 버튼 클릭 시 영상 호출되도록 구현
    async searchSubmit(event) {

        // 영상 제목 state 값 반영
        this.setState({
            ready: this.state.searchValue,
            videoName: this.state.searchValue
        });

        await event.preventDefault();

        await axios.post('http://localhost:5000/youtube/search', {
            song: this.state.videoName
        }).then(result => {
            this.setState({ videoId: result.data.id.videoId });
            console.log(result.data);
        }).catch(err=>{console.log('video ID loading Error', err)})
        
    }

    render() {
        const { ready, searchValue, videoName, videoId } = this.state;
        console.log(this.state.searchValue);
        
        return (
            <div className="container-main">
                {/* 로고, 노래검색 */}
                <header>
                    <div className="logo">
                        로고 이미지 div
                        {ready && <span>ON</span>}
                    </div>
                    <div className="search">
                        <form onSubmit={this.searchSubmit}>
                            <input type="text" value={searchValue} onChange={this.searchChange} />
                            <input type="submit" value="검색" />
                        </form>
                        <div className="gcse-searchbox-only" data-resultsUrl="https://googlecustomsearch.appspot.com/elementv2/two-page_results_elements_v2.html?query=test"></div>
                    </div>
                </header>

                {/* 동영상, 가사 */}
                <div className="main-div">
                    <div className="video">
                        {
                            videoId && <iframe title="counting stars" width="800" height="500" 
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen> 
                            </iframe>
                        }
                        
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