import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { FlashCard } from '../components/FlashCard';
import { Header } from '../components/Header';
import { FlashCardWrite } from '../components/FlashCardWrite';

export const RepeatPage = () => {
    const { loading, request } = useHttp();
    const [isEasy, setEasy] = useState(true);
    const [easyHard, setEasyHard] = useState('сложнее');
    const [words, setWords] = useState(null);

    const message = useMessage();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request(`/words/wordslist`, 'GET');
                if (data.data.length < 4) {
                    return setWords(null)
                } else {
                    setWords(data.data);
                }
            } catch (err) {
                message(err);
            }
        }
        fetchData()
    });

    const handleClick = () => {
        setEasy(!isEasy);
        setEasyHard(easyHard === 'проще' ? 'сложнее' : 'проще')
    }

    return (
        <>
            <Header />
            <div className="section-repeat">
                {loading && <Loader />}
                {(!words && !loading) && <div className="section-repeat__empty-wordArr">Недостаточно слов для повторения (минимум 4)</div>}
                {(words && !loading) && <>
                    <input className="button button__change-test" type="button" value={`Сделать ${easyHard}`} onClick={handleClick} />
                    {isEasy && <FlashCard wordsArr={words} />}
                    {!isEasy && <FlashCardWrite wordsArr={words} />}
                </>}
            </div>
        </>
    )
};