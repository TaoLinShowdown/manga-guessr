import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/game.module.css'
import GameSetup from '../components/GameSetup'
import GameComponent from '../components/GameComponent'
const url = 'https://manga-guessr-server-staging.herokuapp.com'

export default function Game() {
    let [ gameState, setGameState ] = useState(0) // 0:setup, 1:loading, 2:game
    let [ mangas, setMangas ] = useState([])
    let [ titles, setTitles ] = useState([])
    let [ defaultGameSettings, setDefaultGameSettings ] = useState({
        tags: [],
        lists: [],
        totalRounds: 10,
        tagsOrLists: false,
        enableMultiChoice: true
    })
    
    const getMangas = async (gameSettings) => {
        let urlAndParams
        if (!gameSettings.tagsOrLists) {
            urlAndParams = `${url}/manga/tags?totalRounds=${gameSettings.totalRounds}${gameSettings.tags.length > 0 ? '&tags[]=' + gameSettings.tags.join('&tags[]=') : ''}`
        } else {
            urlAndParams = `${url}/manga/lists?totalRounds=${gameSettings.totalRounds}${'&lists[]=' + gameSettings.lists.join('&lists[]=')}`
        }
        let mangasResponse = await fetch(urlAndParams, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        let mangasData = await mangasResponse.json()
        if (mangasData.result !== 'ok') {
            return 'error'
        } else {
            return mangasData.mangas
        }
    }

    const getTitles = async (gameSettings) => {
        if (gameSettings.enableMultiChoice) {
            let urlAndParams
            if (!gameSettings.tagsOrLists) {
                urlAndParams = `${url}/titles/tags${gameSettings.tags.length > 0 ? '?tags[]=' + gameSettings.tags.join('&tags[]=') : ''}`
            } else {
                urlAndParams = `${url}/titles/lists${'?lists[]=' + gameSettings.lists.join('&lists[]=')}`
            }
            let titlesReponse = await fetch(urlAndParams, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            let titlesData = await titlesReponse.json()
            if (titlesData.result !== 'ok') {
                return 'error'
            } else {
                return titlesData.titles
            }
        } else {
            let titlesReponse = await fetch(`${url}/titles`)
            let titlesData = await titlesReponse.json()
            if (titlesData.result !== 'ok') {
                return 'error'
            }
            let titlesList = titlesData.titles

            // if using lists and autocomplete, add the titles of mdlists to all titles
            if (gameSettings.tagsOrLists) {
                let listsParams = '?lists[]=' + gameSettings.lists.join('&lists[]=')
                let mdlistTitlesResponse = await fetch(`${url}/titles/lists${listsParams}&all=true`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                })
                let mdlistTitlesData = await mdlistTitlesResponse.json()
                if (mdlistTitlesData.result !== 'ok') {
                    return 'error'
                }
                let mdlistTitles = mdlistTitlesData.titles
                for (let titleToAdd of mdlistTitles) {
                    if (!titlesList.includes(titleToAdd)) titlesList.push(titleToAdd)
                }
            }

            return titlesList
        }
    }

    const startGame = (gameSettings) => {
        setGameState(1)
        setDefaultGameSettings(gameSettings)
        Promise.all([getMangas(gameSettings), getTitles(gameSettings)])
            .then(([ mangas, titles ]) => {
                if (mangas === 'error' || titles === 'error') {
                    console.log('Error when getting mangas and titles, resetting game')
                    resetGame()
                } else {
                    setMangas(mangas)
                    setTitles(titles)
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
            setGameState(2)
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
                <GameSetup 
                    defaultGameSettings={defaultGameSettings}
                    startGame={startGame} 
                />
            : gameState === 1 ?
                <div className={styles['loading']}>
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
                    multipleChoice={defaultGameSettings.enableMultiChoice}
                    resetGame={resetGame}
                />
            }
        </div>
    )
}