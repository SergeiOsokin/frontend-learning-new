import React, { useCallback, useState } from 'react';

export const FinishQuize = ({ result }) => {

    return (
        <section className="app-quiz --th-finish">
            <div className="app-quiz__inner">
                {/* Mid */}
                <div className="app-quiz__mid quiz-finish">
                    <img
                        src="./images/quiz/successfully.png"
                        alt=""
                        className="quiz-finish__img"
                    />
                    <h2 className="quiz-finish__title">Квиз пройден!</h2>
                    {/* <p className="quiz-finish__lower">15 верных и 5 неверных ответов</p> */}
                    <p className="quiz-finish__lower">Результаты</p>
                    <ul className="quiz-finish__results">
                        {result.map((el, ind) => {
                            return (
                                <li className={`quiz-finish__row ${el.isRight ? '' : '--th-red'}`} key={ind}>Слово: {el.translate} Ответ: {el.foreignWord}</li>
                            )
                        })}
                        {/* <li className="quiz-finish__row">To pursue</li>
                        <li className="quiz-finish__row --th-red">To pursue</li> */}
                    </ul>
                </div>
            </div>
        </section>

    )
}