//для работы с всплывающими сообщениями
//useCallback - чтобы реакт не уходил в циклическую рекурсию
// window.M - выводить текст. появляется при подключении import 'materialize-css'
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom';

export const Cookies = () => {

    const STORAGE_KEY = 'cookie_consent';

    const acceptCookies = () => {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        document.querySelector('.cookie-banner').style.display = 'none';
        loadAnalytics();
    }
    const rejectCookies = () => {
        localStorage.setItem(STORAGE_KEY, 'rejected');
        document.querySelector('.cookie-banner').style.display = 'none';
    };

    function loadAnalytics() {
        // Загружаем Яндекс Метрику
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://mc.yandex.ru/metrika/tag.js';
        script.type = 'text/javascript';
        document.body.appendChild(script);

        script.textContent = `(function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
            m[i].l = 1 * new Date();
            for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
            k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
        })
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(103009792, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true
        });`
        console.log('ЯМ включена т.к. ' + localStorage.getItem(STORAGE_KEY))
    }

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            document.querySelector('.cookie-banner').style.display = 'block';
        } else if (saved === 'accepted') {
            loadAnalytics();
        }

        console.log(saved)
    }, []);

    return (
        <div name="cookie-banner" className='cookie-banner' >
            <div >
                <p className="cookie-banner__text" >
                    Этот сайт использует cookies для работы и аналитики. Подробнее в
                    <Link to="/privacy" className="o-footer__label o-footer__link">Политика конфиденциальности
                    </Link>
                </p>
                <div className="cookie-banner__bottoms" >
                    <button
                        onClick={acceptCookies}
                        className="cookie-banner__bottom_accept"
                    >
                        Принять все
                    </button>
                    <button
                        onClick={rejectCookies}
                        className="cookie-banner__bottom_reject"
                    >
                        Принять только необходимые для работы
                    </button>
                </div>
            </div>
        </div>
    )
}