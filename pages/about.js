import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/about.module.css'

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
                <section>
                    <h3>About</h3>
                    <p>MangaGuessr is in no way affiliated with MangaDex. This is just a hobby project made by one guy.</p>
                </section>
                <section>
                    <h3>How to play</h3>
                    <p>
                        <b>Filtering</b>
                        <br />
                        Pick any combination of tags to filter manga by. The tags are filtered with an <code>OR</code> operator.
                    </p>
                    <p>
                        <b>MangaDex Lists</b>
                        <br />
                        You can also choose to filter by Mangadex Lists. Doing so will disable filtering by tags. <br />
                        To create a list, go here <a target="_blank" rel="noopener noreferrer" className={styles['link']} href='https://mangadex.org/my/lists'>https://mangadex.org/my/lists</a>.  
                        Make sure to set the visibility as public! Make sure manga in the list have chapters that are readable on MangaDex. Some manga will redirect to the publisher's website to read there.
                        When completed, you should have a link that looks like <code>https://mangadex.org/list/37090567-b2d3-45e0-a1fe-5d75da2bd062/manga-guessr</code>.
                        Take the ID (in this case <code>37090567-b2d3-45e0-a1fe-5d75da2bd062</code>) and add it to the lists to filter by.
                    </p>
                </section>
                <section>
                    <h3>FAQ</h3>
                    <p>
                        <b>I'm stuck on the loading screen!</b>
                        <br />
                        Currently I'm hosting the server on a free Heroku instance. If you're the first one to play after a while, the server will take a few seconds to boot up, so just give it a few seconds.
                    </p>
                    <p>
                        <b>I'm getting pages that are scanlation groups!</b>
                        <br />
                        Unfortunately, that's inevitable. I cannot check every single manga and filter out their scanlation pages.
                    </p>
                </section>
            </main>

        </div>
    )
}
