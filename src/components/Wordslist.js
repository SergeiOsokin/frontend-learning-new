import React from 'react';
import { wordsArr } from '../data.json';

export const WordsList = () => {

    function tableSearch() {
        let phrase = document.querySelector('.input-search');
        let table = document.querySelector('.tabel-words');
        let regPhrase = new RegExp(phrase.value, 'i');
        let flag = false;
        for (let i = 1; i < table.rows.length; i++) {
            flag = false;
            for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
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
        tableSearch();
    }

    return (
        <>
            <input placeholder="Поиск слова" className="input-search" id="search" type="text" onChange={handleChange} />
            <table className="striped tabel-words" >
                <thead>
                    <tr>
                        <th>№ п/п</th>
                        <th>Слово на английском</th>
                        <th>Слово на русском</th>
                        <th>Звучание</th>
                    </tr>
                </thead>

                <tbody>
                    {wordsArr.map((word, index) => {
                        return (
                            <tr key={word + index}>
                                <td>{word.id}</td>
                                <td>{word.engWord}</td>
                                <td>{word.rusWord}</td>
                                <td>La-La-La</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}