import {useState, useCallback} from 'react';
import { useMessage } from '../hooks/message.hook';

export const useHttp = () => {
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const header = {
        'Content-Type': 'application/json'
    };

    const request = useCallback (async (url, method, form = {}) => {
        
        setLoading(true);
        const body = JSON.stringify(form);
        const params = method === 'GET' ? { method, headers: header, credentials: 'include' } : { method, body, headers: header, credentials: 'include' };
        try{
            const response = await fetch(`http://localhost:3000${url}`, params);
            const data = await response.json();
            setLoading(false);
            if(!response.ok) {
                return setError(data || 'Что-то пошло не так'); 
            } else {
                return data;
            }
        } catch(e){
            setLoading(false); 
            setError(e.message);
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