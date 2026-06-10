import { React, useEffect } from 'react';
import { NoteForm } from '../components/NoteForm';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useHttp } from '../hooks/http.hook';
import { Aside } from '../components/Aside';
import { MobileMenu } from '../components/MobileMenu'
import { FooterInner } from '../components/Footer';

export const EducationPage = () => {
    const history = useHistory();

    const handleCheckRole = (e) => {
        switch (e.target.name) {
            case 'teacher':
                history.push('/education/teacher')
                break;
            case 'student':
                history.push('/education/student')
                break;
            case 'call':
                history.push('/education/call')
                break;
            default:
        }
    }

    console.log(localStorage.getItem('typeUser').includes(2))

    return (
        <>
            <div className="app-inner">
                <Aside />
                <main className="app-main">
                    <header className="app-main__top">
                        <div className="app-main__left">
                            <h1 className="app-main__title">Обучение</h1>
                        </div>
                        <div className="app-main__right">
                            <div className="app-main__search search" />
                        </div>
                    </header>
                    <main className="app-main__mid">
                        <section className="app-role-select">
                            <ul className="app-role-select__grid">

                                {localStorage.getItem('typeUser').includes(1, 0) &&

                                    <li className="role-card --th-student">
                                        <button className="role-card__btn" name='student' onClick={handleCheckRole}>
                                            <span className="role-card__img" />
                                            <span className="role-card__title">Ученик</span>
                                            <span className="role-card__text">
                                                Выполнить задачи
                                            </span>
                                        </button>
                                    </li>

                                }

                                {localStorage.getItem('typeUser').includes(2, 0) &&

                                    <li className="role-card --th-teacher">
                                        <button className="role-card__btn" name='teacher' onClick={handleCheckRole}>
                                            <span className="role-card__img" />
                                            <span className="role-card__title">Преподаватель</span>
                                            <span className="role-card__text">
                                                Создать и назначить задачи
                                            </span>
                                        </button>
                                    </li>

                                }

                                {localStorage.getItem('typeUser').includes(0) &&
                                    <>

                                        <li className="role-card --th-student">
                                            <button className="role-card__btn" name='student' onClick={handleCheckRole}>
                                                <span className="role-card__img" />
                                                <span className="role-card__title">Ученик</span>
                                                <span className="role-card__text">
                                                    Выполнить задачи
                                                </span>
                                            </button>
                                        </li>

                                        <li className="role-card --th-teacher">
                                            <button className="role-card__btn" name='teacher' onClick={handleCheckRole}>
                                                <span className="role-card__img" />
                                                <span className="role-card__title">Преподаватель</span>
                                                <span className="role-card__text">
                                                    Создать и назначить задачи
                                                </span>
                                            </button>
                                        </li>
                                    </>
                                }

                            </ul>
                        </section>
                    </main>
                    <FooterInner />
                </main>
            </div>
            {/* <MobileMenu /> */}
        </>

    )
}