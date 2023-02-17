import { useCallback, useState, useEffect } from 'react';
// import { useCallback, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
// import { AuthContext } from '../context/AuthContext';

export const useAuth = (data) => {
    const [authorization, setAuthorization] = useState(null);
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false); // для "модуля" авторизации
    const message = useMessage();
    const { request } = useHttp();
    // const history = useHistory();
    // что происходит после успешной авторизации
    const login = useCallback(() => {
        setAuthorization(true);
    }, []);
    // что делаем при разлогинивании
    const logout = useCallback(async () => {
        const req = await request('/deletecookie', 'DELETE');
        message('Выход выполнен')
        setAuthorization(false);
    }, []);
    // проверим, нет ли данных в cookie сейчас, чтобы сделать пользователя авторизованным. 
    useEffect(() => {
        async function fetchData() {
            try {
                const req = await request('/words/list', 'GET');
                if (req.message === 'Не авторизованы') {
                    return setAuthorization(false);
                }
                setAuthorization(true);
            } catch (error) {

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