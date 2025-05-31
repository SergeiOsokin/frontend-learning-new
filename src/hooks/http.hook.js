import { useState, useCallback } from 'react';
import { host } from '../constants/const';
import { useMessage } from '../hooks/message.hook';

export const useHttp = () => {
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const message = useMessage();
    const header = {
        'Content-Type': 'application/json'
    };

    const request = useCallback(async (url, method, form = {}) => {

        setLoading(true);
        const body = JSON.stringify(form);
        const params = method === 'GET' ? { method, headers: header, credentials: 'include' } : { method, body, headers: header, credentials: 'include' };
        try {
            const response = await fetch(`${host}${url}`, params);
            const data = await response.json();
            
            setLoading(false);
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
    }
}