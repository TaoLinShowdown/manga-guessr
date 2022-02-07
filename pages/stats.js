import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '../styles/stats.module.css'

const url = 'https://manga-guessr-server-staging.herokuapp.com'

export default function Stats() {
    const [ stats, setStats ] = useState([])
    const [ loading, setLoading ] = useState(true)

    useEffect(async () => {
        if (stats.length == 0 && loading) {
            try {
                let statsResp = await fetch(`${url}/manga/statistics`)
                let statsData = await statsResp.json()
                if (statsData.result === 'ok') {
                    setStats(statsData.statistics)
                }
                setLoading(false)
            } catch(e) {
                console.error('error on getting statistics')
                console.error(e)
                setLoading(false)
            }
        }
    }, [])

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
            <div className={styles['main']}>
                <Link href='/'>
                    <a>
                        <Image 
                            className={styles['link']}
                            src='/mangaquizlogo_light.svg' 
                            alt='Logo goes here'
                            width={150}
                            height={150}
                        />
                    </a>
                </Link>
                <h2>
                    Statistics
                </h2>
                {loading ?
                    <div>
                        Loading data...
                    </div>
                : !loading && stats.length === 9 ?
                    <>
                        <section className={styles['section']}>
                            <h3>Top 3 Most Played</h3>
                            <div className={styles['cards-container']}>
                                {stats.slice(0, 3).map((manga, index) => (
                                    <Card 
                                        key={index}
                                        manga={manga}
                                    />
                                ))}
                            </div>
                        </section>
                        <section className={styles['section']}>
                            <h3>Top 3 Most Correct</h3>
                            <div className={styles['cards-container']}>
                                {stats.slice(3, 6).map((manga, index) => (
                                    <Card 
                                        key={index}
                                        manga={manga}
                                    />
                                ))}
                            </div>
                        </section>
                        <section className={styles['section']}>
                            <h3>Top 3 Most Incorrect</h3>
                            <div className={styles['cards-container']}>
                                {stats.slice(6, 9).map((manga, index) => (
                                    <Card 
                                        key={index}
                                        manga={manga}
                                    />
                                ))}
                            </div>
                        </section>
                    </>
                :   
                    <div className={styles['section']}>
                        <h3>Stats aren&quot;t ready yet!</h3>
                        <p>Come back when more games have been played</p>
                    </div>
                }
            </div>
        </div>
    )
}

function Card({ manga }) {
    return (
        <div className={styles['card']}>
            <a href={`https://mangadex.org/title/${manga.id}`} target="_blank" rel="noopener noreferrer">
                <img src={manga.cover} alt='cover art'/>
            </a>
            <a href={`https://mangadex.org/title/${manga.id}`} target="_blank" rel="noopener noreferrer" className={styles['title']}>{manga.title}</a>
            <div>{manga.total_plays} times played</div>
            <div>{manga.times_correct} times correct</div>
        </div>
    )
}