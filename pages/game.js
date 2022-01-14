import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/game.module.css'
import AutoSearchBar from '../components/AutoSearchBar'

export default function Game() {
    let [ mangas, setMangas ] = useState([])
    let [ titles, setTitles ] = useState([])
    let [ mdListInput, setMDListInput ] = useState('')
    let [ pageLinks, setPageLinks ] = useState([])
    let [ currentRound, setCurrentRound ] = useState(-1)
    let [ score, setScore ] = useState(0)
    let [ guess, setGuess ] = useState('')
    let [ gameState, setGameState ] = useState(0) // 0:setup, 1:loading, 2:guessing, 3:guessed, 4:finished
    let [ gameSettings, setGameSettings ] = useState({
        tags: [],
        lists: [],
        totalRounds: 10,
        tagsOrLists: false // false:tags, true:lists
    })
    const tagsList = ['Shounen',       'Shoujo',        'Seinen',
                      'Josei',         'Action',        'Adventure',
                      'Aliens',        'Animals',       'Comedy',
                      'Cooking',       'Crime',         'Crossdressing',
                      'Delinquents',   'Demons',        'Drama',
                      'Fantasy',       'Genderswap',    'Ghosts',
                      'Gyaru',         'Harem',         'Historical',
                      'Horror',        'Isekai',        'Mafia',
                      'Magic',         'Magical Girls', 'Martial Arts',
                      'Mecha',         'Medical',       'Military',
                      'Monster Girls', 'Monsters',      'Music',
                      'Mystery',       'Ninja',         'Office Workers',
                      'Philosophical', 'Police',        'Post-Apocalyptic',
                      'Psychological', 'Reverse Harem', 'Romance',
                      'Samurai',       'School Life',   'Sci-Fi',
                      'Slice of Life', 'Sports',        'Superhero',
                      'Supernatural',  'Survival',      'Thriller',
                      'Time Travel',   'Tragedy',       'Vampires',
                      'Video Games',   'Villainess',    'Virtual Reality',
                      'Zombies']

    const setTotalRounds = (e) => { 
        let value = e.target.value
        setGameSettings({ ...gameSettings, totalRounds: parseInt(value) })
    }

    const handleTagListSelect = (tag) => {
        if (gameSettings.tags.includes(tag)) {
            setGameSettings({
                ...gameSettings,
                tags: gameSettings.tags.filter(t => t !== tag)
            })
        } else {
            setGameSettings({
                ...gameSettings,
                tags: gameSettings.tags.concat([tag])
            })
        }
    }
    
    const getMangas = async () => {
        if (!gameSettings.tagsOrLists) {
            try {
                let mangasResponse = await fetch('https://manga-quiz-server.herokuapp.com/manga/tags', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        totalRounds: gameSettings.totalRounds,
                        tags: gameSettings.tags
                    })
                })
                let mangasData = await mangasResponse.json()
                setMangas(mangasData.mangas)
            } catch {
                console.log('uh oh')
            }
        } else {
            let mangasResponse = await fetch('https://manga-quiz-server.herokuapp.com/manga/lists', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    totalRounds: gameSettings.totalRounds,
                    lists: gameSettings.lists
                })
            })
            let mangasData = await mangasResponse.json()
            if (mangasData.result !== 'ok') {
                console.log('woopsies')
                setMangas(['error'])
            } else {
                setMangas(mangasData.mangas)
            }
        }
    }

    const getTitles = async () => {
        if (titles.length === 0) {
            let titlesReponse = await fetch('https://manga-quiz-server.herokuapp.com/titles')
            let titlesList = await titlesReponse.json()
            setTitles(titlesList)
        }
    }

    const getPageLink = async (chapterid) => {
        let athomeUrlResponse = await fetch(`https://manga-quiz-server.herokuapp.com/pagelink?chapterId=${chapterid}`)
        let athomeUrlData = await athomeUrlResponse.json()

        // in case of being ratelimited
        if (athomeUrlData.result === 'error') {
            let retry = athomeUrlData.retry
            console.log(`RATE LIMITED WAITING ${retry + 5} SECONDS`)
            await new Promise(resolve => setTimeout(resolve, (retry * 1000) + 5000)) // sleep
            athomeUrlResponse = await fetch(`https://manga-quiz-server.herokuapp.com/pagelink?chapterId=${chapterid}`)
            athomeUrlData = await athomeUrlResponse.json()
            return athomeUrlData.page
        } else {
            return athomeUrlData.page
        }
    }

    const startGame = () => {
        getMangas()
        getTitles()
        setGameState(1)
    }

    const onSubmit = (myguess) => {
        setGameState(3)
        setGuess(myguess)
        if (mangas[currentRound].titles.includes(myguess)) {
            setScore(score + 1)
        }

        setTimeout(() => {
            setGuess('')
            setCurrentRound(currentRound + 1)
        }, 2500)
    }

    const resetGame = () => {
        setGameState(0)
        setMangas([])
        setPageLinks([])
        setCurrentRound(-1)
        setScore(0)
    }

    useEffect(() => {
        if (mangas.length !== 0 && titles.length !== 0 && gameState === 1) {
            if (mangas.length === 1 && mangas[0] === 'error') {
                console.log('Error when getting mangas, resetting game')
                resetGame()
            } else { 
                if (gameSettings.tagsOrLists) { // if filtering by MDLists, add titles
                    for (const m of mangas) {
                        for (const t of m.titles) {
                            if (!titles.includes(t)) {
                                titles.push(t)
                            }
                        }
                    }
                }
                setGameState(3)
                setCurrentRound(0)
            }
        }
    }, [mangas, titles])

    useEffect(async () => {
        if (gameState === 3 && currentRound < gameSettings.totalRounds && currentRound > -1) {
            // load the game page
            let { chapterid } = mangas[currentRound]
            let pageLink = await getPageLink(chapterid)
            let temp = pageLinks
            temp.push(pageLink)
            setGameState(2)
            setPageLinks(temp)
        } else if (currentRound === gameSettings.totalRounds) {
            // end game
            setGuess('')
            setGameState(4) 
        }
    }, [currentRound])

    let game = <></>
    if (gameState === 0) { // setup
        game = (
            <div className={styles['game-setup']}>
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
                <section>
                    <h3>
                        Game Settings
                    </h3>
                    <p>
                        Number of rounds:
                        <select defaultValue={gameSettings.totalRounds} className={styles['total-rounds']} onChange={setTotalRounds}>
                            {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(n => 
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            )}
                        </select>
                    </p>
                    <div className={styles['filter-header']}>
                        <div>
                            <span className={!gameSettings.tagsOrLists ? styles['filter-enabled'] : styles['filter-disabled']}>Tags</span>
                            <label className={styles['filter-switch']}>
                                <input type='checkbox' checked={gameSettings.tagsOrLists} onChange={() => setGameSettings({ ...gameSettings, tagsOrLists: !gameSettings.tagsOrLists })} />
                                <span className={styles['filter-slider']}></span>
                            </label>
                            <span className={gameSettings.tagsOrLists ? styles['filter-enabled'] : styles['filter-disabled']}>Lists</span>
                        </div>
                        <button onClick={() => setGameSettings({ ...gameSettings, tags: [], lists: [] })}>Clear</button>
                    </div>
                    {!gameSettings.tagsOrLists ?
                        <div className={styles['tagslist']}>
                            <div className={styles['tagslist-tags']}>
                                {tagsList.map(tag => 
                                    <div 
                                        key={tag}
                                        className={gameSettings.tags.includes(tag) ? styles['tagslist-selected'] : styles['tagslist-deselected']}
                                        onClick={e => handleTagListSelect(tag)}>
                                        {tag}
                                    </div>
                                )}
                            </div>
                        </div>
                    :
                        <div className={styles['tagslist']}>
                            <div className={styles['add-list']}>
                                <input placeholder='MangaDex List ID' type='text' value={mdListInput} onChange={(e) => setMDListInput(e.target.value)}/>
                                <button onClick={(e) => {if (mdListInput.trim() !== '') setGameSettings({ ...gameSettings, lists: gameSettings.lists.concat([mdListInput]) }); 
                                                         setMDListInput('')}}>
                                    <svg data-v-20f285ec="" data-v-6b3fd699="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path data-v-20f285ec="" d="M12 5v14M5 12h14"></path></svg>
                                </button>
                            </div>
                            <div className={styles['lists']}>
                                {gameSettings.lists.map((l, index) => 
                                    <div key={index}>
                                        <span>{l}</span>
                                        <span onClick={() => {  let temp = gameSettings.lists; 
                                                                temp.splice(index, 1); 
                                                                setGameSettings({ ...gameSettings, lists: temp })}}>
                                            <svg data-v-20f285ec="" data-v-6b3fd699="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-20f285ec="" d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                    <button disabled={gameSettings.tagsOrLists && gameSettings.lists.length === 0} onClick={startGame}>Start</button>
                </section>
            </div>
        )
    } else if (gameState === 1) { // loading
        game = (
            <div className={styles['game-setup']}>
                <div className={styles['logo']}>
                    <Image 
                        src='/mangaquizlogo_light.svg' 
                        alt='Logo goes here'
                        width={150}
                        height={150}
                    />
                </div>
                <div className={styles['loading-bar']}>
                    <h3>Loading...</h3>
                </div>
            </div>
        )
    } else if (gameState === 2 || gameState === 3) { // game started
        game = (
            <div className={styles.game}>
                <div className={styles['manga-page-div']}>
                    {pageLinks[currentRound] === undefined ? 
                        <div style={{'color': 'white'}}>Loading...</div>
                    :
                        <img className={gameState === 3 ? styles['manga-page-img-hidden'] : styles['manga-page-img']} alt="Couldn't load manga page" src={pageLinks[currentRound]} />
                    }
                    {gameState === 3 && pageLinks[currentRound] !== undefined ? 
                        <div className={styles['manga-page-modal']}>
                            {guess !== '' ?
                                <h3>You were {mangas[currentRound].titles.includes(guess) ? "correct!" : "wrong!"}</h3>
                            :
                                <h3>Round Skipped</h3>
                            } 
                            <div className={styles['manga-page-modal-title']}>{mangas[currentRound].titles[0]}</div>
                            <div className={styles['icon-holder']}><a href={`https://mangadex.org/chapter/${mangas[currentRound].chapterid}`} target="_blank" rel="noopener noreferrer">
                                Read here 
                                <svg data-v-20f285ec="" data-v-e3b182be="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><path data-v-20f285ec="" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            </a></div>
                        </div>
                    :
                        <div style={{"display": "none"}}>You should not be seeing this</div>
                    }
                </div>
                <div className={styles['game-overlay']}>
                    <h3>
                        <div className={styles['logo']}>
                            <Image 
                                src='/mangaquizlogo_light.svg' 
                                alt='Logo goes here'
                                layout='fixed'
                                width={35}
                                height={35}
                            />
                            <span>MangaGuessr</span>
                        </div>
                        <div className={styles['roundscore']}>
                            <span>
                                <span>Round</span> 
                                <span>{currentRound + 1} / {gameSettings.totalRounds}</span>
                            </span>
                            <span>
                                <span>Score</span> 
                                <span className={styles['score']}>{score}</span>
                            </span>
                        </div>
                    </h3>
                    <AutoSearchBar 
                        titles={titles}
                        submit={onSubmit}
                        disabled={gameState === 3}
                    />
                </div>
            </div>
        )
    } else { // finished
        game = (
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
                    <h3>You got <span className={styles['score']}>{score}</span> out of {gameSettings.totalRounds} correct!</h3>
                    <button onClick={resetGame}>Play again?</button>
                </div>
                <div className={styles['previews']}>
                    {mangas && mangas.map(m => 
                        <div key={mangas.indexOf(m)} className={styles['preview']}>
                            <img src={pageLinks[mangas.indexOf(m)]}></img>
                            <a href={`https://mangadex.org/chapter/${m.chapterid}`} target="_blank" rel="noopener noreferrer">{m.titles[0]} <svg data-v-20f285ec="" data-v-e3b182be="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><path data-v-20f285ec="" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg></a>
                        </div>
                    )}
                </div>
            </div> 
        )
    }

    return (
        <div>
            <Head>
                <title>MangaGuessr</title>
                <meta name="Manga Quiz" content="Test your knowledge on manga" />
                <link rel="icon" href="/mangaquizlogo_light.svg" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" />
            </Head>
            {game}
        </div>
    )
}