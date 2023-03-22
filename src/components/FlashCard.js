import React, { useState } from 'react';

export const FlashCard = ({ wordsArr }) => {
    const randomIndexWordFirst = Math.floor(Math.random() * (wordsArr.length - 0) + 0); //это для правильного ответа, при загрузке страницы
    const [rightAnswers, setRightAnswer] = useState(0);
    const [wrongAnswers, setWrongAnswer] = useState(0);
    let btnArr = ['foreignWord1', 'foreignWord2', 'foreignWord3', 'foreignWord4'];
    const [style, setStyle] = useState({
        shadow: 'none'
    })
    const [words, setWords] = useState({
        russianWord: wordsArr[randomIndexWordFirst].russian_word,
        foreignWord: wordsArr[randomIndexWordFirst].foreign_word,
        foreignWord1: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].foreign_word,
        foreignWord2: wordsArr[randomIndexWordFirst].foreign_word,
        foreignWord3: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].foreign_word,
        foreignWord4: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].foreign_word,
    });

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

    const checkAnswer = (e) => {
        changeBtn();
        const randomIndexWordSecond = Math.floor(Math.random() * (wordsArr.length - 0) + 0);; //это для правильного ответа, после выбора ответа
        const translateWord = document.querySelector('.card__word').getAttribute('translate')
        if (e.target.value === translateWord) {
            setRightAnswer(rightAnswers + 1);
            setStyle({
                shadow: 'inset 0px 0px 15px 0px #32CD32'
            });
            setTimeout(() => { setStyle({ shadow: 'none' }) }, 100);
        } else if (e.target.value !== translateWord) {
            setWrongAnswer(wrongAnswers + 1);
            setStyle({
                shadow: 'inset 0px 0px 15px 0px #f56262'
            });
            setTimeout(() => { setStyle({ shadow: 'none' }) }, 100);
        }
        // e.target.style.boxShadow = style.shadow;
        setWords({
            russianWord: wordsArr[randomIndexWordSecond].russian_word,
            foreignWord: wordsArr[randomIndexWordSecond].foreign_word,
            [btnArr[0]]: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].foreign_word,
            [btnArr[1]]: wordsArr[randomIndexWordSecond].foreign_word,
            [btnArr[2]]: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].foreign_word,
            [btnArr[3]]: wordsArr[Math.floor(Math.random() * (wordsArr.length - 0) + 0)].foreign_word,
        })
    }

    const handleBtn = (e) => {
        checkAnswer(e);
    }

    return (
        <>
            {/* {wordsArr.length < 4 && <div>Нет слов</div>} */}
            <section className="section-card">
                <main className="card">
                    <h1 className="card__title">Выберите правильный перевод</h1>
                    <div className="card__counts">
                        <p className="card__right-count">Правильных ответов {rightAnswers}</p>
                        <p className="card__wrong-count">Неправильных ответов {wrongAnswers}</p>
                    </div>
                    <p className="card__word" translate={words.foreignWord}>{words.russianWord}</p>
                    <div className="card__container-button" style={{ boxShadow: style.shadow }}>
                        <button className="button card-button" name='btn1' value={words.foreignWord1} onClick={handleBtn} >{words.foreignWord1}</button>
                        <button className="button card-button" name='btn2' value={words.foreignWord2} onClick={handleBtn} >{words.foreignWord2}</button>
                        <button className="button card-button" name='btn3' value={words.foreignWord3} onClick={handleBtn} >{words.foreignWord3}</button>
                        <button className="button card-button" name='btn4' value={words.foreignWord4} onClick={handleBtn} >{words.foreignWord4}</button>
                    </div>
                </main>
            </section>
        </>
    )
}

//