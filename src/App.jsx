import Portfolio from './Components/portfolio'
import {LanguageProvider} from './Context/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <Portfolio />
    </LanguageProvider>
  )
}