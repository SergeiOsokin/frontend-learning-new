import React, { useState } from 'react';

export const FlashCard = ({ wordsArr }) => {
    // тусуем массив
    const mixArray = (array) => {
        var i = 0, j = 0, temp = null
        for (i = array.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1))
            temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array;
    }

    const [arrayWords, setArrayWords] = useState(mixArray(wordsArr).slice());
    const [rightAnswers, setRightAnswer] = useState(0);
    const [wrongAnswers, setWrongAnswer] = useState(0);
    let btnArr = ['foreignWord1', 'foreignWord2', 'foreignWord3', 'foreignWord4'];
    const [style, setStyle] = useState({
        shadow: 'none'
    })
    const [words, setWords] = useState({
        russianWord: arrayWords[0].russian_word,
        foreignWord: arrayWords[0].foreign_word,
        foreignWord1: arrayWords[0].foreign_word,
        foreignWord2: arrayWords[1].foreign_word,
        foreignWord3: arrayWords[2].foreign_word,
        foreignWord4: arrayWords[3].foreign_word,
    });

    console.log(wordsArr);

    // обновим массив, если осталось мало элементов
    if (arrayWords.length === 4) {
        setArrayWords(mixArray(wordsArr.slice()));
    }

    const checkAnswer = (e) => {
        mixArray(btnArr);
        // проверка на правильность слова
        const translateWord = document.querySelector('.card__word').getAttribute('translate')
        if (e.target.value === translateWord) {
            setRightAnswer(rightAnswers + 1);
            setStyle({
                shadow: 'inset 0px 0px 15px 0px #32CD32'
            });

            setTimeout(() => {
                // удалим правильный ответ
                arrayWords.shift();
                setStyle({ shadow: 'none' });
            }, 100);
        } else if (e.target.value !== translateWord) {
            setWrongAnswer(wrongAnswers + 1);
            setStyle({
                shadow: 'inset 0px 0px 15px 0px #f56262'
            });
            setTimeout(() => { setStyle({ shadow: 'none' }) }, 100);
        }
        // обновим слова
        setTimeout(() => {
            setWords({
                russianWord: arrayWords[0].russian_word,
                foreignWord: arrayWords[0].foreign_word,
                [btnArr[0]]: arrayWords[0].foreign_word,
                [btnArr[1]]: arrayWords[1].foreign_word,
                [btnArr[2]]: arrayWords[2].foreign_word,
                [btnArr[3]]: arrayWords[3].foreign_word,
            })
        }, 100);
    }

    const handleBtn = (e) => {
        checkAnswer(e);
    }

    return (
        <>
            {arrayWords.length === 4 && <div>Новый круг</div>}
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