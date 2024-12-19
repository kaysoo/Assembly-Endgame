import { useState } from 'react'
import LanguageChip from './components/languageChip'
import { languages } from '../languages'
import clsx from 'clsx'
import { getFarewellText, getWord } from '../util'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

function App() {
  const [currentWord,setCurrentWord]= useState(()=>getWord())
  const [guessedLetter,setGuessedLetter]= useState([])
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const wrongGuessCount = guessedLetter.filter(letter => !currentWord.split('').includes(letter)).length
  const isGameWon = currentWord.split('').every(letter => guessedLetter.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameLost || isGameWon
  const isLastGuessIncorrect = guessedLetter[guessedLetter.length -1] && !currentWord.includes(guessedLetter[guessedLetter.length -1])

  const { width, height } = useWindowSize()

  function updateGuessedWord(letter){
 
    setGuessedLetter(prev => prev.includes(letter) ? prev : [...prev,letter])
    // setGuessedLetter(prev =>{
    //   const letterSet = new Set(prev)
    //   letterSet.add(letter);
    //   return Array.from(letterSet)
    // })
  }
  const gameStatusClass = clsx("game-status",{
    won : isGameWon,
    lost : isGameLost,
    farewell : !isGameOver && isLastGuessIncorrect
  })

  function startNewGame(){
    setCurrentWord(getWord())
    setGuessedLetter([])
  }
  return (
    <main>
      {isGameWon ?<Confetti
      recycle={false}
      numberOfPieces={1000}
       width={width} height={height}  /> : null}
      <header>
        <h1>
        Assembly Endgame
        </h1>
        <p>Guess the word within 8 attempts to keep
            the programming world safe from Assembly!
        </p>
    </header>
    <section aria-live='polite' role='status' className={gameStatusClass}>
        {isGameOver ?
         ( isGameWon ?  
         (<>
          <h2>You win!</h2>
          <p>Well done 🎉</p>
        </>) :
        (<>
          <h2>Game over!</h2>
          <p>YOu lose! Better start learning Assembly</p>
        </>)
        ) : isLastGuessIncorrect ? (
          <p className='farewell-message'>
            {getFarewellText(languages[wrongGuessCount-1].name)}
          </p>
        ) : null
        }
    </section>
    <section className='language-container'>
        {
          languages.map((i,index)=>{
            const isLanguageLost = index < wrongGuessCount
            const className = clsx('chip', isLanguageLost && 'lost')
           return (
            <LanguageChip
            key={i.name}
            language={i.name}
            languageBgColor={i.backgroundColor}
            languageColor={i.color}
            className={`language-chip ${isLanguageLost ? 'lost' : ""} `}
            />
          )})
        }
      </section>
      <section className='current-word'>
        {
          currentWord.split('').map((i,index)=>
            {
              const shouldRevealLetter = isGameLost || guessedLetter.includes(i)
              const letterClassName = clsx(
                isGameLost && !guessedLetter.includes(i) && 'missed-letter'
              )
              return (
                <span className={letterClassName} key={index}>
                  {
                    shouldRevealLetter ?
                  i.toUpperCase() : ''
                }
                </span>
              )
            })
        }
      </section>
      <section className='keyboard'>
        {
          
          alphabet.split('').map((a)=>{
            const isGuessed = guessedLetter.includes(a);
            const isCorrect =  isGuessed && currentWord.split('').includes(a);
            const isWrong = isGuessed && !currentWord.split('').includes(a)
            const className = clsx({
              correct : isCorrect,
              wrong : isWrong
            })
            return(
            <button 
            onClick={()=>updateGuessedWord(a)}
             key={a}
             className={className}
             disabled={isGameOver}
             >
              {a.toUpperCase()}
            </button>
            )
})
        }
      </section>
      {
       isGameOver && <button onClick={startNewGame} className='new-game'>
        New Game
      </button>
      }
    </main>
  )
}

export default App
