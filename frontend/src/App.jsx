
import CreateQuiz from './pages/CreateQuiz'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router'
import JoinQuiz from './pages/JoinQuiz'
import Lobby from './pages/Lobby'
import Question from './pages/Question'
import LeaderboardInfo from './pages/LeaderboardInfo'
import HowToPlay from './pages/HowToPlay'
import About from './pages/About'

function App() {

  return (
    <>
      <BrowserRouter>
        
          <Routes>
              <Route path="/" element={<Home/>}></Route>
              <Route path="/createquiz" element={<CreateQuiz/>}></Route>
              <Route path="/joinquiz" element={<JoinQuiz/>}></Route>
              <Route path="/lobby" element={<Lobby/>}></Route>
              <Route path="/question" element={<Question/>}></Route>
              <Route path="/leaderboard" element={<LeaderboardInfo/>}></Route>
              <Route path="/how-to-play" element={<HowToPlay/>}></Route>
              <Route path="/about" element={<About/>}></Route>
          </Routes>
        
      </BrowserRouter>
    </>
  )
}

export default App
