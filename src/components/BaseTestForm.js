//
import React, { useEffect, useState, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';
import { AuthContext } from '../context/AuthContext';

export const BaseTestForm = ({ testThemeId, testThemeName, setActive }) => {
    const { loading, request, clearError } = useHttp();
    const [question, setQuestion] = useState([
        {
            question_text: '',
            wrong_answer_1: '',
            wrong_answer_2: '',
            wrong_answer_3: '', 
            right_answer: ''
        }
    ]);
    const message = useMessage();

    async function fetchData() {
        try {
            const data = await request(`/test/${testThemeId}`, 'GET', {});
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            setQuestion(data.data);
        } catch (err) {
            message(err, false);
        }
    }

    const handleClose = (async (e) => {
        setActive(false)
        // e.preventDefault();
        // try {
        //     const data = await request('/words/add', 'POST', word);
        //     if (data === undefined) {
        //         return
        //     }
        //     message(data.message, true);
        //     setWords({
        //         russianWord: '',
        //         foreignWord: '',
        //         categoryWord: '',
        //     })
        //     document.querySelector(".form__select").value = ""
        // } catch (err) {
        //     message(err, false);
        // }
    });

    const handleAnswer = (async (e) => {
        e.preventDefault();
        window.alert('Pushed')
        // try {
        //     const data = await request('/words/add', 'POST', word);
        //     if (data.hasOwnProperty('error')) {
        //         message(data.message || data.error, false);
        //         return;
        //     }
        //     message(data.message, true);
        //     setWords({
        //         russianWord: '',
        //         foreignWord: '',
        //         categoryWord: '',
        //     })
        //     // document.querySelector(".form__select").value = ""
        // } catch (err) {
        //     message(err, false);
        // }
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
                <div className="test-wrapper">
                    <main className="app-main__mid">
                        {loading && <Loader />}
                        <div className="app-quiz__mid quiz-questions">
                            <h2 className="quiz-questions__title" translate={question[0].foreignWord}>{question[0].question_text}</h2>
                            <ul className="quiz-responses">
                                <li className="quiz-responses__item">
                                    <button className="quiz-responses__btn" name='btn1' value={question[0].wrong_answer_1} onClick={handleAnswer}>
                                        {question[0].wrong_answer_1}
                                    </button>
                                </li>
                                <li className="quiz-responses__item">
                                    <button className="quiz-responses__btn" name='btn2' value={question[0].wrong_answer_2} onClick={handleAnswer}>
                                        {question[0].wrong_answer_2}
                                    </button>
                                </li>
                                <li className="quiz-responses__item">
                                    <button className="quiz-responses__btn" name='btn3' value={question[0].foreignWord3} onClick={handleAnswer}>
                                        {question[0].wrong_answer_3}
                                    </button>
                                </li>
                                <li className="quiz-responses__item">
                                    <button className="quiz-responses__btn" name='btn4' value={question[0].right_answer} onClick={handleAnswer}>
                                        {question[0].right_answer}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </main>
                </div>
                {/* <div className="create-word__bot">
                    <button disabled="" className="create-word__cancel btn btn-dark-outline" onClick={handleClose}>
                        Отменить
                    </button>
                    <button disabled="" className="create-word__save btn btn-dark" onClick={handleSubmit}>
                        Сохранить
                    </button>
                </div> */}
            </div>
        </div >

    )
};