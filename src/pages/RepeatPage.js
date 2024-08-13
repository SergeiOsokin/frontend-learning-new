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
    const [category, setCategory] = useState(null);
    const [hand, setHand] = useState(true);

    const message = useMessage();

    console.log(words)

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request(`/words/list?category=${category}`, 'GET');
                if (data.data.length < 10) {
                    return setWords(null)
                } else {
                    setWords(data.data);
                }
            } catch (err) {
                message(err);
            }
        };
        async function fetchCategory() {
            try {
                const data = await request(`/category/get`, 'GET');
                setCategories(data.data)
            } catch (err) {
                message(err);
            }
        }
        fetchCategory();
        fetchData();
    }, [message, request, category]);

    const selectHandler = (e) => {
        const categoryName = e.target.closest(".form__select").selectedOptions[0].getAttribute('value');
        console.log(categoryName)
        setCategory(e.target.value);
        setHand(!hand);
    };

    const handleClick = () => {
        setEasy(!isEasy);
        setEasyHard(easyHard === 'проще' ? 'сложнее' : 'проще')
    };

    return (
        <>
            <div className="section-repeat commonClass">
                {loading && <Loader />}

                {(categories && !loading) && <div>
                    <label className="form__label" htmlFor="categoryWord">Категория для повторения</label>
                    <select className="form__select" name="categoryWord" onChange={selectHandler} disabled={loading} defaultValue={category}>
                        <option value="null" key={-1}>Все</option>
                        {categories.map((element, index) => {
                            return (
                                <option
                                    className="form__selected"
                                    key={index} info={index}
                                    value={element.category}
                                >
                                    {element.category}
                                </option>
                            )
                        })}
                    </select>
                </div>}

                {((!words || !categories) && !loading) && <div className="section-repeat__empty-wordArr">Недостаточно слов для повторения (минимум 10)</div>}

                {((words && categories) && !loading) && <>
                    <input className="button button__change-test" type="button" value={`Сделать ${easyHard}`} onClick={handleClick} />

                    {isEasy && <FlashCard wordsArr={words} />}
                    {!isEasy && <FlashCardWrite wordsArr={words} />}
                </>}
            </div>
        </>
    )
};