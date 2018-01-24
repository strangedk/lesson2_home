import React, {Component} from 'react';
import './calculator.css';

export default class Calculator extends Component {
    constructor(props) {
        super(props);

        const operations = ["+", "-", "*", "/"];
        const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "CE", "0", "="];

        this.state = {
            operations: operations,
            numbers: numbers,
            value: "",
        };
    }

    static isOperation(letter) {
        return letter === "+" || letter === "-" || letter === "/" || letter === "*";
    }

    render() {
        const {value} = this.state;

        return (
            <div className="calculator">
                <textarea value={value} disabled/>

                <div>
                    {
                        this.state.operations.map((item, index) => {
                            return <div className="button-operations" key={index}
                                        onClick={() => this.onClickHandler(item)}>{item}</div>
                        })
                    }
                </div>
                <div>
                    {
                        this.state.numbers.map((item, index) => {
                            return <div className="button" key={index}
                                        onClick={() => this.onClickHandler(item)}>{item}</div>
                        })
                    }
                </div>
            </div>
        );
    }

    onClickHandler(item) {
        let value = this.state.value;
        const letter = item;

        if (letter === "CE") {
            this.clear.call(this);
            return;
        } else if (letter === "=") {
            this.calc.call(this);
            return;
        } else if (this.isOperation(letter) && this.isOperation(value.charAt(value.length - 1))) {
            value = value.slice(0, -1);
        }

        this.setState({
            value: value + "" + letter
        });
    }

    clear() {
        this.setState({
            value: "",
        })
    }

    calc() {
        let result = "";

        try {
            result = (new Function("return (" + this.state.value + ")"))();
        } catch (e) {
            alert("Ошибка в вычислении");
        }

        this.setState({
            value: result
        })
    }
}