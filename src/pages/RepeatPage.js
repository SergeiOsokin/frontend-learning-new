import React from 'react';
import { FlashCardForm } from '../components/FlashCard';
import { Header } from '../components/Header';
import { WriteWord } from '../components/WriteWord';
import { wordsArr } from '../words.json';

export default class FlashCards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEasy: true,
            easyHard: 'сложнее'
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log(this.state.isEasy)
        this.setState((prevState, props) => {
            return {
                isEasy: !this.state.isEasy,
                easyHard: this.state.easyHard === 'проще' ? 'сложнее' : 'проще'
            }
        })
    }

    render() {
        return (
            <>
                <Header />
                <input className="make-differend-way" type="button" value={`Сделать ${this.state.easyHard}`} onClick={this.handleClick} />
                {this.state.isEasy && <FlashCardForm wordsArr={wordsArr} />}
                {!this.state.isEasy && <WriteWord wordsArr={wordsArr} />}
            </>
        )
    }
}