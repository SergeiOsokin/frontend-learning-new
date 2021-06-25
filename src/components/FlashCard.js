import React, { useState } from 'react';

export const FlashCardForm = ({ wordsArr }) => {
    const randomIndexWordFirst = Math.floor(Math.random() * (wordsArr.length - 0) + 0);
    const [words, setWords] = useState({
        rusWord: wordsArr[randomIndexWordFirst].rusWord,
        rusWordTrans: wordsArr[randomIndexWordFirst].engWord,
        engWord1: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].engWord,
        engWord2: wordsArr[randomIndexWordFirst].engWord,
        engWord3: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].engWord,
        engWord4: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].engWord,
    });
    const [rightAnswers, setRightAnswer] = useState(0);
    const [wrongAnswers, setWrongAnswer] = useState(0);
    let btnArr = ['engWord1', 'engWord2', 'engWord3', 'engWord4'];

    const [style, setStyle] = useState({
        shadow: 'none'
    })
    // тусуем кнопки, чтобы ответ был всегда в разном месте
    const changeBtn = () => {
        var i = 0, j = 0, temp = null
        for (i = btnArr.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1))
            temp = btnArr[i]
            btnArr[i] = btnArr[j]
            btnArr[j] = temp
        }
        return btnArr;
    }
    const handleBtn = (e) => {
        changeBtn();
        const randomIndexWordSecond = Math.floor(Math.random() * (wordsArr.length - 0) + 0);
        const transWord = document.querySelector('.card__word').getAttribute('translate')
        if (e.target.value === transWord) {
            setRightAnswer(rightAnswers + 1);
            setStyle({
                shadow: 'inset 0px 0px 15px 0px #32CD32'
            });
            setTimeout(() => { setStyle({ shadow: 'none' }) }, 100);
        } else if (e.target.value !== transWord) {
            setWrongAnswer(wrongAnswers + 1);
            setStyle({
                shadow: 'inset 0px 0px 15px 0px #f56262'
            });
            setTimeout(() => { setStyle({ shadow: 'none' }) }, 100);
        }
        setWords({
            rusWord: wordsArr[randomIndexWordSecond].rusWord,
            rusWordTrans: wordsArr[randomIndexWordSecond].engWord,
            [btnArr[0]]: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].engWord,
            [btnArr[1]]: wordsArr[randomIndexWordSecond].engWord,
            [btnArr[2]]: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].engWord,
            [btnArr[3]]: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].engWord,
        })
    }

    return (
        <>
            <section className="section-card">
                <div className="card">
                    <div>Правильных ответов {rightAnswers}</div>
                    <div>Неправильных ответов {wrongAnswers}</div>
                    <p className="card__word" translate={words.rusWordTrans}>{words.rusWord}</p>
                    <div className="card__container-button" style={{ boxShadow: style.shadow }}>
                        <button className="card-button browser-default" name='btn1' value={words.engWord1} onClick={handleBtn}>{words.engWord1}</button>
                        <button className="card-button browser-default" name='btn2' value={words.engWord2} onClick={handleBtn}>{words.engWord2}</button>
                        <button className="card-button browser-default" name='btn3' value={words.engWord3} onClick={handleBtn}>{words.engWord3}</button>
                        <button className="card-button browser-default" name='btn4' value={words.engWord4} onClick={handleBtn}>{words.engWord4}</button>
                    </div>
                </div>
            </section>
        </>
    )
}