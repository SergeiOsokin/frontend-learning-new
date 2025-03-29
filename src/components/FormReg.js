import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';

export const FormReg = () => {
    const message = useMessage();
    const { validationInputs } = validation();
    const { loading, request } = useHttp();
    const history = useHistory();
    const [form, setForm] = useState({
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        validationInputs(e);
    };

    const registrHandler = async (e) => {
        e.preventDefault();
        try {
            const data = await request('/signup', 'POST', form);
            if (data === undefined) {
                return
            }
            message(data.message);
        } catch (e) {
            message(e);
        }
    };

    const moveHandler = (event) => {
        history.push('/authorization');
    }

    return (
        // <section className={"registration form-section"}>
        //     <div className="registration form-content">
        //         <h3 className={"registration authorization__title form-title"}>Регистрация</h3>
        //         <form className="form" name="entrance" onSubmit={registrHandler}>
        //             <fieldset>
        //                 <div>
        //                     {/* <label htmlFor="email" className="form__label">Email</label> */}
        //                     <input
        //                         id="email"
        //                         type="email"
        //                         placeholder="Email"
        //                         name="email"
        //                         onChange={changeHandler}
        //                         className="input"
        //                         required maxLength="30" minLength="2"
        //                         pattern="[a-zA-Z0-1\W\D]{1,}@[[a-zA-Z0-1\W\D]{1,}\.[a-zA-Z]{2,3}"
        //                         value={form.email}
        //                         autoComplete="off"
        //                         disabled={loading}
        //                     />
        //                     <div className="form__error"></div>
        //                 </div>
        //                 <div>
        //                     {/* <label htmlFor="password" className="form__label">Пароль</label> */}
        //                     <input
        //                         id="password"
        //                         type="password"
        //                         placeholder="Пароль"
        //                         name="password"
        //                         className="input"
        //                         required minLength="6"
        //                         onChange={changeHandler}
        //                         value={form.password}
        //                         disabled={loading}
        //                     />
        //                     <div className="from__error"></div>
        //                 </div>
        //                 <div>
        //                     {/* <label htmlFor="password" className="form__label">Повторите пароль</label> */}
        //                     <input
        //                         id="password"
        //                         type="password"
        //                         placeholder="Повторите пароль"
        //                         name="passwordConfirm"
        //                         className="input"
        //                         required minLength="6"
        //                         onChange={changeHandler}
        //                         value={form.passwordConfirm}
        //                         disabled={loading}
        //                     />
        //                     <div className="from__error"></div>
        //                 </div>
        //             </fieldset>

        //             {!loading &&
        //                 <div className="form-buttons-container">
        //                     <button
        //                         className={"button button_registration "}
        //                         onClick={registrHandler}
        //                         disabled={true}
        //                     >Зарегистрироваться</button>
        //                 </div>
        //             }
        //             {loading && < Loader />}
        //         </form>
        //         <div className='form-text-block'>
        //             <p className='form-text'>Регистрируясь вы соглашаетесь с <Link className="form-link" to="/authorization">условиями использования</Link> и <Link className="form-link" to="/authorization">политикой конфиденциальности</Link></p>
        //         </div>
        //     </div>
        //     <div className='form-q'>
        //         <p className='form-text form-text_registration'>Есть аккаунт? <Link className="form-link form-link_registration" to="/authorization">Войти</Link></p>
        //     </div>
        // </section>
        <>
            <header className="o-header --th-simple">
                <div className="container o-header__inner">
                    <div className="o-header__logo">
                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M22.4142 22.4104C20.3099 24.5299 16.8829 24.5299 14.77 22.4104C14.435 22.0757 14.2289 21.7839 14.0828 21.5694C12.4939 19.1152 14.1516 17.073 12.7773 14.4043C12.2963 13.4689 11.6006 12.7653 11.3945 12.5593C11.1883 12.3534 10.4067 11.5811 9.35027 11.0748C6.63613 9.76192 4.65205 11.3837 2.29865 9.77908C2.11828 9.65895 1.8692 9.47016 1.57717 9.17841C-0.527152 7.05889 -0.527152 3.62648 1.58576 1.50696C3.91339 -0.827077 7.79565 -0.149175 9.23003 1.50696C9.40181 1.70433 9.4877 1.86737 9.66807 2.18487C11.2055 5.00803 9.89997 6.72423 11.1626 9.28996C11.6779 10.3454 12.3908 11.0662 12.6485 11.3151C12.9061 11.5725 13.6706 12.3276 14.7442 12.8339C17.4498 14.1039 19.3995 12.5508 21.7013 14.1382C21.8817 14.2584 22.1222 14.4472 22.4228 14.7389C24.5272 16.8499 24.5272 20.2908 22.4142 22.4104Z"
                                fill="url(#paint0_linear_4009_3568)"
                            />
                            <path
                                d="M18.4269 11.1429C21.5039 11.1429 23.9983 8.64844 23.9983 5.57143C23.9983 2.49441 21.5039 0 18.4269 0C15.3499 0 12.8555 2.49441 12.8555 5.57143C12.8555 8.64844 15.3499 11.1429 18.4269 11.1429Z"
                                fill="#DAFB59"
                            />
                            <path
                                d="M5.57143 24.0003C8.64844 24.0003 11.1429 21.5059 11.1429 18.4288C11.1429 15.3518 8.64844 12.8574 5.57143 12.8574C2.49441 12.8574 0 15.3518 0 18.4288C0 21.5059 2.49441 24.0003 5.57143 24.0003Z"
                                fill="#F6F6F1"
                            />
                            <defs>
                                <linearGradient
                                    id="paint0_linear_4009_3568"
                                    x1="11.6624"
                                    y1="-5.08184"
                                    x2="13.1863"
                                    y2="71.0581"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0.0729" stopColor="#DAFB59" />
                                    <stop offset="0.1024" stopColor="#D1F860" />
                                    <stop offset="0.1499" stopColor="#BAEE72" />
                                    <stop offset="0.2097" stopColor="#93DF8F" />
                                    <stop offset="0.2792" stopColor="#5DCAB8" />
                                    <stop offset="0.3561" stopColor="#19B0EC" />
                                    <stop offset="0.3825" stopColor="#00A6FF" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span>Learnew</span>
                    </div>
                    <div className="o-header__actions">
                        {/* <a className="o-header__login">
                            <svg className="icon" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M7 17V18C7 18.2652 7.10536 18.5196 7.29289 18.7071C7.48043 18.8946 7.73478 19 8 19H16C16.2652 19 16.5196 18.8946 16.7071 18.7071C16.8946 18.5196 17 18.2652 17 18V17C17 16.2044 16.6839 15.4413 16.1213 14.8787C15.5587 14.3161 14.7956 14 14 14H10C9.20435 14 8.44129 14.3161 7.87868 14.8787C7.31607 15.4413 7 16.2044 7 17ZM15 8C15 8.79565 14.6839 9.55871 14.1213 10.1213C13.5587 10.6839 12.7956 11 12 11C11.2044 11 10.4413 10.6839 9.87868 10.1213C9.31607 9.55871 9 8.79565 9 8C9 7.20435 9.31607 6.44129 9.87868 5.87868C10.4413 5.31607 11.2044 5 12 5C12.7956 5 13.5587 5.31607 14.1213 5.87868C14.6839 6.44129 15 7.20435 15 8Z"
                                    stroke="#F6F6F1"
                                    strokeWidth={2}
                                />
                            </svg>
                            <span>Войти</span>
                        </a> */}
                        <Link className="o-header__login" to="/authorization">
                            <svg className="icon" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M7 17V18C7 18.2652 7.10536 18.5196 7.29289 18.7071C7.48043 18.8946 7.73478 19 8 19H16C16.2652 19 16.5196 18.8946 16.7071 18.7071C16.8946 18.5196 17 18.2652 17 18V17C17 16.2044 16.6839 15.4413 16.1213 14.8787C15.5587 14.3161 14.7956 14 14 14H10C9.20435 14 8.44129 14.3161 7.87868 14.8787C7.31607 15.4413 7 16.2044 7 17ZM15 8C15 8.79565 14.6839 9.55871 14.1213 10.1213C13.5587 10.6839 12.7956 11 12 11C11.2044 11 10.4413 10.6839 9.87868 10.1213C9.31607 9.55871 9 8.79565 9 8C9 7.20435 9.31607 6.44129 9.87868 5.87868C10.4413 5.31607 11.2044 5 12 5C12.7956 5 13.5587 5.31607 14.1213 5.87868C14.6839 6.44129 15 7.20435 15 8Z"
                                    stroke="#F6F6F1"
                                    strokeWidth={2}
                                />
                            </svg>
                            <span>Войти</span>
                        </Link>
                        <button className="o-header__registration btn btn-green">
                            Зарегистрироваться
                        </button>
                    </div>
                </div>
            </header>
            <main className="o-form-page">
                <div className="container">
                    <div className="o-form-wrapper">
                        <form className="o-form" onSubmit={registrHandler}>
                            <h1 className="o-form__title">Регистрация</h1>
                            <div className="o-form__inner">
                                <div className="o-form__input">
                                    <input
                                        className="o-form__input-elem"
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        onChange={changeHandler}
                                        required maxLength="30" minLength="2"
                                        pattern="[a-zA-Z0-1\W\D]{1,}@[[a-zA-Z0-1\W\D]{1,}\.[a-zA-Z]{2,3}"
                                        value={form.email}
                                        autoComplete="off"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="o-form__input">
                                    <input
                                        className="o-form__input-elem"
                                        id="password"
                                        type="password"
                                        placeholder="Пароль"
                                        name="password"
                                        required minLength="6"
                                        onChange={changeHandler}
                                        value={form.password}
                                        disabled={loading}
                                    />
                                    <div className="o-form__input-icon">
                                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M3.933 13.909C3.46923 13.3594 3.1487 12.7036 3 12C3 11 7 6 12 6M19.6 9.8C20.2506 10.3987 20.7332 11.1571 21 12C21 13 18 18 12 18C11.686 18 11.38 17.986 11.082 17.96M5 19L19 5M15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12Z"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="o-form__input">
                                    <input
                                        className="o-form__input-elem"
                                        id="password"
                                        type="password"
                                        placeholder="Повторите пароль"
                                        name="passwordConfirm"
                                        required minLength="6"
                                        onChange={changeHandler}
                                        value={form.passwordConfirm}
                                        disabled={loading}
                                    />
                                    <div className="o-form__input-icon">
                                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M3.933 13.909C3.46923 13.3594 3.1487 12.7036 3 12C3 11 7 6 12 6M19.6 9.8C20.2506 10.3987 20.7332 11.1571 21 12C21 13 18 18 12 18C11.686 18 11.38 17.986 11.082 17.96M5 19L19 5M15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12Z"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <button className="o-form__action btn btn-dark">
                                Зарегистрироваться
                            </button>
                            <p className="o-form__police ">
                                Регистрируясь вы соглашаетесь с{" "}
                                <Link to="/">условиями использования</Link> и{" "}
                                <Link to="/">политикой конфиденциальности</Link>
                            </p>
                        </form>
                        <p className="o-form-wrapper__text">
                            Есть аккаунт? <Link to="/authorization">Вход</Link>
                        </p>
                    </div>
                </div>
            </main>
        </>

    )
};