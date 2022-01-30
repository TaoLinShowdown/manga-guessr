/***
 * manga: {
 *     ref: string,
 *     chapterid: string,
 *     titles: string[]
 * }
 */

import React, { useEffect, useState } from 'react'
import styles from '../styles/game.component.module.css'
import Image from 'next/image'
import Link from 'next/link'
import AutoSearchBar from '../components/AutoSearchBar'
import MultipleChoice from '../components/MultipleChoice'
const url = 'https://manga-guessr-server-staging.herokuapp.com'

export default function GameComponent({ mangas, titles, multipleChoice, resetGame }) {
    let [ currentRound, setCurrentRound ] = useState(0)
    let [ guessingState, setGuessingState ] = useState(0) // 0: guessing, 1: guessed
    let [ results, setResults ] = useState([]) // -1: wrong, 0: skipped, 1: correct
    let [ pageLinks, setPageLinks ] = useState([])
    let [ score, setScore ] = useState(0)

    const getPageLink = async (chapterid) => {
        let athomeUrlResponse = await fetch(`${url}/manga/pagelink?chapterId=${chapterid}`)
        let athomeUrlData = await athomeUrlResponse.json()

        // in case of being ratelimited
        if (athomeUrlData.result === 'error') {
            let retry = athomeUrlData.retry
            console.log(`RATE LIMITED WAITING ${retry + 5} SECONDS`)
            await new Promise(resolve => setTimeout(resolve, (retry * 1000) + 5000)) // sleep
            athomeUrlResponse = await fetch(`${url}/manga/pagelink?chapterId=${chapterid}`)
            athomeUrlData = await athomeUrlResponse.json()
            return athomeUrlData.page
        } else {
            return athomeUrlData.page
        }
    }

    const onSubmit = (myguess) => {
        if (myguess === '') {
            setResults([ ...results, 0 ])
        } else if (mangas[currentRound].titles.includes(myguess)) {
            setScore(score + 1)
            setResults([ ...results, 1 ])
        } else {
            setResults([ ...results, -1 ])
        }

        setTimeout(() => {
            setCurrentRound(currentRound + 1)
        }, 2500)
    }

    useEffect(async () => {
        // console.log(`Current Round: ${currentRound}`)
        if (currentRound < mangas.length && mangas[currentRound].pagelink === undefined) {
            let pagelink = await getPageLink(mangas[currentRound].chapterid)
            setPageLinks([ ...pageLinks, pagelink ])
            setGuessingState(0)
        }
    }, [currentRound])

    useEffect(() => {
        // if the result for the current round loaded, show the results in the modal
        if (currentRound === results.length - 1) {
            setGuessingState(1)
        }
    }, [results])

    if (currentRound < mangas.length) {
        return (
            <div className={styles['game']}>
                <div className={styles['manga-page-div']}>
                    {pageLinks[currentRound] === undefined ? 
                        <div style={{'color': 'white'}}>Loading...</div>
                    :
                        <img className={guessingState === 1 ? styles['manga-page-img-hidden'] : styles['manga-page-img']} alt="Couldn't load manga page" src={pageLinks[currentRound]} />
                    }
                    {guessingState === 1 && pageLinks[currentRound] !== undefined ? 
                        <div className={styles['manga-page-modal']}>
                            {guessingState === 1 && results[currentRound] !== undefined && results[currentRound] !== 0 ?
                                <h3>You were {results[currentRound] === 1 ? "correct!" : "wrong!"}</h3>
                            :
                                <h3>Round Skipped</h3>
                            } 
                            <div className={styles['manga-page-modal-title']}>{mangas[currentRound].titles[0]}</div>
                            <div className={styles['icon-holder']}>
                                <a href={`https://mangadex.org/title/${mangas[currentRound].ref}`} target="_blank" rel="noopener noreferrer">
                                    Read here 
                                    <svg data-v-20f285ec="" data-v-e3b182be="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><path data-v-20f285ec="" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                </a>
                            </div>
                        </div>
                    :
                        <div style={{"display": "none"}}>You should not be seeing this</div>
                    }
                </div>
                <div className={styles['game-side']}>
                    <div className={multipleChoice ? styles['game-overlay'] : `${styles['game-overlay']} ${styles['game-overlay-autocomplete']}`}>
                        <h3>
                            <div className={styles['reset']}>
                                <span onClick={resetGame}>Reset</span>
                            </div>
                            <div className={styles['roundscore']}>
                                <span>
                                    <span>Round</span> 
                                    <span>{currentRound + 1} / {mangas.length}</span>
                                </span>
                                <span>
                                    <span>Score</span> 
                                    <span className={styles['score']}>{score}</span>
                                </span>
                            </div>
                        </h3>
                        {currentRound < mangas.length && multipleChoice ?
                            <MultipleChoice
                                titles={titles}
                                correctTitle={mangas[currentRound].titles[0]}
                                submit={onSubmit}
                                disabled={guessingState === 1}
                            />
                        :
                            <AutoSearchBar 
                                titles={titles}
                                submit={onSubmit}
                                disabled={guessingState === 1}
                            />
                        }
                    </div>
                    <div className={styles['history']}>
                        <div className={styles['history-logo']}>
                            <img 
                                src='/mangaquizlogo_light.svg' 
                                alt='Logo goes here'
                            />
                        </div>
                        <div className={styles['history-previews']}>
                            {mangas.filter((m, index) => index < currentRound).map((m, index, mangas) =>
                                <PreviewCard
                                    key={index}
                                    mangaRef={mangas[mangas.length - 1 - index].ref}
                                    title={`${mangas.length - index}. ${mangas[mangas.length - 1 - index].titles[0]}`}
                                    pageLink={pageLinks[mangas.length - index - 1]}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles['end-screen']}>
                <Link href='/'>
                    <a>
                        <Image 
                            src='/mangaquizlogo_light.svg' 
                            alt='Logo goes here'
                            width={150}
                            height={150}
                        />
                    </a>
                </Link>
                <div className={styles['results']}>
                    <h3>You got <span className={styles['score']}>{score}</span> out of {mangas.length} correct!</h3>
                    <button onClick={resetGame}>Play again?</button>
                </div>
                <div className={styles['previews']}>
                    {mangas && mangas.map((m, index) => 
                        <PreviewCard 
                            key={index}
                            mangaRef={m.ref}
                            title={m.titles[0]}
                            pageLink={pageLinks[index]}
                        />
                    )}
                </div>
            </div> 
        )
    }
}

function PreviewCard({ mangaRef, title, pageLink }) {
    return (
        <div className={styles['preview']}>
            <img src={pageLink}></img>
            <a href={`https://mangadex.org/title/${mangaRef}`} target="_blank" rel="noopener noreferrer">
                {title}
                <svg data-v-20f285ec="" data-v-e3b182be="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><path data-v-20f285ec="" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </a>
        </div>
    )
}