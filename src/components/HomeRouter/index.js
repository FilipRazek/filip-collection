import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
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
    {
      path: '/hangman',
      label: 'Hangman solver',
      component: <Hangman />,
      image: 'hangman',
    },
    { path: '/morse', label: 'Morse', component: <Morse />, image: 'morse' },
    {
      path: '/twenty-three-or-bust',
      label: '23 or Bust',
      component: <TwentyThreeOrBust />,
      image: '23',
    },
    {
      path: '/tic-tac-toe',
      label: 'Tic Tac Toe',
      component: <TicTacToe />,
      image: 'tic_tac_toe',
    },
    {
      path: '/numeral-converter',
      label: 'Roman numeral converter',
      component: <NumeralConverter />,
      image: 'roman_numerals',
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
          <Route exact path='/about'>
            <AboutPage />
          </Route>
          <Route exact path='/help'>
            <Redirect to='/about' />
          </Route>
          <Route path='/help/:activity' component={HelpPage} />
          <Route exact path='/'>
            <Home links={links} />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default HomeRouter
