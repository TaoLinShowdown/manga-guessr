import React, { useEffect, useState } from 'react'
import styles from '../styles/multichoice.module.css'

export default function MultipleChoice({ titles, correctTitle, submit, disabled }) {
    let [ choices, setChoices ] = useState([])
    let [ chosenOne, setChosenOne ] = useState('')

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    useEffect(() => {
        // get 4 random titles
        let temp = []
        while (temp.length < 4) {
            let rand = titles[getRandomInt(0, titles.length)]
            if (!temp.includes(rand)) {
                temp.push(rand)
            }
        }
        temp.push(correctTitle)
        temp = shuffle(temp)
        setChoices(temp)
    }, [correctTitle])

    return (
        <React.Fragment>
            <div className={styles['choices']}>
                {choices.map(c => 
                    <div className={chosenOne === c ? styles['chosen'] : styles['unchosen']} key={c} onClick={() => setChosenOne(c)}>{c}</div>
                )}
            </div>
            <button disabled={disabled} onClick={(e) => {setChosenOne(''); submit(chosenOne.trim())}}>
                {disabled ? 
                    'Starting next round...'
                :
                    chosenOne === '' ? 'Skip' : 'Submit'
                }
            </button>
        </React.Fragment>
    )
}