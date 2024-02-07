import React, { useState, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { validation } from '../hooks/validation.hook';
import { Loader } from './Loader';

export const AppointForm = ({ props, setActive }) => {
    const { loading, request } = useHttp();
    const { validationInputs } = validation();
    const [form, setForm] = useState({
        student: '',
    });
    const message = useMessage();


    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        validationInputs(e);
    }

    const handleSubmit = (async (e) => {
        e.preventDefault()
        try {
            const data = await request(`/task/appoint/${props.id}`, 'POST', form);
            if (data === undefined) {
                return
            }
            message(data.message);
            setActive(false);
            setForm({
                student: '',
            })
        } catch (err) {
            message(err);
        }
    });

    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setActive(false);
            }
        });
    }, [setActive]);

    return (
        <>
            <section className="change-task-section commonClass">
                <div className="change-task-section__content">
                    <h3 className="change-task-section__title">Назначить задание</h3>
                    <span className="form__close" onClick={() => { setActive(false) }}></span>
                    <form className="form" name="add-word-form" onSubmit={handleSubmit}>
                        <fieldset>
                            <div>
                                <label className="form__label" htmlFor="student">Ученики</label>
                                <input
                                    id="student"
                                    type="text"
                                    placeholder="Укажите учеников через ';'"
                                    name="student"
                                    onChange={changeHandler}
                                    value={form.student}
                                    className="input"
                                    autoComplete="off"
                                    disabled={loading}
                                    required maxLength="2000"
                                />
                            </div>
                        </fieldset>

                        {!loading && <div className="form__buttons-container">
                            <button
                                className={"button button-disable"}
                                disabled={true}
                            >Назначить</button>
                        </div>}

                        {loading && <Loader />}
                    </form>
                </div>
            </section>
        </>

    )
};