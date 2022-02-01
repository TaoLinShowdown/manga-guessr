import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/game.setup.module.css'
import MultiRangeSlider from './MultiRangeSlider'

export default function GameSetup({ defaultGameSettings, startGame, saveToLocalStorage }) {
    const tagsList = [
        'Shounen',       'Shoujo',        'Seinen',
        'Josei',         'Action',        'Adventure',
        'Aliens',        'Animals',       'Boys\' Love',       
        'Comedy',        'Cooking',       'Crime',         
        'Crossdressing', 'Delinquents',      'Demons',        
        'Drama',         'Fantasy',          'Genderswap',    
        'Ghosts',        'Girls\' Love',     'Gyaru',         
        'Harem',         'Historical',       'Horror',        
        'Isekai',        'Mafia',            'Magic',         
        'Magical Girls', 'Martial Arts',     'Mecha',         
        'Medical',       'Military',         'Monster Girls', 
        'Monsters',      'Music',            'Mystery',       
        'Ninja',         'Office Workers',   'Philosophical', 
        'Police',        'Post-Apocalyptic',
        'Psychological', 'Reverse Harem', 'Romance',
        'Samurai',       'School Life',   'Sci-Fi',
        'Slice of Life', 'Sports',        'Superhero',
        'Supernatural',  'Survival',      'Thriller',
        'Time Travel',   'Tragedy',       'Vampires',
        'Video Games',   'Villainess',    'Virtual Reality',
        'Zombies'
    ]

    let [ totalRounds, setTotalRounds ] = useState(defaultGameSettings.totalRounds)
    let [ enableMultiChoice, setEnableMultiChoice ] = useState(defaultGameSettings.enableMultiChoice)
    let [ minYear, setMinYear ] = useState(defaultGameSettings.minYear)
    let [ maxYear, setMaxYear ] = useState(defaultGameSettings.maxYear)
    let [ minRating, setMinRating ] = useState(defaultGameSettings.minRating)
    let [ maxRating, setMaxRating ] = useState(defaultGameSettings.maxRating)
    let [ minFollows, setMinFollows ] = useState(defaultGameSettings.minFollows)
    let [ tagsOrLists, setTagsOrLists ] = useState(defaultGameSettings.tagsOrLists) // false: tags, true: lists
    let [ tags, setTags ] = useState(defaultGameSettings.tags)
    let [ mdListInput, setMDListInput ] = useState('')
    let [ lists, setLists ] = useState(defaultGameSettings.lists)

    const handleTagListSelect = (tag) => {
        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag))
        } else {
            setTags(tags.concat([tag]))
        }
    }

    const addList = () => {
        if (mdListInput.trim() !== '') {
            setLists([ ...lists, mdListInput ])
        }
        setMDListInput('')
    }

    const removeList = (index) => {
        let temp = [ ...lists ] // component doesn't rerender if you just do temp = lists
        temp.splice(index, 1)
        setLists(temp)
    }

    const clearSettings = () => {
        if (tagsOrLists) {
            setLists([])
        } else {
            setTags([])
        }
    }

    return (
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
                    <select defaultValue={totalRounds} className={styles['total-rounds']} onChange={(e) => setTotalRounds(e.target.value)}>
                        {[5, 10, 15, 20, 25].map(n => 
                            <option key={n} value={n}>
                                {n}
                            </option>
                        )}
                    </select>
                </p>
                <p className={styles['multichoice']}>
                    <label className={enableMultiChoice ? styles['filter-enabled'] : styles['filter-disabled']}>
                        Multiple Choice
                        <input type='checkbox' checked={enableMultiChoice} onChange={() => setEnableMultiChoice(!enableMultiChoice)} />
                    </label>
                </p>
                {!tagsOrLists ?
                    <>
                        <div className={styles['slider']}>
                            <MultiRangeSlider
                                label={'Year'}
                                min={1980}
                                max={2022}
                                defaultMin={defaultGameSettings.minYear}
                                defaultMax={defaultGameSettings.maxYear}
                                step={1}
                                onChange={(e) => {
                                    setMinYear(e.min === 1950 ? 0 : e.min);
                                    setMaxYear(e.max);
                                }}
                            />
                        </div>
                        <div className={styles['slider']}>
                            <MultiRangeSlider
                                label={'Rating'}
                                min={0}
                                max={10}
                                defaultMin={defaultGameSettings.minRating}
                                defaultMax={defaultGameSettings.maxRating}
                                step={0.1}
                                onChange={(e) => {
                                    setMinRating(e.min);
                                    setMaxRating(e.max);
                                }}
                            />
                        </div>
                        <p className={styles['follows']}>
                            Minimum Follows
                            <input type='number' min='0' value={`${minFollows}`} onChange={(e) => setMinFollows(e.target.value)} />
                        </p>
                    </> : <></>
                }
                <div className={styles['filter-header']}>
                    <div>
                        <span className={!tagsOrLists ? styles['filter-enabled'] : styles['filter-disabled']}>Tags</span>
                        <label className={styles['filter-switch']}>
                            <input type='checkbox' checked={tagsOrLists} onChange={() => setTagsOrLists(!tagsOrLists)} />
                            <span className={styles['filter-slider']}></span>
                        </label>
                        <span className={tagsOrLists ? styles['filter-enabled'] : styles['filter-disabled']}>Lists</span>
                    </div>
                    <button onClick={clearSettings}>Clear</button>
                </div>
                {!tagsOrLists ?
                    <div className={styles['tagslist']}>
                        <div className={styles['tagslist-tags']}>
                            {tagsList.map(tag => 
                                <div 
                                    key={tag}
                                    className={tags.includes(tag) ? styles['tagslist-selected'] : styles['tagslist-deselected']}
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
                            <button onClick={() => addList()}>
                                <svg data-v-20f285ec="" data-v-6b3fd699="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path data-v-20f285ec="" d="M12 5v14M5 12h14"></path></svg>
                            </button>
                        </div>
                        <div className={styles['lists']}>
                            {lists.map((l, index) => 
                                <div key={index}>
                                    <span>{l}</span>
                                    <span onClick={() => removeList(index)}>
                                        <svg data-v-20f285ec="" data-v-6b3fd699="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-20f285ec="" d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                }
                <div>
                    <button 
                        onClick={() => saveToLocalStorage({
                            tags, 
                            lists, 
                            totalRounds, 
                            tagsOrLists, 
                            enableMultiChoice, 
                            minYear, maxYear, 
                            minRating, maxRating, 
                            minFollows})}>Save</button>
                    <button 
                        disabled={tagsOrLists && lists.length === 0} 
                        onClick={() => startGame({
                            tags, 
                            lists, 
                            totalRounds, 
                            tagsOrLists, 
                            enableMultiChoice, 
                            minYear, maxYear, 
                            minRating, maxRating, 
                            minFollows})}>Start</button>
                </div>
            </section>
        </div>
    )
}