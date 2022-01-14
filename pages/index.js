import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/home.module.css'

export default function Home() {
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

            <main className={styles['main']}>
                <Image 
                    src='/mangaquizlogo_light.svg' 
                    alt='Logo goes here'
                    width={300}
                    height={300}
                />
                <header><h1>MangaGuessr</h1></header>
                <Link href='/game'>
                    <div className={styles['button']}>Play</div>
                </Link>
                <Link href='/about'>
                    <div className={styles['button']}>About</div>
                </Link>
            </main>

        </div>
    )
}
