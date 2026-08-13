import { useState, useCallback, useContext } from 'react';
import { host } from '../constants/const';
import { Link, useHistory } from 'react-router-dom';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';

export const useHttp = () => {
    const { authorization, logout } = useContext(AuthContext); // получаем контекст в объекте auth
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const history = useHistory();
    const message = useMessage();
    const header = {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=600'
    };

    const request = useCallback(async (url, method, form = {}) => {
        setLoading(true);
        const body = JSON.stringify(form);
        const params = method === 'GET' ? { method, headers: header, credentials: 'include' } : { method, body, headers: header, credentials: 'include' };
        try {
            const response = await fetch(`${host}${url}`, params);
            const data = await response.json();
            setLoading(false);

            console.log(response.status)

            // Тут проверить что не возвращается ошибка, чтобы сделать разлогинивание
            if (data.hasOwnProperty('error')) {
                if (response.status === (401 || 403)) {
                    logout();
                    history.push('/authorization');
                    message(data.error, false);
                }

                return data;
            }

            return data;
        } catch (error) {
            setLoading(false);
            message(error, false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []); // очищаем ошибки

    return {
        loading,
        error,
        request,
        clearError
    };
}