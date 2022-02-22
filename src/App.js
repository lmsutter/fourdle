// !!npm run deploy to deploy to github

import './App.css';
import _ from "lodash" 

import fourLetterWords from './data/words';

import { useState, useEffect } from 'react';


const keyLetters = "QWERTYUIOPASDFGHJKLZXCVBNM"
const keyMap = new Map()

const keyMapper = (keyString, map) => {
const stringArr = keyString.split('')
stringArr.forEach(e => {
  map.set(e, null)
})
}

keyMapper(keyLetters, keyMap)


const App = () => {
const [rows, setRows] = useState([[], [], [], [], [], []])
const [currentRow, setCurrentRow] = useState(0)
const [word, setWord] = useState(fourLetterWords[Math.floor(Math.random() * fourLetterWords.length)])
const [keys, setKeys] = useState(keyMap)
const [streak, setStreak] = useState(0)
const [showLost, setShowLost] = useState(false)


useEffect(() => {
  const browserStreak = localStorage.getItem('streak')
  if (browserStreak) {
    setStreak(JSON.parse(browserStreak))
  }
}, [])

useEffect(() => {
  reset()
  localStorage.setItem('streak', streak)
}, [streak])

const reset = () => {
  const number = Math.floor(Math.random() * fourLetterWords.length)
  setRows([[], [], [], [], [], []])
  setCurrentRow(0)
  setWord(fourLetterWords[number])
  setKeys(keyMap)
}

function streakEmojiSet () {
  const streakString = streak.toString()
  let answer = []
  let temp = [...streakString].forEach(e => answer.push(<span>{String.fromCodePoint(`0x003${parseInt(e)}`, '0xFE0F', '0x20E3')}</span>) )
  return (<span>{answer}</span>)
}

const letterClickHandler = (letter) => {
  const newRows = [...rows]
  if (newRows[currentRow].length < 4) newRows[currentRow].push([letter, ''])
  setRows(newRows)
}

const keyboardCreator = (map) => {
  const returnArray = []
  for (let [key, value] of map) {
    returnArray.push(<button key={key+'key'} className={`key ${key} ${value}`} onClick={() => letterClickHandler(key)}>{key}</button>)
  }
   return returnArray
}

const keyArray = keyboardCreator(keys)

const rowMaker = (array) => {
  const returnArr = []
  
  for (let i = 0; i <= 3; i++) {
    if (array[i]) {
      returnArr.push(<p key={currentRow.toString() + i.toString() + array[i]} className={"inputLetter " + array[i][1]} >{array[i][0]}</p>)
    } else {
      returnArr.push(<p key={currentRow.toString() + i.toString() + array[i]} className="inputLetter"></p>)
    }
  }
  
  return returnArr
}

function answerChecker () {
  const currentGuess = rows[currentRow]
  if (!currentGuess[3] ) {
    alert("not enough letters")
    return
  }
  if (!fourLetterWords.includes(currentGuess.join('').toLowerCase().replaceAll(',', ''))) {
    alert('Not a word')
    return
  }

  const rowsCopy = _.cloneDeep(rows)
  const keysCopy = new Map(keys)
  
  currentGuess.forEach((elem, index) => {

    if(elem[0] === word[index].toUpperCase()) {
      keysCopy.set(elem[0], 'correct')
    } else if (word.toUpperCase().includes(elem[0]) && (keysCopy.get(elem[0]) !== 'correct') ) {
      keysCopy.set(elem[0], 'wspot')
    } else if ( (keysCopy.get(elem[0]) !== 'correct' || keysCopy.get(elem[0]) !== 'correct') ) { 
      keysCopy.set(elem[0], 'wrong') 
    }
    
    if(elem[0] === word[index].toUpperCase()) {
      rowsCopy[currentRow][index][1] = 'correct'
    } else if(word.toUpperCase().includes(elem[0])) {
      rowsCopy[currentRow][index][1] = 'wspot'
    } else { rowsCopy[currentRow][index][1] = 'wrong'}    
  })
  
  let winState = ''
  if(word.toUpperCase() === currentGuess.map(e => e[0]).join("")) {
    winState = 'won'
    alert("you won!")
  } else if (currentRow === 5) {
    winState = 'lost'
  }

  setShowLost(c => {
    if (winState === 'lost') {
      return true
    }
  })


  setCurrentRow(c =>  {
    if (winState === 'won') return 0 
    else return c + 1
  })
  setRows(c => {
    if (winState === 'won' ) return [[], [], [], [], [], []]
    else return rowsCopy
  })
  setKeys(c => {
    if (winState === 'won') return keyMap
    else return keysCopy
  })
  setStreak(c => {
    if (winState === 'won') return c + 1
    else return c
  })
  
}

function deleteLetter () {
  const tempRows = [...rows]
  tempRows[currentRow].pop()
  setRows(tempRows)
}

const share = () => {
  const streakString = streak.toString()
  let answer = ''
  let temp = [...streakString].forEach(e => answer += String.fromCodePoint(`0x003${parseInt(e)}`, '0xFE0F', '0x20E3') )
  navigator.clipboard.writeText(`4️⃣dle Streak: ${answer}, Losing word: ${word}`)
  alert(`Text Copied! \n 4️⃣dle Streak: ${answer}, Losing word: ${word}`)
}


return (
  <div className="container">
    {showLost && <div className="loserModal">
      <p>Sorry about that, chap, we were looking for "{word}". Better luck next time!</p>
      <button onClick={share}>Share Streak<br /> (copy text)</button>
      <button onClick={() => {
        reset()
        setStreak(0)
        setShowLost(false)
      }}>New Word</button>
    </div>}
    <section className="options">
      <button onClick={() => {
        reset();
        setStreak(0);
      }}>New Word</button>
      <p>Streak {streakEmojiSet()}</p>
    </section>
    <section className="input">
      <div className="row" >
          {rowMaker(rows[0])}
      </div>
      <div className="row" >
          {rowMaker(rows[1])}
      </div>
      <div className="row" >
          {rowMaker(rows[2])}
      </div>
      <div className="row" >
          {rowMaker(rows[3])}
      </div>
      <div className="row" >
          {rowMaker(rows[4])}
      </div>
      <div className="row" >
          {rowMaker(rows[5])}
      </div>
    </section>
    <section className="letters">
      {keyArray}
    </section>
    <div className="buttons">
      <button className="delete-submit" onClick={answerChecker}>Submit</button>
      <button className="delete-submit" onClick={deleteLetter}>Delete</button>
    </div>
  </div>
);
};

export default App;


