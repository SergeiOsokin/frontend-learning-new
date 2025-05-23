//для работы с всплывающими сообщениями
//useCallback - чтобы реакт не уходил в циклическую рекурсию
// window.M - выводить текст. появляется при подключении import 'materialize-css'
import { useCallback } from 'react';

export const useMessage = () => {
    return useCallback(text => {
        console.log(text)

        if (window.M && text) {
            window.M.toast({ html: text, classes: 'message' })
        }
        // <div className='message'>{text}</div>
    }, []);
}

export const Messages = () => {
    return (
        <div class="app-toast-list">
            <div class="app-toast --th-green">
                <h3 class="app-toast__title">
                    Изменения сохранены
                </h3>
                <button class="line-btn-grey app-toast__close">
                    <svg class="icon" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L14.96 9M15 17L7.04 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
            <div class="app-toast --th-red">
                <h3 class="app-toast__title">
                    Произошла ошибка!
                </h3>
                <button class="line-btn-grey app-toast__close">
                    <svg class="icon" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L14.96 9M15 17L7.04 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        </div>)
}