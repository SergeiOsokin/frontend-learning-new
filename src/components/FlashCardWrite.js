import React, { useCallback, useState } from 'react';

export const FlashCardWrite = ({ wordsArr }) => {
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

    const [words, setWords] = useState({
        russianWord: arrayWords[0].russian_word,
        foreignWord: arrayWords[0].foreign_word,
    });

    const [userAnswer, setUserAnswer] = useState('');
    const [rightAnswers, setRightAnswer] = useState(0);
    const [wrongAnswers, setWrongAnswer] = useState(0);
    const [countWrong, setCountWrong] = useState(3);
    const [disable, setDisable] = useState(false);

    const changeWord = useCallback(() => {
        // setCountWrong(3);
        setWords({
            russianWord: arrayWords[0].russian_word,
            foreignWord: arrayWords[0].foreign_word,
        });
        setUserAnswer('');
        setDisable(false);
    }, []);

    // обновим массив, если осталось мало элементов
    if (arrayWords.length === 4) {
        setArrayWords(mixArray(wordsArr.slice()));
    }

    const checkAnswer = useCallback((e) => {
        // eslint-disable-next-line no-useless-escape
        const regexp = /[(,)\s\. ]\/*/gi; // удалим лишнее
        const answer = userAnswer.toUpperCase().trim().replace(regexp, '');
        const right = words.foreignWord.toUpperCase().replace(regexp, '');

        if (answer === right) {
            setRightAnswer(rightAnswers + 1);

            document.querySelector('.quiz-response-input').classList.add('--th-green');
            setTimeout(() => {
                arrayWords.shift();
                changeWord();
                document.querySelector('.quiz-response-input').classList.remove('--th-green');
            }, 100);
        } else if (answer !== right) {
            setWrongAnswer(wrongAnswers + 1);

            document.querySelector('.quiz-response-input').classList.add('--th-red');
            setTimeout(() => { document.querySelector('.quiz-response-input').classList.remove('--th-red'); }, 100);

            countWrong === 1 ?
                setCountWrong(words.foreignWord) :
                isNaN(countWrong) ?
                    setCountWrong(words.foreignWord) : setCountWrong(countWrong - 1);
        }
        // обновим слова
        setTimeout(() => {
            setWords({
                russianWord: arrayWords[0].russian_word,
                foreignWord: arrayWords[0].foreign_word,
            })
        }, 200);

    }, [changeWord, countWrong, rightAnswers, userAnswer, words.foreignWord, wrongAnswers])

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
            {/* <section className="section-card section-write-word" >
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
            </section> */}
            <>
                {/* Mid */}
                <div className="app-quiz__mid quiz-questions">
                    <h2 className="quiz-questions__title" translate={words.foreignWord}>{words.russianWord}</h2>
                    <input
                        type="text"
                        className="quiz-response-input"
                        placeholder="Перевод"
                        value={userAnswer}
                        onChange={hadleChange}
                        onKeyDown={onKeyDown}
                        disabled={disable}
                        autoComplete={'off'}
                    />
                    <button className="quiz-response-next btn btn-dark" onClick={handleBtn}>Продолжить</button>
                </div>
                {/* Footer */}
                <div className="app-quiz__footer">
                    <div className="quiz-progress">
                        <div className="quiz-progress__line">
                            <div className="quiz-progress__line-inner" style={{ width: (rightAnswers + wrongAnswers) + '%' }} />
                        </div>
                        <div className="quiz-progress__labels">
                            <p className="quiz-progress__label">{1 + rightAnswers + wrongAnswers} из {wordsArr.length}</p>
                            <p className="quiz-progress__label">{rightAnswers} правильных ответов</p>
                        </div>
                    </div>
                </div>
            </>

        </>
    )
}