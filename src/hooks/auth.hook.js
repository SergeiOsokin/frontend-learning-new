import { useCallback, useState, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';

export const useAuth = () => {
    const [authorization, setAuthorization] = useState(null);
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false); // для "модуля" авторизации
    const { request } = useHttp();
    // что происходит после успешной авторизации
    const login = useCallback((id) => {
        if(id) {
            setAuthorization(true);
            setUserId(id);
        }
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
    })

    return {
        login,
        logout,
        authorization,
        userId,
        ready
    };
};