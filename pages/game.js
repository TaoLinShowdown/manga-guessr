import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/game.module.css'
import GameComponent from '../components/GameComponent'

export default function Game() {
    let [ mdListInput, setMDListInput ] = useState('')
    let [ gameState, setGameState ] = useState(0) // 0:setup, 1:loading, 2:game
    let [ gameSettings, setGameSettings ] = useState({
        tags: [],
        lists: [],
        totalRounds: 10,
        tagsOrLists: false, // false:tags, true:lists
        enableMultiChoice: true
    })
    let [ mangas, setMangas ] = useState([])
    let [ titles, setTitles ] = useState([])

    const tagsList = ['Shounen',       'Shoujo',        'Seinen',
                      'Josei',         'Action',        'Adventure',
                      'Aliens',        'Animals',       'Boys\' Love',       'Comedy',
                      'Cooking',       'Crime',         'Crossdressing',
                      'Delinquents',   'Demons',        'Drama',
                      'Fantasy',       'Genderswap',    'Ghosts',            'Girls\' Love',
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
        // setTitles([]) // This is so when we start the game, we generate a new set of titles that better fit the tags
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
            let mangasResponse = await fetch('https://manga-quiz-server.herokuapp.com/manga/tags', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    totalRounds: gameSettings.totalRounds,
                    tags: gameSettings.tags
                })
            })
            let mangasData = await mangasResponse.json()
            return mangasData.mangas
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
                return 'error'
            } else {
                return mangasData.mangas
            }
        }
    }

    const getTitles = async () => {
        if (gameSettings.enableMultiChoice) { // however, if the tags are changed, we do want to get the titles again
            if (!gameSettings.tagsOrLists) { // if using tags, get titles based on tags
                let titlesReponse = await fetch('https://manga-quiz-server.herokuapp.com/titles/tags', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        tags: gameSettings.tags
                    })
                })
                let titlesList = await titlesReponse.json()
                return titlesList
            } else { // if using lists, get titles based on manga in those lists
                let titlesReponse = await fetch('https://manga-quiz-server.herokuapp.com/titles/lists', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        lists: gameSettings.lists
                    })
                })
                let titlesList = await titlesReponse.json()
                return titlesList
            }
        } else { // if using autocomplete, just get all titles
            let titlesReponse = await fetch('https://manga-quiz-server.herokuapp.com/titles')
            let titlesList = await titlesReponse.json()

            // if using lists and autocomplete, add the titles of mdlists to all titles
            if (gameSettings.tagsOrLists) {
                let mdlistTitlesResponse = await fetch('https://manga-quiz-server.herokuapp.com/titles/lists', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        lists: gameSettings.lists
                    })
                })
                let mdlistTitles = await mdlistTitlesResponse.json()
                titlesList = titlesList.concat(mdlistTitles)
            }

            return titlesList
        }
    }

    const startGame = () => {
        setGameState(1)
        Promise.all([getMangas(), getTitles()])
            .then(([ mangas, titles ]) => {
                if (mangas === 'error') {
                    console.log('Error when getting mangas, resetting game')
                    resetGame()
                } else {
                    // generate rounds from mangas
                    let roundNumber = 0
                    let rounds = []
                    for (let manga of mangas) {
                        let round = {
                            ref: manga.ref,
                            chapterid: manga.chapterid
                        }
                        rounds.push(round)
                        roundNumber += 1
                    }
                    setMangas(mangas)
                    setTitles(titles)
                    setGameState(2)
                }
            })
    }

    const resetGame = () => {
        setGameState(0)
        setMangas([])
        setTitles([])
    }

    // check is both mangas and titles are loaded, if so start game
    useEffect(() => {
        if (mangas.length !== 0 && titles.length !== 0 && gameState === 1) {
            setGameState(3)
        }
    }, [mangas, titles])

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
            {gameState === 0 ? 
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
                            Number of Rounds
                            <select defaultValue={gameSettings.totalRounds} className={styles['total-rounds']} onChange={setTotalRounds}>
                                {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(n => 
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                )}
                            </select>
                        </p>
                        <p className={styles['multichoice']}>
                            <label className={gameSettings.enableMultiChoice ? styles['filter-enabled'] : styles['filter-disabled']}>
                                Multiple Choice
                                <input type='checkbox' checked={gameSettings.enableMultiChoice} onChange={() => setGameSettings({ ...gameSettings, enableMultiChoice: !gameSettings.enableMultiChoice })} />
                            </label>
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
            : gameState === 1 ?
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
            :
                <GameComponent 
                    mangas={mangas}
                    titles={titles} 
                    multipleChoice={gameSettings.enableMultiChoice}
                    resetGame={resetGame}
                />
            }
        </div>
    )
}