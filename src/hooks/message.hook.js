//для работы с всплывающими сообщениями
//useCallback - чтобы реакт не уходил в циклическую рекурсию
// window.M - выводить текст. появляется при подключении import 'materialize-css'
import { useCallback } from 'react';

export const useMessage = () => {
    // console.log('sdf')
    return useCallback(text => {
        if (window.M && text) {
            window.M.toast({html: text, classes: 'message'})
        }
        // <div className='message'>{text}</div>
    }, []);
}