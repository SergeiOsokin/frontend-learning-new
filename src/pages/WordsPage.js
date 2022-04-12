import React, { useContext } from 'react';
import { Header } from '../components/Header';
import { WordsList } from '../components/WordsList';
import { Cont } from '../context/OpenCont';

export const WordsPage = () => {

    const { open, setOpen } = useContext(Cont);
    return (
        <>
            <Cont.Provider value={{ open, setOpen }}>
                <WordsList />
            </Cont.Provider>
        </>
    )
}

// export default class WordsPage extends React.Component {

//     render() {
//         return (
//             <>
//                 <WordsList />
//             </>
//         )
//     }
// }