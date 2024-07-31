import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { FlashCard } from '../components/FlashCard';
import { FlashCardWrite } from '../components/FlashCardWrite';

export const RepeatPage = () => {
    const { loading, request } = useHttp();
    const [isEasy, setEasy] = useState(true);
    const [easyHard, setEasyHard] = useState('сложнее');
    const [words, setWords] = useState(null);
    const [categories, setCategories] = useState(null);
    const [category, setCategory] = useState('Тестовая');

    const message = useMessage();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request(`/words/list`, 'GET');
                if (data.data.length < 10) {
                    return setWords(null)
                } else {
                    setCategories(data.data.map(el =>
                        el.category
                    ).reduce((acc, item, index) => {
                        if (acc.includes(item)) {
                            return acc;
                        }
                        return [...acc, item];
                    }, []));
                    setWords(data.data);
                }
            } catch (err) {
                message(err);
            }
        }
        fetchData()
    }, [message, request]);

    const selectHandler = (e) => {
        const categoryName = e.target.closest(".form__select").selectedOptions[0].getAttribute('value');
        console.log(categoryName)
        setCategory(e.target.value);
    };

    const handleClick = () => {
        setEasy(!isEasy);
        setEasyHard(easyHard === 'проще' ? 'сложнее' : 'проще')
    }

    return (
        <>
            <div className="section-repeat commonClass">
                {loading && <Loader />}
                {(!words && !loading) && <div className="section-repeat__empty-wordArr">Недостаточно слов для повторения (минимум 10)</div>}
                {(words && !loading) && <>
                    <input className="button button__change-test" type="button" value={`Сделать ${easyHard}`} onClick={handleClick} />

                    <div>
                        <label className="form__label" htmlFor="categoryWord">Выберите категорию для повторения</label>
                        <select className="form__select" name="categoryWord" onChange={selectHandler} disabled={loading} value={category}>
                            <option value="" key={-1}>Выберите катагорию</option>
                            {categories.map((element, index) => {
                                return (
                                    <option
                                        className="form__selected"
                                        key={index} info={index}
                                        value={element}
                                    >
                                        {element}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    {isEasy && <FlashCard wordsArr={words.filter(element => element.category = category)} />}
                    {!isEasy && <FlashCardWrite wordsArr={words} />}
                </>}
            </div>
        </>
    )
};