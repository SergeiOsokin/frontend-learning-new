//
import React, { useEffect, useState, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { FinishQuize } from './FinishQuize';
import { validation } from '../hooks/validation.hook';
import { AuthContext } from '../context/AuthContext';

export const BaseTestForm = ({ testThemeId, testThemeName, setActive }) => {
    const { loading, request, clearError } = useHttp();
    const [result, setResult] = useState([])
    let btnArr = ['answer1', 'answer2', 'answer3', 'answer4'];
    const [questionArray, setQuestionArray] = useState();
    const [isFinish, setFinish] = useState(false);
    const [question, setQuestion] = useState([
        {
            question_text: '',
            right_answer: '',
            answer1: '',
            answer2: '',
            answer3: '',
            answer4: '',
        }
    ]);
    const message = useMessage();

    const [rightAnswers, setRightAnswer] = useState(0);
    const [wrongAnswers, setWrongAnswer] = useState(0);

    const mixArray = (array) => {
        var i = 0, j = 0, temp = null
        for (i = array.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1))
            temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array;
    };

    async function fetchData() {
        try {
            const data = await request(`/test/${testThemeId}`, 'GET', {});
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            setQuestionArray(data.data);
            setQuestion([
                {
                    question_text: data.data[0].question_text,
                    right_answer: data.data[0].right_answer,
                    answer1: data.data[0].wrong_answer_1,
                    answer2: data.data[0].wrong_answer_2,
                    answer3: data.data[0].wrong_answer_3,
                    answer4: data.data[0].right_answer,
                }
            ]);
        } catch (err) {
            message(err, false);
        }
    };

    const handleClose = (async (e) => {
        setActive(false)
    });

    const handleAnswer = (async (e) => {
        // e.preventDefault();
        mixArray(btnArr);

        const translateWord = document.querySelector('.quiz-questions__title').getAttribute('right_answer')
        if (e.target.value === translateWord) {
            setRightAnswer(rightAnswers + 1);
            e.target.closest('.quiz-responses__btn').classList.add('--th-green');

            setTimeout(() => {
                // удалим правильный ответ
                questionArray.shift();
                e.target.closest('.quiz-responses__btn').classList.remove('--th-green');
                if (questionArray.length === 0) { return setFinish(true) }
            }, 200);

            result.push({ foreignWord: e.target.value, translate: question[0].question_text, isRight: true });
        } else if (e.target.value !== translateWord) {
            setWrongAnswer(wrongAnswers + 1);
            e.target.closest('.quiz-responses__btn').classList.add('--th-red');

            setTimeout(() => {
                e.target.closest('.quiz-responses__btn').classList.remove('--th-red');
            }, 200);

            result.push({ foreignWord: e.target.value, translate: question[0].question_text, isRight: false });
        }
        // обновим слова
        setTimeout(() => {
            setQuestion([{
                question_text: questionArray[0].question_text,
                right_answer: questionArray[0].right_answer,
                [btnArr[0]]: questionArray[0].wrong_answer_1,
                [btnArr[1]]: questionArray[0].wrong_answer_2,
                [btnArr[2]]: questionArray[0].wrong_answer_3,
                [btnArr[3]]: questionArray[0].right_answer,
            }])
        }, 200);
    });

    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setActive(false);
            }
        });
        fetchData();
    }, []);

    return (
        <div className="test-modal">
            <div className="test-modal__inner">
                <button className="test-modal__close" onClick={handleClose}>
                    <svg className="icon" viewBox="0 0 32 32" fill="none">
                        <path
                            d="M2.6665 29.3327L29.1998 2.66602M29.3332 29.3327L2.79984 2.66602"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <h3 className="test-modal__title">Закрепляем тему: {testThemeName}</h3>

                {isFinish && <FinishQuize result={result} />}

                {!isFinish &&
                    <div className="test-wrapper">
                        <main className="app-main__mid">
                            {loading && <Loader />}
                            {(questionArray && !loading) &&
                                <div className="app-quiz__mid quiz-questions">
                                    <h2 className="quiz-questions__title" right_answer={question[0].right_answer}>{question[0].question_text}</h2>
                                    <ul className="quiz-responses">
                                        <li className="quiz-responses__item">
                                            <button className="quiz-responses__btn" name='btn1' value={question[0].answer1} onClick={handleAnswer}>
                                                {question[0].answer1}
                                            </button>
                                        </li>
                                        <li className="quiz-responses__item">
                                            <button className="quiz-responses__btn" name='btn2' value={question[0].answer2} onClick={handleAnswer}>
                                                {question[0].answer2}
                                            </button>
                                        </li>
                                        <li className="quiz-responses__item">
                                            <button className="quiz-responses__btn" name='btn3' value={question[0].answer3} onClick={handleAnswer}>
                                                {question[0].answer3}
                                            </button>
                                        </li>
                                        <li className="quiz-responses__item">
                                            <button className="quiz-responses__btn" name='btn4' value={question[0].answer4} onClick={handleAnswer}>
                                                {question[0].answer4}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            }
                        </main>
                    </div>
                }

                {/* {isFinish &&
                    <div className="app-quiz__footer">
                        <div className="quiz-progress">
                            <div className="quiz-progress__labels">
                                <p className="quiz-progress__label">{rightAnswers} правильных ответов. </p>
                            </div>
                        </div>
                    </div>
                } */}
            </div>
        </div >

    )
};