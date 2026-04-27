import BattlePage from './pages/BattlePage'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'
import { useGameStore } from './store/gameStore'

export default function App() {
  const { screen } = useGameStore()

  if (screen === 'home') {
    return <HomePage />
  }

  if (screen === 'result') {
    return <ResultPage />
  }

  return <BattlePage />
}
