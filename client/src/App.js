import React from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from './components/MainPage/MainPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" children={<MainPage />} />
        </Switch>
      </Router>
    </div>
  );
};

// function Home() {
//   return (
//     <div className="container-home">
//       <div className="home-background">
//         <div className="container-center">
//           <div className="hometext">Watch the lyrics and Enjoy to the music.</div>
//           <div>가사를 보며 음악을 감상해보세요.</div>
//           <div className="yourics">YouRics</div>
//           <div className="link-main">
//             <Link to="/main">
//               <div className="play">
//                 <img src="/images/onoff.png" alt="play" />
//               </div>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

export default App;
