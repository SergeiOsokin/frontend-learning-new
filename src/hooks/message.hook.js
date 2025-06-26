//для работы с всплывающими сообщениями
//useCallback - чтобы реакт не уходил в циклическую рекурсию
// window.M - выводить текст. появляется при подключении import 'materialize-css'
import { useCallback } from 'react';

export const useMessage = () => {
    return useCallback((text, type) => {

        if (window.M && type === true) {
            window.M.toast({
                html: `
                    <div class="app-toast-list">
                        <div class="app-toast --th-green">
                            <p class="app-toast__title">${text}</p>
                            <button class="line-btn-grey app-toast__close">
                                <svg class="icon" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M7 17L14.96 9M15 17L7.04 9"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>
` })
        } else if (window.M && type === false) {
            window.M.toast({
                html: `
                <div class="app-toast-list">
                    <div class="app-toast --th-red">
                        <p class="app-toast__title">${text}</p>
                        <button class="line-btn-grey app-toast__close">
                            <svg class="icon" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M7 17L14.96 9M15 17L7.04 9"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                                    </svg>
                        </button>
                    </div>
                </div >
` })
        }
    });
}

// export const Messages = (text) => {
// return (
//     <div className="app-toast-list">
//         <div className="app-toast --th-green">
//             <h3 className="app-toast__title">
//                 Изменения сохранены
//             </h3>
//             <button className="line-btn-grey app-toast__close">
//                 <svg className="icon" viewBox="0 0 24 24" fill="none">
//                     <path d="M7 17L14.96 9M15 17L7.04 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
//                 </svg>
//             </button>
//         </div>

//     </div>)
// }