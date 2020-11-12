import React from 'react';
import axios from 'axios';
import './css/MainPage.css';
import ModalComponent from './ModalComponent';
import Progress from './Progress';
import SearchFilter from './SearchFilter';

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clickAvoid: false,  // 중복 클릭 방지
            rClickAvoid: false, // 랜덤재생 중복 클릭 방지
            searchValue: '',    // 검색 창 value
            videoName: null,    // 검색 결과
            videoId: null,      // 노래 ID 값
            lyrics: '',         // 노래 가사
            songType: '',       // 노래 검색시 기본, MV, LIVE 선택 체크박스
            checkboxGroup: {
                mv: false,
                live: false
            },
            resultList: null,   // 노래 검색 결과 리스트
            dataLength: null,   // 노래 검색 결과 개수

            show: false,        // 모달 on off
            videoLoading: false,// 영상 로딩 state
            chart: false,       // 차트 on off
            chartData: [],      
        };

        this.handleHide = () => {
			this.setState({ show: false });
        };
        this.viewCountUp = async (song) => {
            await axios.post('http://localhost:5000/dbFront/viewCountUp', { song: song })
        };

        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.songTypeCheck = this.songTypeCheck.bind(this);
        this.randomPlay = this.randomPlay.bind(this);
    }

    async componentDidMount() {
        const chartData = await axios.get('http://localhost:5000/rank/load');
        this.setState({ chartData: chartData.data });

        console.log(SearchFilter);
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
            queryLyric: this.state.searchValue,
        });
        // 중복 검색 방지
        setTimeout(() => { this.setState({ clickAvoid: false }); }, 1000);

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
            return;
        }

        const searchList = await axios.post('http://localhost:5000/searchList/findSong', { song: this.state.videoName });
        const searchRes = searchList.data;

        if (!searchList.data) {
            // 가사 크롤링 -> 유튜브 API -> 노래재생
            this.setState({ videoLoading: true });
            const lyricsLoad = await axios.post('http://localhost:5000/crawling/lyricsLoad', { song: this.state.videoName });
            this.setState({ lyrics: lyricsLoad.data });
            await axios.post('http://localhost:5000/youtube/search', {
                song: this.state.videoName
            }).then(result => {
                this.setState({ videoId: result.data, videoLoading: false });
            }).then(() => {
                setTimeout(() => {
                    this.setState({ clickAvoid: false });
                }, 1000);
            }).catch(err=>{console.log('video ID loading Error', err)});

        } else {
            // 여기에 모달 띄우는 코드 작성
            this.setState({ show: true });
            
            // 검색 시 리스트 보여지는 부분
            const finalRes = searchRes.map((data, i) => {
                return <div key={i} className="modal-list">
                    <img className="modal-thumbnail" src={`https://i.ytimg.com/vi/${data.videoId}/default.jpg`} alt="썸네일" onClick={() => {
                        this.setState ({ 
                            videoId: data.videoId, 
                            lyrics: data.lyrics, 
                            clickAvoid: false, 
                            show: false 
                        })
                        this.viewCountUp(data.videoId)
                    }}>
                    </img>
                    <div className="modal-text-div">
                        <span className="modal-songname" onClick={() => {
                            this.setState ({ 
                                videoId: data.videoId, 
                                lyrics: data.lyrics, 
                                clickAvoid: false, 
                                show: false 
                            })
                            this.viewCountUp(data.videoId)
                        }}>
                            {data.title}
                        </span>
                        <div className="modal-artist">{data.artist}</div>
                        <div className="modal-album">{data.album}</div>
                    </div>
                </div>
            })
            this.setState({
                resultList: finalRes,
                dataLength: searchList.data.length 
            });
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
        this.setState({ rClickAvoid: true });

        setTimeout(() => {
            this.setState({ rClickAvoid: false });

        }, 1000);
        
        this.setState({
            videoId: rPlay.data.videoId,
            lyrics: rPlay.data.lyrics
        });
    }

    render() {
        const { clickAvoid, searchValue, videoId, lyrics, videoName, resultList, dataLength, show, rClickAvoid, videoLoading } = this.state;
        const { chart, chartData } = this.state;
        const onChart = chart ? '400px' : '0';

            return (
                <div className="main-bg">
                    <div className="move-home-btn">
                        <a href="http://localhost:3000/">
                            <img src="/images/backbt.png" alt="move home"></img>
                        </a>
                    </div>
                    <div className="container-main">
                        {/* 로고, 노래검색 */}
                        <header>
                            <div className="logo">
                                    <a href="/main">
                                        <img src="/images/main_logo2.png" alt="Yourics" />
                                    </a>
                            </div>
                            <div className="search">
                                <form onSubmit={this.searchSubmit}>                   
                                    <input type="text" src="/images/main_logo2.png" value={searchValue} onChange={this.searchChange} className="search-box"/>
                                    {
                                        !clickAvoid ?
                                        <input type="submit" value=" " className="img-button" />
                                        :
                                        <input type="submit" disabled value=" " className="img-button2"/>
                                    }
                                </form>
                            </div>
                            <div>
                                <form onSubmit={this.searchSubmit}> 
                                    <div className="randomsong">
                                        {
                                            !rClickAvoid ?
                                            <img src="/images/shuffle.png" className="randomImg" alt="random" onClick={this.randomPlay}></img>
                                            :
                                            <img src="/images/shuffle.png" className="randomImg" alt="random"></img>
                                        }
                                    </div>
                                    <div className="songtype-checkbox">
                                        <label>
                                            <input type="checkbox" name="checkboxGroup" value="mv" onChange={this.songTypeCheck} checked={this.state.checkboxGroup['mv'] || ''} />
                                            &nbsp; MV
                                        </label>
                                        <label>
                                            <input type="checkbox" name="checkboxGroup" value="live" onChange={this.songTypeCheck} checked={this.state.checkboxGroup['live'] || ''} />
                                            &nbsp; Live
                                        </label>
                                    </div>
                                    <div className="f1">
                                        <img src="/images/f1shuffle3.png" alt="shuffle icon"/>
                                        : Click to play random song　　
                                        <input type="checkbox" name="f1checkbox" checked="checked" readOnly/>
                                        　: Check the video type you want (MV or Live)
                                    </div>
                                </form>
                            </div>
                            {
                                <ModalComponent 
                                modalTitle={videoName} dataLength={dataLength}
                                content={resultList} show={show} hide={this.handleHide}
                                />
                            }
                        </header>
                        {/* 동영상, 가사 */}
                        <div className="main-div">
                            <div className="videoimage">
                                <img src="/images/videoframel.png" alt="frame"/>
                            </div>
    
                            <div className="video">
                                {
                                    videoId && <iframe title="song" width="800" height="500" id="YT_Video" 
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen> 
                                    </iframe>
                                }
                                {
                                    videoLoading &&
                                    <div className="loading">
                                        <Progress />
                                        비디오를 불러오는 중입니다...
                                        <div>
                                        네트워크 상태에 따라 4~10초 시간이 걸립니다.
                                        </div>
                                        
                                    </div>
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
                            <div className="chart">
                                <span className="chart-menu" onClick={() => this.setState({ chart: true })}>&#9776;</span>
                            </div>
                            <div className="sidenav" style={{width: onChart}}>
                                {
                                    chart && <>
                                        <div className="sidenav-header">
                                            <span className="closebtn" onClick={() => this.setState({ chart: false })}>&times;</span>
                                            <span className="sidenav-title">TOP 100</span>
                                        </div>
                                        {
                                            chartData.map((data, i) => {
                                                return <div key={i}>
                                                    <div className="chart-div">
                                                        <div className="chart-rank">{data.rank}</div>
                                                        <div>
                                                            <img src={`https://i.ytimg.com/vi/${data.videoMvId}/default.jpg`} alt="thumbnail"></img>
                                                        </div>
                                                        <div className="chart-content">
                                                            <div>{data.title}</div>
                                                            <div>{data.artist}</div>
                                                        </div>
                                                    </div>
                                                    <div className="chart-play">
                                                        <span onClick={() => {
                                                            this.setState ({ 
                                                                videoId: data.videoId, 
                                                                lyrics: data.lyrics, 
                                                                clickAvoid: false, 
                                                                show: false 
                                                            })
                                                            this.viewCountUp(data.videoId)
                                                        }}>재생</span>

                                                        <span onClick={() => {
                                                            this.setState ({ 
                                                                videoId: data.videoMvId, 
                                                                lyrics: data.lyrics, 
                                                                clickAvoid: false, 
                                                                show: false 
                                                            })
                                                            this.viewCountUp(data.videoMvId)
                                                        }}>MV 재생</span>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </>
                                }
                            </div>
                        </div>
                        <footer>
                            <div className="copyright">
                                Copyright ⓒ 2020. youcando All rights reserved.
                            </div>
                        </footer>
                    </div>
                </div>   
            )
    }
}

export default MainPage;