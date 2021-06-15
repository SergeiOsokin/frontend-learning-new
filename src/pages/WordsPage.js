import React from 'react';
import { Header } from '../components/Header';
import { WordsList } from '../components/Wordslist';

export default class WordsPage extends React.Component {
    render() {
        return (
            <>
                <Header />
                <section className="words-section">
                    <WordsList />
                </section>
            </>
        )
    }
}