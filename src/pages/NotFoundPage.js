import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { HomeworkCard } from '../components/HomeworkCard';

export const NotFoundPage = () => {

    return (
        <section className="not-found">
            <h1 className="not-found__title"> Указанная страница не найдена</h1>
            <Link className="header__menu-enter" to="/">Перейти на главную</Link>
        </section>
    )
};