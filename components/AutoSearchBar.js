import React, { useEffect, useState } from 'react'
import Autocomplete from 'react-autocomplete'

export default function AutoSearchBar({ titles, submit, disabled }) {
    let [ value, setValue ] = useState('')

    return (
        <React.Fragment>
            <Autocomplete 
                getItemValue={(item) => item}
                items={titles}
                shouldItemRender={(item, value) => item.toLowerCase().indexOf(value.trim().toLowerCase()) > -1 && value.trim() !== ''}
                autoHighlight={true}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onSelect={(val) => setValue(val)}
                wrapperStyle={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                renderInput={(props) => {
                    return <input 
                        placeholder='Manga Title'
                        style={{
                            textAlign: 'center',
                            width: '96%',
                            padding: '5px 0',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            border: 'none',
                            backgroundColor: '#4f4f4f',
                            color: 'white',
                            borderRadius: '1px',
                            outline:'rgb(255, 103, 64, 0) 1px solid',
                            transition: 'all .2s ease-out',
                        }} {...props} />
                }}
                renderMenu={(items, value, style) => {
                    return <div 
                            style={{ 
                                ...style,
                                borderRadius: '3px',
                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                background: '#2c2c2c',
                                // padding: '2px 0',
                                fontSize: '90%',
                                position: 'fixed',
                                overflow: 'auto',
                                maxHeight: '50%',
                                // width: '85%',
                                left: 'none'
                            }} 
                            children={items.slice(0,15)}/>
                }}
                renderItem={(item, isHighlighted) =>
                    <div 
                        key={item}
                        style={{ 
                            background: isHighlighted ? 'rgb(255, 103, 64)' : '#464646',
                            textAlign: 'center',
                            padding: '5px',
                        }}>
                        {item}
                    </div>
                }
            />
            <button disabled={disabled} onClick={(e) => {setValue(''); submit(value.trim())}}>
                {disabled ? 
                    'Starting next round...'
                :
                    value.trim() === '' ? 'Skip' : 'Submit'
                }
            </button>
        </ React.Fragment>
    )
}