import React, {Component} from 'react';
import './calculator.css';
import Converter from "./converter";

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
        console.log(new Converter().convert("11111+2/3333/44*55*66-777"));

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

    isOperation(letter) {
        return letter === "+" || letter === "-" || letter === "/" || letter === "*";
    }
}