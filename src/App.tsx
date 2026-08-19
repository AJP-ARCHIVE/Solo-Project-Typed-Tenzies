import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"



export default function App() {
   // Custom type 
    type Dice = {
      value: number;
      isHeld: boolean;
      id: string;
    }
    
    const [dice, setDice] = useState<Dice[]>((): Dice[]=> generateAllNewDice()) // Added typing 
    const buttonRef = useRef<HTMLButtonElement | null >(null) // Added typing 

    // Added typing 
    const gameWon: boolean = dice.every((die: Dice): boolean => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        
    // Refactored the useEffect to add safeguards (did type narrowing)
    useEffect(() => {
        if(!gameWon) return
        if (!buttonRef.current) return
        // if ref is HTMLElement focus the element 
        buttonRef.current.focus()
    }, [gameWon])

    // Added typing 
    function generateAllNewDice(): Dice[] {
        return new Array(10)
            .fill(0)
            .map((): Dice => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }
    
    // Added typing 
    function rollDice(): void {
        if (!gameWon) {
            setDice((oldDice: Dice[]): Dice[] => oldDice.map((die: Dice): Dice =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
        } else {
            setDice(generateAllNewDice())
        }
    }
    // Added typing 
    function hold(id: string):void {
        setDice((oldDice: Dice[]): Dice[] => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }

    // Added typing
    const diceElements: React.JSX.Element[] = dice.map((dieObj: Dice):React.JSX.Element  => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))

    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    )
}