import { useCallback, useState, useEffect, useContext } from 'react';
// import { useCallback, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';

export const useAuth = (data) => {
    const { userId } = useContext(AuthContext);
    const [authorization, setAuthorization] = useState(null);
    const [ready, setReady] = useState(false); // для "модуля" авторизации
    const message = useMessage();
    const { request } = useHttp();
    const history = useHistory();
    const arr = ['/authorization', '/recover', '/registration']
    // что происходит после успешной авторизации
    const login = useCallback(() => {
        setAuthorization(true);
    }, []);
    // что делаем при разлогинивании
    const logout = useCallback(async () => {
        const req = await request('/deletecookie', 'DELETE');
        message('Выход выполнен', true)
        setAuthorization(false);
        history.push('/authorization')
    }, []);
    // проверим, нет ли данных в cookie сейчас, чтобы сделать пользователя авторизованным. 
    
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request('/checkauth', 'GET');

                if (data.error) {
                    message('Вход в аккаунт не выполнен.', false);
                    setAuthorization(false);
                    // eslint-disable-next-line no-unused-expressions
                    return arr.includes(history.location.pathname) ? '' : history.push('/');
                };

                setAuthorization(true);
                // history.push('/flashcards');
                return history.location.pathname.length > 1 ? '' : history.push('/flashcards');
            } catch (error) {
                message(error, false)
            }
        }
        fetchData();

    }, [request])

    return {
        login,
        logout,
        authorization,
        userId,
        ready
    };
};