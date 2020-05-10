import React from 'react';
import axios from 'axios';
import './css/MainPage.css';

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clickAvoid: false,  // 중복 클릭 방지
            searchValue: '',    // 검색 창 value
            videoName: null,    // 검색 결과
            videoId: null       // 노래 ID 값
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
        this.setState({
            clickAvoid: true,
            videoName: this.state.searchValue,  // 영상 제목 state 값 반영
            searchValue: ''
        });

        await event.preventDefault();

        // 빈 칸 또는 공백으로 검색할 경우 영상 재생 X
        const blankReg = /\s{1,}/g;
        const blankRegExp = blankReg.test(this.state.videoName);

        if ( this.state.videoName === '' || blankRegExp ) {
            this.setState({ clickAvoid: false });
            return null

        }

        await axios.post('http://localhost:5000/youtube/search', {
            song: this.state.videoName

        }).then(result => {
            this.setState({ videoId: result.data });

        }).then(() => {
            setTimeout(() => {
                this.setState({ clickAvoid: false });

            }, 2000);

        }).catch(err=>{console.log('video ID loading Error', err)})
        
    }

    render() {
        const { clickAvoid, searchValue, videoId } = this.state;

        return (
            <div className="container-main">
                {/* 로고, 노래검색 */}
                <header>
                    <div className="logo">
                        로고 이미지 div
                        {clickAvoid && <span> Searching</span>}
                    </div>
                    <div className="search">
                        <form onSubmit={this.searchSubmit}>
                            <input type="text" value={searchValue} onChange={this.searchChange} />
                            {
                                !clickAvoid ?
                                <input type="submit" value="검색" />
                                :
                                <input type="submit" disabled value="검색" />
                            }
                            
                        </form>
                    </div>
                </header>

                {/* 동영상, 가사 */}
                <div className="main-div">
                    <div className="video">
                        {
                            videoId && <iframe title="song" width="800" height="500" 
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen> 
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