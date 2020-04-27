import React from 'react';
import './indexRoot.css';
import MainPage from './MainPage/MainPage';

class IndexRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="container">
                minsung
                <MainPage></MainPage>
            </div>
        ) 
    }
}

export default IndexRoot;