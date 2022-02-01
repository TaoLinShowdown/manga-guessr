// code from https://dev.to/sandra_lewis/building-a-multi-range-slider-in-react-from-scratch-4dl1
import { useState, useRef, useCallback, useEffect } from "react";
import styles from '../styles/multirangeslider.module.css';

export default function MultiRangeSlider({ label, min, max, onChange, step, defaultMin, defaultMax }) {
    const [minVal, setMinVal] = useState(defaultMin);
    const [maxVal, setMaxVal] = useState(defaultMax);
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const range = useRef(null);

    function getPercent (value) {
        return Math.round(((value - min) / (max - min)) * 100);
    }

    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value); 
        
            if (range.current) {
                range.current.style.setProperty('left', `${minPercent}%`)
                range.current.style.setProperty('width', `${maxPercent - minPercent}%`)
            }
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);
        
            if (range.current) {
                range.current.style.setProperty('width', `${maxPercent - minPercent}%`)
            }
        }
    }, [maxVal, getPercent]);

    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    return (
        <div className={styles['container']}>  
            {label}
            <div className={styles['inputs']}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    ref={minValRef}
                    step={step}
                    onChange={(e) => {
                        const value = Math.min(+e.target.value, maxVal - step);
                        setMinVal(value);
                        e.target.value = value.toString();
                    }}
                    className={`${styles['thumb']} ${styles[`${minVal > max - 100 ? 'thumb--zindex-5' : 'thumb--zindex-3'}`]}`}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    ref={maxValRef}
                    step={step}
                    onChange={(e) => {
                        const value = Math.max(+e.target.value, minVal + step);
                        setMaxVal(value);
                        e.target.value = value.toString();
                    }}
                    className={`${styles['thumb']} ${styles['thumb--zindex-4']}`}
                />
                <div className={styles['slider-container']}>
                    <div className={styles['slider']}>
                        <div className={styles['slider__track']} />
                        <div className={styles['slider__range']} ref={range} />
                    </div>
                    <div className={styles['slider__left-value']}>{minVal === min ? 0 : minVal}</div>
                    <div className={styles['slider__right-value']}>{maxVal}</div>
                </div>
            </div>
        </div>
    );
};