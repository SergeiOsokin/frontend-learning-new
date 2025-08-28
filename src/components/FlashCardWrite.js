import React, { useCallback, useState } from 'react';
import { FinishQuize } from './FinishQuize';

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
    const [result, setResult] = useState([])
    const [isFinish, setFinish] = useState(false);

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
    // if (arrayWords.length === 4) {
    //     setArrayWords(mixArray(wordsArr.slice()));
    // }

    const checkAnswer = useCallback((e) => {
        // eslint-disable-next-line no-useless-escape
        const regexp = /[(,)\s\. ]\/*/gi; // удалим лишнее
        const answer = userAnswer.toUpperCase().trim().replace(regexp, '');
        const right = words.foreignWord.toUpperCase().replace(regexp, '');

        if (answer === right) {
            setRightAnswer(rightAnswers + 1);

            document.querySelector('.quiz-response-input').classList.add('--th-green');
            result.push({ foreignWord: answer, translate: right, isRight: true });
            if (arrayWords.length === 5) { setFinish(true); return }
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
            result.push({ foreignWord: answer, translate: right, isRight: false });
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

            {isFinish && <FinishQuize result={result} />}
            {/* Mid */}
            {!isFinish &&
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
            }
            {isFinish &&
                <div className="app-quiz__footer">
                    <button className="quiz-reset btn btn-dark"
                        onClick={() => {
                            setFinish(false);
                            setArrayWords(mixArray(wordsArr.slice()));
                            rightAnswers(0);
                            wrongAnswers(0);
                            countWrong(3);
                        }}
                    >Новый квиз</button>
                </div>
            }
            {/* Footer */}
            <div className="app-quiz__footer">
                <div className="quiz-progress">
                    <div className="quiz-progress__line">
                        <div className="quiz-progress__line-inner" style={{ width: (rightAnswers) + '%' }} />
                    </div>
                    <div className="quiz-progress__labels">
                        <p className="quiz-progress__label">{1 + rightAnswers} из {wordsArr.length}</p>
                        <p className="quiz-progress__label">{rightAnswers} правильных ответов</p>
                    </div>
                </div>
            </div>
        </>
    )
}