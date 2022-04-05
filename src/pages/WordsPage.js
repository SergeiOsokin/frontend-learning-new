import React from 'react';
import { Header } from '../components/Header';
import { WordsList } from '../components/WordsList';

export default class WordsPage extends React.Component {
    render() {
        return (
            <>
                <Header />
                <WordsList />
            </>
        )
    }
}