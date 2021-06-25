import React, { useState } from 'react';

export const WriteWord = ({ wordsArr }) => {
    const randomIndexWord = Math.floor(Math.random() * (wordsArr.length - 0) + 0);
    const [word, setWord] = useState({
        rusWord: wordsArr[randomIndexWord].rusWord,
        engWord: wordsArr[randomIndexWord].engWord,
    });
    const [userAnswer, setUserAnswer] = useState('');
    const [rightAnswers, setRightAnswer] = useState(0);
    const [wrongAnswers, setWrongAnswer] = useState(0);
    const [countWrong, setCountWrong] = useState(3);
    const [disable, setDisable] = useState(false);
    const [style, setStyle] = useState({
        shadow: 'none'
    })

    const changeWord = () => {
        const randomIndexWordSecond = Math.floor(Math.random() * (wordsArr.length - 0) + 0);
        setCountWrong(3);
        setWord({
            rusWord: wordsArr[randomIndexWordSecond].rusWord,
            engWord: wordsArr[randomIndexWordSecond].engWord,
        });
        setUserAnswer('');
        setDisable(false);
    }

    const hadleChange = (e) => {
        setUserAnswer(e.target.value)
    }

    const handleBtn = (e) => {
        console.log(userAnswer === word.engWord)
        if (countWrong === 0) {
            setCountWrong(word.engWord);
            setDisable(true);
            setTimeout(() => { changeWord() }, 2000);
        }
        else if (userAnswer === word.engWord) {
            setRightAnswer(rightAnswers + 1);
            setStyle({
                shadow: 'inset 0px 0px 15px 0px #32CD32'
            });
            setTimeout(() => { setStyle({ shadow: 'none' }) }, 100);
            changeWord();
        } else if (userAnswer !== word.engWord) {
            setWrongAnswer(wrongAnswers + 1);
            setStyle({
                shadow: 'inset 0px 0px 15px 0px #f56262'
            });
            setTimeout(() => { setStyle({ shadow: 'none' }) }, 100);
            setCountWrong(countWrong - 1);
        }
    }

    return (
        <>
            <section className="section-card section-write-word" >
                <div className="card" >
                    <div>Правильных ответов {rightAnswers}</div>
                    <div>Неправильных ответов {wrongAnswers}</div>
                    <p className="card__word card__word_write" translate={word.engWord}>{word.rusWord}</p>
                    <div className="card__container-button word-check" style={{ boxShadow: style.shadow }}>
                        <span className="input-right-answer" >Попыток до подсказки: {countWrong}</span>
                        <input
                            className="input-answer"
                            name="inputAnswer"
                            type="text"
                            value={userAnswer}
                            onChange={hadleChange}
                            placeholder="введите ответ на английском"
                            disabled={disable}
                        />
                        <button
                            className="card-button browser-default"
                            name='btnCheck'
                            onClick={handleBtn}
                            disabled={disable}
                        >
                            Проверить
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}