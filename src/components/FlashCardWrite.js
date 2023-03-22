import React, { useCallback, useState } from 'react';

export const FlashCardWrite = ({ wordsArr }) => {
    const randomIndexWord = Math.floor(Math.random() * (wordsArr.length - 0) + 0);
    const [word, setWord] = useState({
        russianWord: wordsArr[randomIndexWord].russian_word,
        foreignWord: wordsArr[randomIndexWord].foreign_word,
    });
    const [userAnswer, setUserAnswer] = useState('');
    const [rightAnswers, setRightAnswer] = useState(0);
    const [wrongAnswers, setWrongAnswer] = useState(0);
    const [countWrong, setCountWrong] = useState(3);
    const [disable, setDisable] = useState(false);
    const [style, setStyle] = useState({
        shadow: 'none'
    })

    const changeWord = useCallback(() => {
        const randomIndexWordSecond = Math.floor(Math.random() * (wordsArr.length - 0) + 0);
        setCountWrong(3);
        setWord({
            russianWord: wordsArr[randomIndexWordSecond].russian_word,
            foreignWord: wordsArr[randomIndexWordSecond].foreign_word,
        });
        setUserAnswer('');
        setDisable(false);
    }, [wordsArr]);

    const checkAnswer = useCallback(() => {
        // eslint-disable-next-line no-useless-escape
        const regexp = /[(,)\s\. ]\/*/gi; // удалим лишнее
        const answer = userAnswer.toUpperCase().trim().replace(regexp, '');
        const right = word.foreignWord.toUpperCase().replace(regexp, '');
        
        if (answer === right) {
            setRightAnswer(rightAnswers + 1);
            setStyle({
                shadow: 'inset 0px 0px 15px 0px #32CD32'
            });
            setTimeout(() => { setStyle({ shadow: 'none' }) }, 100);
            changeWord();
        } else if (answer !== right) {
            setWrongAnswer(wrongAnswers + 1);
            setStyle({
                shadow: 'inset 0px 0px 15px 0px #f56262'
            });
            setTimeout(() => { setStyle({ shadow: 'none' }) }, 100);

            countWrong === 1 ?
                setCountWrong(word.foreignWord) :
                isNaN(countWrong) ?
                    setCountWrong(word.foreignWord) : setCountWrong(countWrong - 1);
        }
    }, [changeWord, countWrong, rightAnswers, userAnswer, word.foreignWord, wrongAnswers])

    const hadleChange = useCallback((e) => {
        setUserAnswer(e.target.value)
    }, []);

    const onKeyDown = useCallback((e) => {
        if (e.code === 'Enter') {
            checkAnswer(e);
        }
    }, [checkAnswer]);

    const handleBtn = useCallback((e) => {
        checkAnswer(e);
    }, [checkAnswer]);

    return (
        <>
            <section className="section-card section-write-word" >
                <main className="card" >
                    <h1 className="card__title">Напишите правильный перевод</h1>
                    <div className="card__counts">
                        <p className="card__right-count">Правильных ответов {rightAnswers}</p>
                        <p className="card__wrong-count">Неправильных ответов {wrongAnswers}</p>
                    </div>
                    <p className="card__word card__word_write" translate={word.foreignWord}>{word.russianWord}</p>
                    <div className="card__container-button word-check" style={{ boxShadow: style.shadow }}>
                        <input
                            className="input"
                            name="input "
                            type="text"
                            value={userAnswer}
                            onChange={hadleChange}
                            onKeyDown={onKeyDown}
                            placeholder="введите перевод"
                            disabled={disable}
                            autoComplete={'off'}
                        />
                        <span className="card__hint" >{countWrong}</span>
                        <button
                            className="button card-button"
                            name='btnCheck'
                            onClick={handleBtn}
                            disabled={disable}
                        >
                            Проверить
                        </button>
                    </div>
                </main>
            </section>
        </>
    )
}