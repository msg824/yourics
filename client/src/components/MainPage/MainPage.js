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
            videoId: null,      // 노래 ID 값
            lyrics: '',         // 노래 가사
            songType: '',       // 노래 검색시 기본, MV, LIVE 선택 체크박스
            checkboxGroup: {
                mv: false,
                live: false
            },
        }

        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.songTypeCheck = this.songTypeCheck.bind(this);
        this.randomPlay = this.randomPlay.bind(this);
    }

    async componentDidMount() {

        // const rankLoad = await axios.get('http://localhost:5000/rank/rankLoad', {
        // })
        // console.log(rankLoad);
    }

    // input 에 텍스트 입력시 state 값 변경
    searchChange(event) {
        this.setState({ searchValue: event.target.value })
    }

    // 검색 버튼 클릭 시 영상 호출되도록 구현
    async searchSubmit(event) {
        const { songType } = this.state;

        this.setState({
            clickAvoid: true,
            searchValue: '',
            queryLyric: this.state.searchValue
        })

        if (!songType) {
            this.setState({ videoName: this.state.searchValue });
        } else if (songType === 'mv') {
            this.setState({ videoName: this.state.searchValue+' mv' });
        } else if (songType === 'live') {
            this.setState({ videoName: this.state.searchValue+' live' });
        }

        await event.preventDefault();

        // 빈 칸 또는 공백으로 검색할 경우 영상 재생 X
        const blankReg = /\s{1,}/g;
        const stringReg = /(\S)\w*/g;
        const blankRegExp = blankReg.test(this.state.videoName);
        const stringRegExp = stringReg.test(this.state.videoName);

        if (this.state.videoName === '' || (blankRegExp && !stringRegExp)) {
            this.setState({ clickAvoid: false });
            return null

        }

        const searchList = await axios.post('http://localhost:5000/searchList/findSong', {
            song: this.state.videoName
        })

        if (!searchList.data) {
            // 가사 크롤링 -> 유튜브 API -> 노래재생
            console.log('데이터 없음', searchList.data);

        } else {
            // 여기에 모달 띄우는 코드 작성
            const lyricsLoad = await axios.post('http://localhost:5000/crawling/lyricsLoad', {
                song: this.state.queryLyric
            })

            this.setState({ lyrics: lyricsLoad.data })

            await axios.post('http://localhost:5000/youtube/search', {
                song: this.state.videoName

            }).then(result => {
                this.setState({ videoId: result.data });

            }).then(() => {
                setTimeout(() => {
                    this.setState({ clickAvoid: false });

                }, 1000);

            }).catch(err=>{console.log('video ID loading Error', err)});

        }
    }

    async songTypeCheck(event) {
        let songTypeObj = {};

        songTypeObj[event.target.value] = await event.target.checked;

        this.setState({ checkboxGroup: songTypeObj });

        if (this.state.checkboxGroup['mv']) {
            this.setState({ songType: 'mv' })
        } else if (this.state.checkboxGroup['live']) {
            this.setState({ songType: 'live' })
        } else {
            this.setState({ songType: '' })
        }

    }

    async randomPlay() {
        const rPlay = await axios.get('http://localhost:5000/dbFront/randomPlay');
        this.setState({ clickAvoid: true });

        setTimeout(() => {
            this.setState({ clickAvoid: false });

        }, 1000);
        
        this.setState({
            videoId: rPlay.data.videoId,
            lyrics: rPlay.data.lyrics
        });
    }

    render() {
        const { clickAvoid, searchValue, videoId, lyrics } = this.state;

            return (
                <div className="cotainer-main0">
                    <div className="backg">
                        <div className="backhome">
                            <a href="http://localhost:3000/">
                                <img src="/images/ufo.png" alt="move home"></img>
                            </a>
                        </div>
        
                        <div className="container-main">
                            {/* 로고, 노래검색 */}
                            <header>
                                <div className="logo">
                                    <center>
                                        <a href="/main">
                                            <img src="/images/main_logo.png" alt="Yourics" />
                                        </a>
                                    </center>
                                </div>
        
                                <div className="search">
                                    <form onSubmit={this.searchSubmit}>
                                        <div className="songtype-checkbox">
                                            <label>
                                                <input type="checkbox" name="checkboxGroup" value="mv" checked={this.state.checkboxGroup['mv'] || ''} onChange={this.songTypeCheck} />
                                                MV
                                            </label>
                                            <label>
                                                <input type="checkbox" name="checkboxGroup" value="live" checked={this.state.checkboxGroup['live'] || ''} onChange={this.songTypeCheck} />
                                                Live
                                            </label>
                                        </div>
                                        
                                        <input type="text" value={searchValue} onChange={this.searchChange} className="search-box"/>
                                        {
                                            !clickAvoid ?
                                            <input type="submit" value=" " className="img-button" />
                                            :
                                            <input type="submit" disabled value="검색중..." className="img-button2"/>
                                        }
                                        
                                        <div>
                                            {
                                                !clickAvoid ?
                                                <img src="/images/randombtn.png" className="randomImg" alt="random" onClick={this.randomPlay}></img>
                                                :
                                                <span>랜덤</span>
                                            }
                                    
                                        </div>
                                    </form>
                                </div>
                            </header>
        
                            {/* 동영상, 가사 */}
                            <div className="main-div">
                                <div className="videoimage">
                                   <img src="/images/videoframe2.png" alt="tv"/>
                                </div>
        
                                <div className="video">
                                    {
                                        videoId && <iframe title="song" width="800" height="500" id="YT_Video" 
                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen> 
                                        </iframe>
                                    }
                                </div>
        
                                <div className="lyrics">
                                    <span className="content">
                                        {
                                            lyrics &&
                                            lyrics.split('<br>').map( (line,idx) => {
                                                return <span key={idx}>
                                                    {line}<br/>
                                                </span>
                                            })
                                        }
                                    </span>
                                </div>
                            </div>
        
                            {/* SNS 공유 */}
                            <footer>
                                <div className="copyright">
                                    Copyright 2020. M&P All rights reserved.
                                {/*  <li><img src="/images/sns_insta.png" alt="insta" /></li>
                                    <li><img src="/images/sns_fb.png" alt="facebook" /></li>
                                    <li><img src="/images/sns_kakao.png" alt="kakaotalk" /></li>
                                    <li><img src="/images/sns_twitter.png" alt="twitter" /></li> */}
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>    
            )
    }
}

export default MainPage;