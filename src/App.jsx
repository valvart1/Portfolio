import Portfolio from './components/portfolio'
import {LanguageProvider} from './context/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <Portfolio />
    </LanguageProvider>
  )
}