import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { HomeworkCard } from '../components/HomeworkCard';

export const NotFoundPage = () => {
    const { loading, request } = useHttp();
    const message = useMessage();


    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request('/404', 'GET', {});
            } catch (error) {
                message(error, false)
            }
        }
        fetchData();
    }, []);

    return (
        <section className="not-found">
            <h1 className="not-found__title"> Указанная страница не найдена</h1>
            <Link className="header__menu-enter" to="/">Перейти на главную</Link>
        </section>
    )
};