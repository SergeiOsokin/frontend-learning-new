import { useCallback, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
    const [authorization, setAuthorization] = useState(null);
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false); // для "модуля" авторизации
    const { request } = useHttp();
    const history = useHistory();
    // что происходит после успешной авторизации
    const login = useCallback(() => {
        setAuthorization(true)
    }, []);
    // что делаем при разлогинивании
    const logout = useCallback(async () => {
        const req = await fetch('http://localhost:3000/deletecookie', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });
        setAuthorization(false);
    }, []);
    // проверим, нет ли данных в cookie сейчас, чтобы сделать пользователя авторизованным. 
    useEffect(() => {
        async function fetchData() {
            try {
                const req = await request('/words/wordslist', 'GET');
                if(req.message === 'Не авторизованы') {
                    return setAuthorization(false);
                }
                setAuthorization(true);
            } catch(error) {
               
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