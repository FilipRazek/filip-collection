import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AboutPage from '../AboutPage'
import HelpPage from '../HelpPage'
import Hangman from '../Hangman'
import Home from '../Home'
import NumeralConverter from '../NumeralConverter'
import Morse from '../Morse'
import TicTacToe from '../TicTacToe'
import TwentyThreeOrBust from '../TwentyThreeOrBust'

const HomeRouter = () => {
  const links = [
    { path: '/hangman', label: 'Hangman solver', component: <Hangman /> },
    { path: '/morse', label: 'Morse', component: <Morse /> },
    {
      path: '/twenty-three-or-bust',
      label: '23 or Bust',
      component: <TwentyThreeOrBust />,
    },
    {
      path: '/tic-tac-toe',
      label: 'Tic Tac Toe',
      component: <TicTacToe />,
    },
    {
      path: '/numeral-converter',
      label: 'Roman numeral converter',
      component: <NumeralConverter />,
    },
  ]

  return (
    <Router>
      <div>
        <Switch>
          {links.map(link => (
            <Route exact key={link.path} path={link.path}>
              {link.component}
            </Route>
          ))}
          <Route path='/about'>
            <AboutPage />
          </Route>
          <Route path='/help'>
            <HelpPage />
          </Route>
          <Route path='/'>
            <Home links={links} />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default HomeRouter
