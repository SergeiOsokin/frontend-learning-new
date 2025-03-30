import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { WordFormChange } from './WordFormChange';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import trashIcon from '../../src/img/trash_icon.png';
import usePagination from "../hooks/pagination.hook";

export const WordsList = () => {
    const { loading, request } = useHttp();
    const history = useHistory();
    const [wordsArr, setWordsArr] = useState([]);
    const message = useMessage();
    const [inputValue, setInputValue] = useState('')
    const [wordInfo, setWordInfo] = useState({});
    const [active, setModalActive] = useState(false);
    const [countItems, setCountItems] = useState(30);

    const {
        firstContentIndex,
        lastContentIndex,
        nextPage,
        prevPage,
        page,
        totalPages,
    } = usePagination({
        contentPerPage: countItems,
        count: wordsArr.length || 0,
    });

    const handleItems = (e) => {
        document.querySelector('.pagination__settings-dropdown').classList.add('--th-active');
        console.log('work');
    }

    const handleItems2 = (e) => {
        document.querySelector('.pagination__settings-dropdown').classList.remove('--th-active');
        // document.querySelector('.pagination__settings-btn').classList.add('--th-current'); - найти "ближайший" с таким свойством
        setCountItems(e.target.value);
        console.log(e.target.value);
    }

    const tableSearch = () => {
        let phrase = document.querySelector('.words-section__input-search');
        let table = document.querySelector('.words-section__table-words');
        let regPhrase = new RegExp(phrase.value, 'i');
        let flag = false;
        for (let i = 1; i < table.rows.length; i++) {
            flag = false;
            for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
                // проверяем, есть ли введенные символы в ячейке
                flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
                if (flag) break;
            }
            if (flag) {
                table.rows[i].style.display = "";
            } else {
                table.rows[i].style.display = "none";
            }
        }
    }

    const handleChange = (e) => {
        setInputValue(e.target.value)
        tableSearch();
    }

    const handleClose = () => {
        setInputValue('');
        setTimeout(() => {
            tableSearch();
        }, 1)
    }

    const handleScrollUp = () => {
        if (window.pageYOffset > 0) {
            window.scrollBy(0, -80);
            setTimeout(handleScrollUp, 0);
        }
    }

    const deleteWord = useCallback(async (e) => {
        const decision = window.confirm('Удалить слово?');
        const [id] = e.target.closest(".word-string").getAttribute('info').split('+');
        if (decision) {
            try {
                const data = await request(`/words/delete/${id}`, 'DELETE', {}, {
                    credentials: 'include'
                });
                message(data.message);
                e.target.closest(".word-string").parentElement.removeChild(e.target.closest(".word-string"));
            } catch (e) {
                message(e);
            }
        }
    }, [message, request]);

    const changeWord = (e) => {
        const [id, foreign_word, russian_word, category, category_word_id] = e.target.closest(".word-string").getAttribute('info').split('+');
        setWordInfo({ id, foreign_word, russian_word, category, category_word_id });
        setModalActive(true);
    };

    // const scroll = () => {
    //     if (window.scrollY > 50) {
    //         document.querySelector('.button-back_to_top').classList.add('button-back_to_top-show');
    //     } else {
    //         document.querySelector('.button-back_to_top').classList.remove('button-back_to_top-show');
    //     }
    // }

    useEffect(() => {
        document.addEventListener('scroll', () => {
            // console.log(history.location.pathname === '/wordslist')
            // if (history.location.pathname === '/wordslist') {
            //     scroll();
            // }
        });
        async function fetchData() {
            try {
                const data = await request(`/words/list?category=null`, 'GET');
                if (data === undefined) {
                    return
                }
                if (data.data.length === 0) {
                    return message(data.message)
                } else {
                    setWordsArr(data.data);
                }
            } catch (err) {
                message(err);
            }
        }
        fetchData();
    }, [request, message, active]);

    return (
        // <section className="words-section commonClass">
        //     {active &&
        //         <WordFormChange wordInfo={wordInfo} setActive={setModalActive} />
        //     }

        //     {loading && <Loader />}

        //     <>
        //         <div className="words-section__input-container">
        //             <div className="input-container">
        //                 <input
        //                     placeholder="Поиск слова"
        //                     className="words-section__input-search input"
        //                     id="search" type="text"
        //                     autoComplete="off"
        //                     onChange={handleChange}
        //                     value={inputValue}
        //                 />
        //                 <span
        //                     className="words-section__button-clean"
        //                     onClick={handleClose}
        //                 ></span>
        //             </div>
        //             <div className="pagination">
        //                 <p className='pagination__text-count'>Отображать:
        //                     <select className="count-items" defaultValue={countItems} onChange={handleItems}>
        //                         <option value='30'>30</option>
        //                         <option value='50'>50</option>
        //                         <option value='100'>100</option>
        //                         <option value={wordsArr.length}>{wordsArr.length}</option>
        //                     </select>
        //                     слов
        //                 </p>
        //                 <button onClick={prevPage} className="pagination__page-previous">
        //                     &#60;
        //                 </button>
        //                 <p className="pagination__page-count">
        //                     Страница {page} из {totalPages}
        //                 </p>
        //                 <button onClick={nextPage} className="pagination__page-next">
        //                     &#62;
        //                 </button>
        //             </div>
        //         </div>

        //         <table className="words-section__table-words" >
        //             <caption>
        //                 Ваши слова
        //             </caption>
        //             <thead>
        //                 <tr>
        //                     {/* <th>№ п/п</th> */}
        //                     <th>Слово</th>
        //                     <th>Перевод</th>
        //                     <th className="category">Категория</th>
        //                     <th></th>
        //                     <th></th>
        //                 </tr>
        //             </thead>

        //             <tbody>
        //                 {wordsArr
        //                     .sort((a, b) => a.id - b.id)
        //                     .slice(firstContentIndex, lastContentIndex)
        //                     .map((word, index) => {
        //                         return (
        //                             <tr className="word-string"
        //                                 info={`${word.id}+${word.foreign_word}+${word.russian_word}+${word.category}+${word.category_word_id}`}
        //                                 key={word.id}
        //                             >
        //                                 {/* <td>{index + 1}</td> */}
        //                                 <td>{word.foreign_word}</td>
        //                                 <td>{word.russian_word}</td>
        //                                 <td className="category">{word.category}</td>
        //                                 <td>
        //                                     <button
        //                                         className="button button_table"
        //                                         onClick={changeWord}
        //                                     >
        //                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
        //                                             <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
        //                                             <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
        //                                         </svg>
        //                                     </button>
        //                                 </td>
        //                                 <td>
        //                                     <button
        //                                         className="button button_table-delete"
        //                                         onClick={deleteWord}
        //                                     ><img className="trash-icon" src={trashIcon} alt="Удалить"></img></button>
        //                                 </td>
        //                             </tr>
        //                         )
        //                     })}
        //             </tbody>
        //         </table>

        //         <button
        //             className="button button-back_to_top"
        //             onClick={handleScrollUp}
        //         >↑</button>
        //     </>
        // </section>
        <>
            {loading && <Loader />}

            <div className="app-inner">
                <aside className="app-aside">
                    <div className="app-aside__top">
                        <div className="app-aside__logo logo">
                            <svg viewBox="0 0 174 24" fill="none">
                                <path
                                    d="M22.4142 22.4104C20.3099 24.5299 16.8829 24.5299 14.77 22.4104C14.435 22.0757 14.2289 21.7839 14.0828 21.5694C12.4939 19.1152 14.1516 17.073 12.7773 14.4043C12.2963 13.4689 11.6006 12.7653 11.3945 12.5593C11.1883 12.3534 10.4067 11.5811 9.35027 11.0748C6.63613 9.76192 4.65205 11.3837 2.29865 9.77908C2.11828 9.65895 1.8692 9.47016 1.57717 9.17841C-0.527152 7.05889 -0.527152 3.62648 1.58576 1.50696C3.91339 -0.827077 7.79565 -0.149175 9.23003 1.50696C9.40181 1.70433 9.4877 1.86737 9.66807 2.18487C11.2055 5.00803 9.89997 6.72423 11.1626 9.28996C11.6779 10.3454 12.3908 11.0662 12.6485 11.3151C12.9061 11.5725 13.6706 12.3276 14.7442 12.8339C17.4498 14.1039 19.3995 12.5508 21.7013 14.1382C21.8817 14.2584 22.1222 14.4472 22.4228 14.7389C24.5272 16.8499 24.5272 20.2908 22.4142 22.4104Z"
                                    fill="url(#paint0_linear_65_2028)"
                                />
                                <path
                                    d="M18.4269 11.1429C21.5039 11.1429 23.9983 8.64844 23.9983 5.57143C23.9983 2.49441 21.5039 0 18.4269 0C15.3499 0 12.8555 2.49441 12.8555 5.57143C12.8555 8.64844 15.3499 11.1429 18.4269 11.1429Z"
                                    fill="#DAFB59"
                                />
                                <path
                                    d="M5.57143 24C8.64844 24 11.1429 21.5056 11.1429 18.4286C11.1429 15.3516 8.64844 12.8572 5.57143 12.8572C2.49441 12.8572 0 15.3516 0 18.4286C0 21.5056 2.49441 24 5.57143 24Z"
                                    fill="#F6F6F1"
                                />
                                <path
                                    d="M40.422 2.5V20.05L38.42 18.1H53.058V22H36.002V2.5H40.422ZM62.9508 22.39C61.2001 22.39 59.6315 22.0693 58.2448 21.428C56.8755 20.7693 55.7921 19.8507 54.9948 18.672C54.2148 17.4933 53.8248 16.124 53.8248 14.564C53.8248 13.0213 54.1975 11.6693 54.9428 10.508C55.7055 9.34667 56.7455 8.44533 58.0628 7.804C59.3801 7.14533 60.8795 6.816 62.5608 6.816C64.2768 6.816 65.7501 7.19733 66.9808 7.96C68.2115 8.70533 69.1561 9.76267 69.8148 11.132C70.4908 12.5013 70.8288 14.1133 70.8288 15.968H57.3088V13.082H68.4888L66.7988 14.122C66.7295 13.2553 66.5128 12.5187 66.1488 11.912C65.8021 11.3053 65.3255 10.8373 64.7188 10.508C64.1121 10.1787 63.4015 10.014 62.5868 10.014C61.7028 10.014 60.9315 10.196 60.2728 10.56C59.6315 10.9067 59.1288 11.4007 58.7648 12.042C58.4181 12.666 58.2448 13.4027 58.2448 14.252C58.2448 15.2747 58.4701 16.15 58.9208 16.878C59.3715 17.606 60.0301 18.1607 60.8968 18.542C61.7635 18.9233 62.8121 19.114 64.0428 19.114C65.1521 19.114 66.2701 18.958 67.3968 18.646C68.5235 18.3167 69.5375 17.8573 70.4388 17.268V20.18C69.4681 20.8733 68.3328 21.4193 67.0328 21.818C65.7501 22.1993 64.3895 22.39 62.9508 22.39ZM86.9145 22L86.2905 16.592L86.9925 14.616L86.2905 12.666L86.9145 7.206H91.4125L90.5545 14.616L91.4125 22H86.9145ZM88.0585 14.616C87.7811 16.176 87.2698 17.5453 86.5245 18.724C85.7965 19.8853 84.8691 20.7867 83.7425 21.428C82.6331 22.0693 81.3851 22.39 79.9985 22.39C78.5598 22.39 77.2858 22.0693 76.1765 21.428C75.0671 20.7693 74.2005 19.8593 73.5765 18.698C72.9698 17.5193 72.6665 16.1587 72.6665 14.616C72.6665 13.056 72.9698 11.6953 73.5765 10.534C74.2005 9.35533 75.0671 8.44533 76.1765 7.804C77.2858 7.14533 78.5598 6.816 79.9985 6.816C81.3851 6.816 82.6331 7.13667 83.7425 7.778C84.8691 8.41933 85.8051 9.32933 86.5505 10.508C87.2958 11.6693 87.7985 13.0387 88.0585 14.616ZM77.0605 14.616C77.0605 15.4827 77.2338 16.2453 77.5805 16.904C77.9445 17.5627 78.4385 18.0827 79.0625 18.464C79.6865 18.828 80.4058 19.01 81.2205 19.01C82.0351 19.01 82.7978 18.828 83.5085 18.464C84.2365 18.0827 84.8778 17.5627 85.4325 16.904C85.9871 16.2453 86.4205 15.4827 86.7325 14.616C86.4205 13.7493 85.9871 12.9867 85.4325 12.328C84.8778 11.652 84.2365 11.132 83.5085 10.768C82.7978 10.3867 82.0351 10.196 81.2205 10.196C80.4058 10.196 79.6865 10.3867 79.0625 10.768C78.4385 11.132 77.9445 11.652 77.5805 12.328C77.2338 12.9867 77.0605 13.7493 77.0605 14.616ZM93.6137 7.206H98.0077L98.8917 12.536V22H94.5497V12.068L93.6137 7.206ZM106.094 7.05V10.794C105.643 10.69 105.192 10.612 104.742 10.56C104.291 10.508 103.866 10.482 103.468 10.482C102.601 10.482 101.821 10.664 101.128 11.028C100.434 11.392 99.8884 11.9553 99.4897 12.718C99.0911 13.4807 98.8917 14.4427 98.8917 15.604L97.9817 14.512C98.0857 13.4547 98.2764 12.4667 98.5537 11.548C98.8311 10.612 99.2124 9.79733 99.6977 9.104C100.2 8.39333 100.816 7.83867 101.544 7.44C102.272 7.024 103.138 6.816 104.144 6.816C104.473 6.816 104.802 6.842 105.132 6.894C105.478 6.92867 105.799 6.98067 106.094 7.05ZM107.401 7.206H111.743L112.679 12.848V22H108.337V12.198L107.401 7.206ZM118.321 6.816C119.725 6.816 120.921 7.102 121.909 7.674C122.897 8.22867 123.651 9.026 124.171 10.066C124.691 11.106 124.951 12.3453 124.951 13.784V22H120.609V14.434C120.609 13.0993 120.288 12.094 119.647 11.418C119.006 10.7247 118.07 10.378 116.839 10.378C116.007 10.378 115.27 10.5687 114.629 10.95C114.005 11.314 113.52 11.8253 113.173 12.484C112.844 13.1427 112.679 13.9313 112.679 14.85L111.249 14.096C111.422 12.536 111.838 11.2187 112.497 10.144C113.156 9.06933 113.988 8.246 114.993 7.674C115.998 7.102 117.108 6.816 118.321 6.816ZM136.355 22.39C134.604 22.39 133.036 22.0693 131.649 21.428C130.28 20.7693 129.196 19.8507 128.399 18.672C127.619 17.4933 127.229 16.124 127.229 14.564C127.229 13.0213 127.602 11.6693 128.347 10.508C129.11 9.34667 130.15 8.44533 131.467 7.804C132.784 7.14533 134.284 6.816 135.965 6.816C137.681 6.816 139.154 7.19733 140.385 7.96C141.616 8.70533 142.56 9.76267 143.219 11.132C143.895 12.5013 144.233 14.1133 144.233 15.968H130.713V13.082H141.893L140.203 14.122C140.134 13.2553 139.917 12.5187 139.553 11.912C139.206 11.3053 138.73 10.8373 138.123 10.508C137.516 10.1787 136.806 10.014 135.991 10.014C135.107 10.014 134.336 10.196 133.677 10.56C133.036 10.9067 132.533 11.4007 132.169 12.042C131.822 12.666 131.649 13.4027 131.649 14.252C131.649 15.2747 131.874 16.15 132.325 16.878C132.776 17.606 133.434 18.1607 134.301 18.542C135.168 18.9233 136.216 19.114 137.447 19.114C138.556 19.114 139.674 18.958 140.801 18.646C141.928 18.3167 142.942 17.8573 143.843 17.268V20.18C142.872 20.8733 141.737 21.4193 140.437 21.818C139.154 22.1993 137.794 22.39 136.355 22.39ZM165.847 19.634H164.417L169.045 7.206H173.387L167.667 22H163.221L158.281 9.234H159.841L154.823 22H150.377L144.657 7.206H149.051L153.705 19.634H152.223L156.955 7.206H161.193L165.847 19.634Z"
                                    fill="#F6F6F1"
                                />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_65_2028"
                                        x1="11.6624"
                                        y1="-5.08184"
                                        x2="13.1863"
                                        y2="71.0581"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop offset="0.0729" stopColor="#DAFB59" />
                                        <stop offset="0.1024" stopColor="#D1F860" />
                                        <stop offset="0.1499" stopColor="#BAEE72" />
                                        <stop offset="0.2097" stopColor="#93DF8F" />
                                        <stop offset="0.2792" stopColor="#5DCAB8" />
                                        <stop offset="0.3561" stopColor="#19B0EC" />
                                        <stop offset="0.3825" stopColor="#00A6FF" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <nav className="app-aside__nav nav">
                            <ul className="nav__list">
                                <li className="nav__item">
                                    <a href="#" className="nav__link">
                                        <svg className="nav__icon" viewBox="0 0 32 32" fill="none">
                                            <path
                                                d="M9.56207 17.208L6.69141 25.756L10.2541 24.5694L12.3447 27.6894L14.7781 20.7787M22.4181 17.208L25.2901 25.756L21.7261 24.5694L19.6354 27.6894L17.2021 20.7787M12.2207 5.73335C12.9941 5.82402 13.7581 5.50669 14.2407 4.89602C14.4505 4.62998 14.7179 4.41496 15.0227 4.26712C15.3276 4.11929 15.6619 4.04248 16.0007 4.04248C16.3395 4.04248 16.6739 4.11929 16.9788 4.26712C17.2836 4.41496 17.551 4.62998 17.7607 4.89602C17.9978 5.19656 18.308 5.43133 18.6616 5.57792C19.0153 5.7245 19.4005 5.77802 19.7807 5.73335C20.117 5.69377 20.4579 5.73089 20.7778 5.84192C21.0976 5.95296 21.3882 6.13503 21.6276 6.37445C21.8671 6.61388 22.0491 6.90444 22.1602 7.22432C22.2712 7.5442 22.3083 7.88507 22.2687 8.22135C22.1781 8.99469 22.4954 9.76002 23.1061 10.2427C23.3719 10.4525 23.5867 10.7198 23.7344 11.0245C23.882 11.3292 23.9588 11.6634 23.9588 12.002C23.9588 12.3406 23.882 12.6748 23.7344 12.9796C23.5867 13.2843 23.3719 13.5516 23.1061 13.7614C22.8057 13.9986 22.5711 14.3088 22.4245 14.6624C22.278 15.016 22.2243 15.4012 22.2687 15.7814C22.3083 16.1176 22.2712 16.4585 22.1602 16.7784C22.0491 17.0983 21.8671 17.3888 21.6276 17.6283C21.3882 17.8677 21.0976 18.0497 20.7778 18.1608C20.4579 18.2718 20.117 18.3089 19.7807 18.2694C19.4003 18.2246 19.0148 18.278 18.661 18.4246C18.3071 18.5712 17.9967 18.806 17.7594 19.1067C17.5496 19.3725 17.2823 19.5873 16.9776 19.735C16.6729 19.8827 16.3387 19.9594 16.0001 19.9594C15.6615 19.9594 15.3272 19.8827 15.0225 19.735C14.7178 19.5873 14.4505 19.3725 14.2407 19.1067C14.0036 18.8062 13.6934 18.5715 13.3398 18.425C12.9862 18.2784 12.6009 18.2248 12.2207 18.2694C11.8844 18.3092 11.5433 18.2722 11.2233 18.1613C10.9032 18.0503 10.6125 17.8683 10.3729 17.6288C10.1333 17.3894 9.95114 17.0987 9.84003 16.7788C9.72892 16.4588 9.69178 16.1178 9.73141 15.7814C9.77609 15.4013 9.72273 15.0161 9.57639 14.6625C9.43005 14.3089 9.19561 13.9987 8.89541 13.7614C8.62937 13.5516 8.41435 13.2842 8.26651 12.9794C8.11867 12.6745 8.04187 12.3401 8.04187 12.0014C8.04187 11.6626 8.11867 11.3282 8.26651 11.0233C8.41435 10.7185 8.62937 10.4511 8.89541 10.2414C9.50607 9.76002 9.82341 8.99469 9.73141 8.22135C9.69178 7.88495 9.72892 7.54394 9.84003 7.22395C9.95114 6.90396 10.1333 6.61332 10.3729 6.37387C10.6125 6.13442 10.9032 5.95238 11.2233 5.84144C11.5433 5.7305 11.8844 5.69355 12.2207 5.73335ZM18.6674 12C18.6674 12.7073 18.3865 13.3855 17.8864 13.8856C17.3863 14.3857 16.708 14.6667 16.0007 14.6667C15.2935 14.6667 14.6152 14.3857 14.1151 13.8856C13.615 13.3855 13.3341 12.7073 13.3341 12C13.3341 11.2928 13.615 10.6145 14.1151 10.1144C14.6152 9.6143 15.2935 9.33335 16.0007 9.33335C16.708 9.33335 17.3863 9.6143 17.8864 10.1144C18.3865 10.6145 18.6674 11.2928 18.6674 12Z"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className="nav__text">Повторение</span>
                                    </a>
                                </li>
                                <li className="nav__item">
                                    <a href="#" className="nav__link">
                                        <svg className="nav__icon" viewBox="0 0 32 32" fill="none">
                                            <path
                                                d="M20.0013 5.33333H24.0013C24.3549 5.33333 24.6941 5.47381 24.9441 5.72386C25.1942 5.97391 25.3346 6.31304 25.3346 6.66667V26.6667C25.3346 27.0203 25.1942 27.3594 24.9441 27.6095C24.6941 27.8595 24.3549 28 24.0013 28H8.0013C7.64768 28 7.30854 27.8595 7.05849 27.6095C6.80844 27.3594 6.66797 27.0203 6.66797 26.6667V6.66667C6.66797 6.31304 6.80844 5.97391 7.05849 5.72386C7.30854 5.47381 7.64768 5.33333 8.0013 5.33333H12.0013M12.0013 9.33333H20.0013M12.0013 16H20.0013M12.0013 21.3333H20.0013M13.3346 4V9.33333H18.668V4H13.3346Z"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className="nav__text">Словарь</span>
                                    </a>
                                </li>
                                <li className="nav__item">
                                    <a href="#" className="nav__link">
                                        <svg className="nav__icon" viewBox="0 0 32 32" fill="none">
                                            <path
                                                d="M17.9987 10.6667H5.33203M5.33203 8.00008V25.3334C5.33203 25.687 5.47251 26.0262 5.72256 26.2762C5.9726 26.5263 6.31174 26.6667 6.66536 26.6667H25.332C25.6857 26.6667 26.0248 26.5263 26.2748 26.2762C26.5249 26.0262 26.6654 25.687 26.6654 25.3334V12.0001C26.6654 11.6465 26.5249 11.3073 26.2748 11.0573C26.0248 10.8072 25.6857 10.6667 25.332 10.6667H18.6227C18.4273 10.6667 18.2342 10.6236 18.0573 10.5407C17.8803 10.4577 17.7238 10.3369 17.5987 10.1867L15.0654 7.14675C14.9403 6.99658 14.7837 6.87575 14.6068 6.7928C14.4298 6.70986 14.2368 6.66682 14.0414 6.66675H6.66536C6.31174 6.66675 5.9726 6.80722 5.72256 7.05727C5.47251 7.30732 5.33203 7.64646 5.33203 8.00008Z"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className="nav__text">Заметки</span>
                                    </a>
                                </li>
                                <li className="nav__item">
                                    <a href="#" className="nav__link">
                                        <svg className="nav__icon" viewBox="0 0 32 32" fill="none">
                                            <path
                                                d="M6.66797 25.3333V5.33333C6.66797 4.97971 6.80844 4.64057 7.05849 4.39052C7.30854 4.14048 7.64768 4 8.0013 4H24.0013C24.3549 4 24.6941 4.14048 24.9441 4.39052C25.1942 4.64057 25.3346 4.97971 25.3346 5.33333V22.6667H9.33464C8.62739 22.6667 7.94911 22.9476 7.44902 23.4477C6.94892 23.9478 6.66797 24.6261 6.66797 25.3333ZM6.66797 25.3333C6.66797 26.0406 6.94892 26.7189 7.44902 27.219C7.94911 27.719 8.62739 28 9.33464 28H25.3346M12.0013 4V22.6667M21.3346 22.6667V28"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className="nav__text">Обучение</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <nav className="app-aside__bot nav">
                        <ul className="nav__list">
                            <li className="nav__item">
                                <a href="#" className="nav__link">
                                    <svg className="nav__icon" viewBox="0 0 32 32" fill="none">
                                        <path
                                            d="M26.6654 15.9999H10.6654M26.6654 15.9999L21.332 21.3333M26.6654 15.9999L21.332 10.6666M11.9987 5.33325H9.33203C8.27117 5.33325 7.25375 5.75468 6.5036 6.50482C5.75346 7.25497 5.33203 8.27239 5.33203 9.33325V22.6666C5.33203 23.7275 5.75346 24.7449 6.5036 25.495C7.25375 26.2452 8.27117 26.6666 9.33203 26.6666H11.9987"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="nav__text">Выйти</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>
                <main className="app-main">
                    <header className="app-main__top">
                        <div className="app-main__left">
                            <h1 className="app-main__title">Словарь</h1>
                        </div>
                        <div className="app-main__right">
                            <div className="app-main__search app-search --th-empty">
                                <input
                                    type="text"
                                    placeholder="Text"
                                    className="app-search__elem"
                                />
                                <button className="app-search__delete line-btn-dark">
                                    <svg className="icon" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M5 19L18.93 5M19 19L5.07 5"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <div className="app-search__icon">
                                    <svg className="icon" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M20 20L16.8889 16.8889M16.4444 10.2222C16.4444 11.0393 16.2835 11.8484 15.9708 12.6034C15.6581 13.3583 15.1998 14.0442 14.622 14.622C14.0442 15.1998 13.3583 15.6581 12.6034 15.9708C11.8484 16.2835 11.0393 16.4444 10.2222 16.4444C9.40511 16.4444 8.596 16.2835 7.84108 15.9708C7.08617 15.6581 6.40023 15.1998 5.82245 14.622C5.24466 14.0442 4.78633 13.3583 4.47364 12.6034C4.16094 11.8484 4 11.0393 4 10.2222C4 8.57199 4.65555 6.98934 5.82245 5.82245C6.98934 4.65555 8.57199 4 10.2222 4C11.8725 4 13.4551 4.65555 14.622 5.82245C15.7889 6.98934 16.4444 8.57199 16.4444 10.2222Z"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="app-main__mid">
                        <section className="app-dictionary">
                            {/* Top */}
                            <div className="app-dictionary__top">
                                <div className="filters-top">
                                    <div className="filters-top__left">
                                        <div className="filters-categories --th-desktop">
                                            <button className="filters-categories__select">
                                                <span>Категории:</span>
                                                <span>все</span>
                                                <svg className="icon" viewBox="0 0 12 12" fill="none">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M9.21243 5.1355C9.74943 4.4835 9.28493 3.5 8.43993 3.5H3.55993C2.71493 3.5 2.25093 4.4835 2.78793 5.1355L5.22843 8.099C5.32225 8.21294 5.44012 8.30471 5.5736 8.36771C5.70707 8.43071 5.85284 8.46338 6.00043 8.46338C6.14803 8.46338 6.29379 8.43071 6.42727 8.36771C6.56074 8.30471 6.67862 8.21294 6.77243 8.099L9.21243 5.1355Z"
                                                        fill="#1F1E30"
                                                    />
                                                </svg>
                                            </button>
                                            <div className="dropdown-categories --th-dictionary">
                                                <ul className="dropdown-categories__list">
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">
                                                            Выбрать все
                                                        </div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <button className="filters-top__add-word --th-mobile btn btn-dark">
                                            <svg className="icon" viewBox="0 0 25 24" fill="none">
                                                <path
                                                    d="M5.5 12H19.5M12.5 19V5"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span>Добавить слова</span>
                                        </button>
                                    </div>
                                    <div className="filters-top__right">
                                        <button className="filters-top__edit-categories btn btn-dark-outline">
                                            <svg className="icon" viewBox="0 0 25 24" fill="none">
                                                <path
                                                    d="M20.5 6H10.5M10.5 6C10.5 5.46957 10.2893 4.96086 9.91421 4.58579C9.53914 4.21071 9.03043 4 8.5 4C7.96957 4 7.46086 4.21071 7.08579 4.58579C6.71071 4.96086 6.5 5.46957 6.5 6M10.5 6C10.5 6.53043 10.2893 7.03914 9.91421 7.41421C9.53914 7.78929 9.03043 8 8.5 8C7.96957 8 7.46086 7.78929 7.08579 7.41421C6.71071 7.03914 6.5 6.53043 6.5 6M6.5 6H4.5M20.5 12H18.5M18.5 12C18.5 11.4696 18.2893 10.9609 17.9142 10.5858C17.5391 10.2107 17.0304 10 16.5 10C15.9696 10 15.4609 10.2107 15.0858 10.5858C14.7107 10.9609 14.5 11.4696 14.5 12M18.5 12C18.5 12.5304 18.2893 13.0391 17.9142 13.4142C17.5391 13.7893 17.0304 14 16.5 14C15.9696 14 15.4609 13.7893 15.0858 13.4142C14.7107 13.0391 14.5 12.5304 14.5 12M14.5 12H4.5M20.5 18H10.5M10.5 18C10.5 17.4696 10.2893 16.9609 9.91421 16.5858C9.53914 16.2107 9.03043 16 8.5 16C7.96957 16 7.46086 16.2107 7.08579 16.5858C6.71071 16.9609 6.5 17.4696 6.5 18M10.5 18C10.5 18.5304 10.2893 19.0391 9.91421 19.4142C9.53914 19.7893 9.03043 20 8.5 20C7.96957 20 7.46086 19.7893 7.08579 19.4142C6.71071 19.0391 6.5 18.5304 6.5 18M6.5 18H4.5"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="text">Редактировать категории</span>
                                        </button>
                                        <button className="filters-top__add-word --th-desktop btn btn-dark">
                                            <svg className="icon" viewBox="0 0 25 24" fill="none">
                                                <path
                                                    d="M5.5 12H19.5M12.5 19V5"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span>Добавить слова</span>
                                        </button>
                                        <div className="filters-categories --th-mobile">
                                            <button className="filters-categories__select">
                                                <span>Категории:</span>
                                                <span>все</span>
                                                <svg className="icon" viewBox="0 0 12 12" fill="none">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M9.21243 5.1355C9.74943 4.4835 9.28493 3.5 8.43993 3.5H3.55993C2.71493 3.5 2.25093 4.4835 2.78793 5.1355L5.22843 8.099C5.32225 8.21294 5.44012 8.30471 5.5736 8.36771C5.70707 8.43071 5.85284 8.46338 6.00043 8.46338C6.14803 8.46338 6.29379 8.43071 6.42727 8.36771C6.56074 8.30471 6.67862 8.21294 6.77243 8.099L9.21243 5.1355Z"
                                                        fill="#1F1E30"
                                                    />
                                                </svg>
                                            </button>
                                            <div className="dropdown-categories --th-dictionary">
                                                <ul className="dropdown-categories__list">
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">
                                                            Выбрать все
                                                        </div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
                                                                />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Mid */}
                            <div className="app-dictionary__mid">
                                <table className="table app-dictionary__table">
                                    <thead className="table__head">
                                        <tr className="table__row">
                                            <td className="table__ceil">
                                                {" "}
                                                <div className="app-checkbox">
                                                    <input type="checkbox" className="app-checkbox__input" />
                                                    <div className="app-checkbox__elem">
                                                        <svg
                                                            className="app-checkbox__icon"
                                                            viewBox="0 0 14 10"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                stroke="#F6F6F1"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>{" "}
                                                Слово
                                            </td>
                                            <td className="table__ceil">Перевод</td>
                                            <td className="table__ceil">Категория</td>
                                            <td className="table__ceil" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wordsArr
                                            .sort((a, b) => a.id - b.id)
                                            .slice(firstContentIndex, lastContentIndex)
                                            .map((word, index) => {
                                                return (
                                                    <tr className="table__ceil"
                                                        info={`${word.id}+${word.foreign_word}+${word.russian_word}+${word.category}+${word.category_word_id}`}
                                                        key={word.id}
                                                    >
                                                        {" "}
                                                        <th className="table__ceil">
                                                            {" "}
                                                            <div className="app-checkbox">
                                                                <input type="checkbox" className="app-checkbox__input" />
                                                                <div className="app-checkbox__elem">
                                                                    <svg
                                                                        className="app-checkbox__icon"
                                                                        viewBox="0 0 14 10"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                            stroke="#F6F6F1"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>{" "}
                                                            {word.foreign_word}
                                                        </th>
                                                        <th className="table__ceil">{word.russian_word}</th>
                                                        <th className="table__ceil">{word.category}</th>
                                                        <th className="table__ceil">
                                                            <div className="more-btn ">
                                                                <button className="more-btn__btn">
                                                                    <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                                        <path
                                                                            d="M12 6H12.01M12 12H12.01M12 18H12.01"
                                                                            stroke="currentColor"
                                                                            strokeWidth={3}
                                                                            strokeLinecap="round"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <ul className="more-btn__menu">
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-dark">
                                                                            <svg
                                                                                className="icon"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                            >
                                                                                <path
                                                                                    d="M8.5 11.5L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Выбрать</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-dark">
                                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                                <path
                                                                                    fill="none"
                                                                                    d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Редактировать</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-red">
                                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                                <path
                                                                                    d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    fill="none"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Удалить</span>
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                )
                                            })}
                                        <tr>
                                            <th className="table__ceil">
                                                {" "}
                                                <div className="app-checkbox">
                                                    <input type="checkbox" className="app-checkbox__input" />
                                                    <div className="app-checkbox__elem">
                                                        <svg
                                                            className="app-checkbox__icon"
                                                            viewBox="0 0 14 10"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                stroke="#F6F6F1"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>{" "}
                                                Backbone interface
                                            </th>
                                            <th className="table__ceil">Главное подключение</th>
                                            <th className="table__ceil">IT</th>
                                            <th className="table__ceil">
                                                <div className="more-btn ">
                                                    <button className="more-btn__btn">
                                                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M12 6H12.01M12 12H12.01M12 18H12.01"
                                                                stroke="currentColor"
                                                                strokeWidth={3}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <ul className="more-btn__menu">
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg
                                                                    className="icon"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M8.5 11.5L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Выбрать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        fill="none"
                                                                        d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Редактировать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-red">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        fill="none"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Удалить</span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </th>
                                        </tr>
                                    </tbody>
                                </table>
                                < ul className="app-dictionary__list dictionary-mob">
                                    {wordsArr
                                        .sort((a, b) => a.id - b.id)
                                        .slice(firstContentIndex, lastContentIndex)
                                        .map((word, index) => {
                                            return (
                                                <li className="dictionary-mob__item"
                                                    info={`${word.id}+${word.foreign_word}+${word.russian_word}+${word.category}+${word.category_word_id}`}
                                                    key={word.id}
                                                >
                                                    <div className="dictionary-mob__item-inner">
                                                        <p className="dictionary-mob__categories">{word.category}</p>
                                                        <h3 className="dictionary-mob__title">
                                                            {word.foreign_word}
                                                        </h3>
                                                        <p className="dictionary-mob__text">
                                                            {word.russian_word}
                                                        </p>
                                                        <div className="dictionary-mob__btn">
                                                            <div className="more-btn ">
                                                                <button className="more-btn__btn">
                                                                    <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                                        <path
                                                                            d="M12 6H12.01M12 12H12.01M12 18H12.01"
                                                                            stroke="currentColor"
                                                                            strokeWidth={3}
                                                                            strokeLinecap="round"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <ul className="more-btn__menu">
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-dark">
                                                                            <svg
                                                                                className="icon"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                            >
                                                                                <path
                                                                                    d="M8.5 11.5L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Выбрать</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-dark">
                                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                                <path
                                                                                    fill="none"
                                                                                    d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Редактировать</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-red">
                                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                                <path
                                                                                    d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    fill="none"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Удалить</span>
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    <li className="dictionary-mob__item">
                                        <div className="dictionary-mob__item-inner">
                                            <p className="dictionary-mob__categories">IT</p>
                                            <h3 className="dictionary-mob__title">
                                                Object linking and embedding
                                            </h3>
                                            <p className="dictionary-mob__text">
                                                Связь и внедрение объекта
                                            </p>
                                            <div className="dictionary-mob__btn">
                                                <div className="more-btn --th-active">
                                                    <button className="more-btn__btn">
                                                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M12 6H12.01M12 12H12.01M12 18H12.01"
                                                                stroke="currentColor"
                                                                strokeWidth={3}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <ul className="more-btn__menu">
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg
                                                                    className="icon"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M8.5 11.5L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Выбрать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        fill="none"
                                                                        d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Редактировать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-red">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        fill="none"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Удалить</span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="dictionary-mob__item">
                                        <div className="dictionary-mob__item-inner">
                                            <p className="dictionary-mob__categories">Длинные слова</p>
                                            <h3 className="dictionary-mob__title">
                                                Supercalifragilisticexpialidocious
                                            </h3>
                                            <p className="dictionary-mob__text">Фантастический</p>
                                            <div className="dictionary-mob__btn">
                                                <div className="more-btn">
                                                    <button className="more-btn__btn">
                                                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M12 6H12.01M12 12H12.01M12 18H12.01"
                                                                stroke="currentColor"
                                                                strokeWidth={3}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <ul className="more-btn__menu">
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg
                                                                    className="icon"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M8.5 11.5L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Выбрать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        fill="none"
                                                                        d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Редактировать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-red">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        fill="none"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Удалить</span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="dictionary-mob__item">
                                        <div className="dictionary-mob__item-inner">
                                            <p className="dictionary-mob__categories">Идиомы</p>
                                            <h3 className="dictionary-mob__title">
                                                They're cherry picking examples to support their argument
                                            </h3>
                                            <p className="dictionary-mob__text">
                                                Когда пришло время отличных разнообразных аргументов в
                                                пользу своего мнения, кто-то отчаянно не может их подобрать,
                                                и буквально выдумывает на ходу, использует повторяющиеся
                                            </p>
                                            <div className="dictionary-mob__btn">
                                                <div className="more-btn">
                                                    <button className="more-btn__btn">
                                                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M12 6H12.01M12 12H12.01M12 18H12.01"
                                                                stroke="currentColor"
                                                                strokeWidth={3}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <ul className="more-btn__menu">
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg
                                                                    className="icon"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M8.5 11.5L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Выбрать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        fill="none"
                                                                        d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Редактировать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-red">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        fill="none"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Удалить</span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="dictionary-mob__item">
                                        <div className="dictionary-mob__item-inner">
                                            <p className="dictionary-mob__categories">IT</p>
                                            <h3 className="dictionary-mob__title">
                                                We'll cross that bridge when we come to it
                                            </h3>
                                            <p className="dictionary-mob__text">
                                                Давай не будем прямо сейчас говорить об этой проблеме
                                            </p>
                                            <div className="dictionary-mob__btn">
                                                <div className="more-btn">
                                                    <button className="more-btn__btn">
                                                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M12 6H12.01M12 12H12.01M12 18H12.01"
                                                                stroke="currentColor"
                                                                strokeWidth={3}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <ul className="more-btn__menu">
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg
                                                                    className="icon"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M8.5 11.5L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Выбрать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        fill="none"
                                                                        d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Редактировать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-red">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        fill="none"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Удалить</span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            {/* Footer */}
                            <div className="app-dictionary__bot">

                                <div className="pagination">
                                    <div className="pagination__settings">
                                        <span className="label">На странице</span>
                                        <span className="current">{countItems} слов</span>
                                        <svg className="icon" viewBox="0 0 12 12" fill="none" onClick={handleItems}>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M9.21292 5.1355C9.74992 4.4835 9.28542 3.5 8.44042 3.5H3.56042C2.71542 3.5 2.25142 4.4835 2.78842 5.1355L5.22892 8.099C5.32273 8.21294 5.44061 8.30471 5.57408 8.36771C5.70756 8.43071 5.85332 8.46338 6.00092 8.46338C6.14852 8.46338 6.29428 8.43071 6.42776 8.36771C6.56123 8.30471 6.6791 8.21294 6.77292 8.099L9.21292 5.1355Z"
                                                fill="#1F1E30"
                                            />
                                        </svg>
                                        {/* Добавить --th-active для pagination__settings-dropdown */}

                                        <ul className="pagination__settings-dropdown">
                                            <li className="pagination__settings-item">
                                                <button className="pagination__settings-btn" value='5' onClick={handleItems2}>5</button>
                                            </li>
                                            <li className="pagination__settings-item">
                                                {/* --th-current */}
                                                <button className="pagination__settings-btn  line-btn-grey" value='15' onClick={handleItems2}>
                                                    15
                                                </button>
                                            </li>
                                            <li className="pagination__settings-item">
                                                <button className="pagination__settings-btn line-btn-grey" value='30' onClick={handleItems2}>
                                                    30
                                                </button>
                                            </li>
                                            <li className="pagination__settings-item">
                                                <button className="pagination__settings-btn line-btn-grey" value='45' onClick={handleItems2}>
                                                    45
                                                </button>
                                            </li>
                                            <li className="pagination__settings-item" value={wordsArr.length} onClick={handleItems2}>
                                                <button className="pagination__settings-btn line-btn-grey">
                                                    {wordsArr.length}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <ul className="pagination__dots">
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn --th-prev">
                                                <svg viewBox="0 0 25 24" fill="none">
                                                    <path
                                                        d="M14.5 16L10.5 12L14.5 8"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn">1</button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn --th-current">
                                                2
                                            </button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn">...</button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn">11</button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn">12</button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn --th-next">
                                                <svg viewBox="0 0 25 24" fill="none">
                                                    <path
                                                        d="M14.5 16L10.5 12L14.5 8"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="pagination__all">Всего {wordsArr.length} слов</div>
                                </div>
                            </div>
                        </section>
                    </main>
                    <footer className="app-main__bot">
                        <p className="app-main__copyright app-main__text">
                            © 2025 Learnew. <br /> Все права защищены.
                        </p>
                        <ul className="app-main__links">
                            <li className="app-main__link-wrapper">
                                <a href="#" className="app-main__link app-main__text">
                                    Поддержка
                                </a>
                            </li>
                            <li className="app-main__link-wrapper">
                                <a href="#" className="app-main__link app-main__text">
                                    Условия использования
                                </a>
                            </li>
                            <li className="app-main__link-wrapper">
                                <a href="#" className="app-main__link app-main__text">
                                    Политика конфиденциальности
                                </a>
                            </li>
                        </ul>
                    </footer>
                </main>
            </div >
            <div className="app-mobile-menu">
                <ul className="app-mobile-menu__actions">
                    <li className="app-mobile-menu__item">
                        <button className="app-mobile-menu__btn">
                            <svg viewBox="0 0 32 32" fill="none">
                                <path
                                    d="M9.56207 17.208L6.69141 25.756L10.2541 24.5694L12.3447 27.6894L14.7781 20.7787M22.4181 17.208L25.2901 25.756L21.7261 24.5694L19.6354 27.6894L17.2021 20.7787M12.2207 5.73335C12.9941 5.82402 13.7581 5.50669 14.2407 4.89602C14.4505 4.62998 14.7179 4.41496 15.0227 4.26712C15.3276 4.11929 15.6619 4.04248 16.0007 4.04248C16.3395 4.04248 16.6739 4.11929 16.9788 4.26712C17.2836 4.41496 17.551 4.62998 17.7607 4.89602C17.9978 5.19656 18.308 5.43133 18.6616 5.57792C19.0153 5.7245 19.4005 5.77802 19.7807 5.73335C20.117 5.69377 20.4579 5.73089 20.7778 5.84192C21.0976 5.95296 21.3882 6.13503 21.6276 6.37445C21.8671 6.61388 22.0491 6.90444 22.1602 7.22432C22.2712 7.5442 22.3083 7.88507 22.2687 8.22135C22.1781 8.99469 22.4954 9.76002 23.1061 10.2427C23.3719 10.4525 23.5867 10.7198 23.7344 11.0245C23.882 11.3292 23.9588 11.6634 23.9588 12.002C23.9588 12.3406 23.882 12.6748 23.7344 12.9796C23.5867 13.2843 23.3719 13.5516 23.1061 13.7614C22.8057 13.9986 22.5711 14.3088 22.4245 14.6624C22.278 15.016 22.2243 15.4012 22.2687 15.7814C22.3083 16.1176 22.2712 16.4585 22.1602 16.7784C22.0491 17.0983 21.8671 17.3888 21.6276 17.6283C21.3882 17.8677 21.0976 18.0497 20.7778 18.1608C20.4579 18.2718 20.117 18.3089 19.7807 18.2694C19.4003 18.2246 19.0148 18.278 18.661 18.4246C18.3071 18.5712 17.9967 18.806 17.7594 19.1067C17.5496 19.3725 17.2823 19.5873 16.9776 19.735C16.6729 19.8827 16.3387 19.9594 16.0001 19.9594C15.6615 19.9594 15.3272 19.8827 15.0225 19.735C14.7178 19.5873 14.4505 19.3725 14.2407 19.1067C14.0036 18.8062 13.6934 18.5715 13.3398 18.425C12.9862 18.2784 12.6009 18.2248 12.2207 18.2694C11.8844 18.3092 11.5433 18.2722 11.2233 18.1613C10.9032 18.0503 10.6125 17.8683 10.3729 17.6288C10.1333 17.3894 9.95114 17.0987 9.84003 16.7788C9.72892 16.4588 9.69178 16.1178 9.73141 15.7814C9.77609 15.4013 9.72273 15.0161 9.57639 14.6625C9.43005 14.3089 9.19561 13.9987 8.89541 13.7614C8.62937 13.5516 8.41435 13.2842 8.26651 12.9794C8.11867 12.6745 8.04187 12.3401 8.04187 12.0014C8.04187 11.6626 8.11867 11.3282 8.26651 11.0233C8.41435 10.7185 8.62937 10.4511 8.89541 10.2414C9.50607 9.76002 9.82341 8.99469 9.73141 8.22135C9.69178 7.88495 9.72892 7.54394 9.84003 7.22395C9.95114 6.90396 10.1333 6.61332 10.3729 6.37387C10.6125 6.13442 10.9032 5.95238 11.2233 5.84144C11.5433 5.7305 11.8844 5.69355 12.2207 5.73335ZM18.6674 12C18.6674 12.7073 18.3865 13.3855 17.8864 13.8856C17.3863 14.3857 16.708 14.6667 16.0007 14.6667C15.2935 14.6667 14.6152 14.3857 14.1151 13.8856C13.615 13.3855 13.3341 12.7073 13.3341 12C13.3341 11.2928 13.615 10.6145 14.1151 10.1144C14.6152 9.6143 15.2935 9.33335 16.0007 9.33335C16.708 9.33335 17.3863 9.6143 17.8864 10.1144C18.3865 10.6145 18.6674 11.2928 18.6674 12Z"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </li>
                    <li className="app-mobile-menu__item">
                        <button className="app-mobile-menu__btn">
                            <svg viewBox="0 0 32 32" fill="none">
                                <path
                                    d="M20.0013 5.33333H24.0013C24.3549 5.33333 24.6941 5.47381 24.9441 5.72386C25.1942 5.97391 25.3346 6.31304 25.3346 6.66667V26.6667C25.3346 27.0203 25.1942 27.3594 24.9441 27.6095C24.6941 27.8595 24.3549 28 24.0013 28H8.0013C7.64768 28 7.30854 27.8595 7.05849 27.6095C6.80844 27.3594 6.66797 27.0203 6.66797 26.6667V6.66667C6.66797 6.31304 6.80844 5.97391 7.05849 5.72386C7.30854 5.47381 7.64768 5.33333 8.0013 5.33333H12.0013M12.0013 9.33333H20.0013M12.0013 16H20.0013M12.0013 21.3333H20.0013M13.3346 4V9.33333H18.668V4H13.3346Z"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </li>
                    <li className="app-mobile-menu__item">
                        <button className="app-mobile-menu__btn ">
                            <svg viewBox="0 0 32 32" fill="none">
                                <path
                                    d="M17.9987 10.6667H5.33203M5.33203 8.00008V25.3334C5.33203 25.687 5.47251 26.0262 5.72256 26.2762C5.9726 26.5263 6.31174 26.6667 6.66536 26.6667H25.332C25.6857 26.6667 26.0248 26.5263 26.2748 26.2762C26.5249 26.0262 26.6654 25.687 26.6654 25.3334V12.0001C26.6654 11.6465 26.5249 11.3073 26.2748 11.0573C26.0248 10.8072 25.6857 10.6667 25.332 10.6667H18.6227C18.4273 10.6667 18.2342 10.6236 18.0573 10.5407C17.8803 10.4577 17.7238 10.3369 17.5987 10.1867L15.0654 7.14675C14.9403 6.99658 14.7837 6.87575 14.6068 6.7928C14.4298 6.70986 14.2368 6.66682 14.0414 6.66675H6.66536C6.31174 6.66675 5.9726 6.80722 5.72256 7.05727C5.47251 7.30732 5.33203 7.64646 5.33203 8.00008Z"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </li>
                    <li className="app-mobile-menu__item">
                        <button className="app-mobile-menu__btn --th-active">
                            <svg viewBox="0 0 32 32" fill="none">
                                <path
                                    d="M6.66797 25.3333V5.33333C6.66797 4.97971 6.80844 4.64057 7.05849 4.39052C7.30854 4.14048 7.64768 4 8.0013 4H24.0013C24.3549 4 24.6941 4.14048 24.9441 4.39052C25.1942 4.64057 25.3346 4.97971 25.3346 5.33333V22.6667H9.33464C8.62739 22.6667 7.94911 22.9476 7.44902 23.4477C6.94892 23.9478 6.66797 24.6261 6.66797 25.3333ZM6.66797 25.3333C6.66797 26.0406 6.94892 26.7189 7.44902 27.219C7.94911 27.719 8.62739 28 9.33464 28H25.3346M12.0013 4V22.6667M21.3346 22.6667V28"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </li>
                    <li className="app-mobile-menu__item">
                        <button className="app-mobile-menu__btn">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M5 7H19M5 12H19M5 17H19"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>
            < div className="app-selected" >
                <div className="app-selected__inner">
                    <p className="app-selected__left">Выбрано 3 из 79</p>
                    <ul className="app-selected__actions">
                        <li className="app-selected__item">
                            <button className="app-selected__btn">
                                <svg className="icon" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Редактировать</span>
                            </button>
                        </li>
                        <li className="app-selected__item">
                            <button className="app-selected__btn">
                                <svg className="icon" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M20 6H10M10 6C10 5.46957 9.78929 4.96086 9.41421 4.58579C9.03914 4.21071 8.53043 4 8 4C7.46957 4 6.96086 4.21071 6.58579 4.58579C6.21071 4.96086 6 5.46957 6 6M10 6C10 6.53043 9.78929 7.03914 9.41421 7.41421C9.03914 7.78929 8.53043 8 8 8C7.46957 8 6.96086 7.78929 6.58579 7.41421C6.21071 7.03914 6 6.53043 6 6M6 6H4M20 12H18M18 12C18 11.4696 17.7893 10.9609 17.4142 10.5858C17.0391 10.2107 16.5304 10 16 10C15.4696 10 14.9609 10.2107 14.5858 10.5858C14.2107 10.9609 14 11.4696 14 12M18 12C18 12.5304 17.7893 13.0391 17.4142 13.4142C17.0391 13.7893 16.5304 14 16 14C15.4696 14 14.9609 13.7893 14.5858 13.4142C14.2107 13.0391 14 12.5304 14 12M14 12H4M20 18H10M10 18C10 17.4696 9.78929 16.9609 9.41421 16.5858C9.03914 16.2107 8.53043 16 8 16C7.46957 16 6.96086 16.2107 6.58579 16.5858C6.21071 16.9609 6 17.4696 6 18M10 18C10 18.5304 9.78929 19.0391 9.41421 19.4142C9.03914 19.7893 8.53043 20 8 20C7.46957 20 6.96086 19.7893 6.58579 19.4142C6.21071 19.0391 6 18.5304 6 18M6 18H4"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span>Выбрать категорию</span>
                            </button>
                        </li>
                        <li className="app-selected__item">
                            <button className="app-selected__btn">
                                <svg className="icon" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Удалить</span>
                            </button>
                        </li>
                        <li className="app-selected__item">
                            <button className="app-selected__btn">
                                <svg
                                    className="icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M7 17L14.96 9M15 17L7.04 9"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Отменить</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div >
        </>

    )
}