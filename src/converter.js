export default class Converter {
    constructor(props) {
        this.state = {
            behavior: {
                BehaviorDirectly: 0,
                BehaviorAwait: 1,
                BehaviorContinue: 2,
                BehaviorBraces: 3,
                BehaviorFinish: 4,
                BehaviorError: 5
            }
        };

        this.convert = this.convert.bind(this);
        this.getOperationsBehavior = this.getOperationsBehavior.bind(this);
    }

    static isOperation(letter) {
        let result = '/*+-()'.indexOf(letter) !== -1;
        return result;
    }

    convert(input) {
        let resultStack = [];
        let frontStack = [];
        let awaitStack = [];
        let sourceValues = [];

        const {
            BehaviorDirectly, BehaviorAwait, BehaviorContinue,
            BehaviorBraces, BehaviorFinish, BehaviorError
        } = this.state.behavior;

        let accum = "";
        let index = 0;
        while (index <= input.length) {
            let char = input.charAt(index);
            if (Converter.isOperation(char)) {
                if (accum !== '')
                    sourceValues.push(accum);
                accum = char;
            } else {
                if (Converter.isOperation(accum) && accum !== '') {
                    sourceValues.push(accum);
                    accum = char;
                } else {
                    accum = accum + '' + char;
                }
            }
            ++index;
        }

        if (!sourceValues || sourceValues.length === 0)
            return "[Converter input data error]";

        // Mark the tail with a special symbol
        sourceValues[sourceValues.length] = "|";

        sourceValues.forEach((el, index, arr) => {
            let behavior = BehaviorError;

            if (el === "|") {
                behavior = BehaviorContinue;
            } else if (!Converter.isOperation(el)) {
                behavior = BehaviorDirectly;
            } else {
                if (awaitStack.length === 0)
                    behavior = BehaviorAwait;
                else
                    behavior = this.getOperationsBehavior(awaitStack[awaitStack.length - 1], el);
            }

            switch (behavior) {
                case BehaviorDirectly:
                    frontStack.push(el);
                    break;
                case BehaviorAwait:
                    awaitStack.push(el);
                    break;
                case BehaviorContinue:
                    frontStack.push(awaitStack.pop());

                    // fallthrough into remove braces, it's ok.
                    let needToRemoveBraces = this.getOperationsBehavior(awaitStack[awaitStack.length - 1], el);
                    if (BehaviorBraces !== needToRemoveBraces)
                        break;

                case BehaviorBraces:
                    awaitStack.pop();
                    break;
                case BehaviorFinish:
                    break;
                case BehaviorError:
                    resultStack.push("[Algorythm Error]");
                    break;
            }
        });

        return frontStack.join();
    }

    /** Таблица сответствий поведения при переводе в обратную польскую нотацию

     behavior: {
                BehaviorAwait: 1,
                BehaviorContinue: 2,
                BehaviorBraces: 3,
                BehaviorFinish: 4,
                BehaviorError: 5
            }
     */
    getOperationsBehavior(a, b) {
        const pattern = {
            "||": 4, "+|": 1, "-|": 1, "*|": 1, "/|": 1, "(|": 1, ")|": 5,
            "|+": 2, "++": 2, "-+": 2, "*+": 1, "/+": 1, "(+": 1, ")+": 2,
            "|-": 2, "+-": 2, "--": 2, "*-": 1, "/-": 1, "(-": 1, ")-": 2,
            "|*": 2, "+*": 2, "-*": 2, "**": 2, "/*": 2, "(*": 1, ")*": 2,
            "|/": 2, "+/": 2, "-/": 2, "*/": 2, "//": 2, "(/": 1, ")/": 2,
            "|(": 5, "+(": 1, "-(": 1, "*(": 1, "/(": 1, "((": 1, "()": 3,
        };

        const pattern_inv = {
            "||": 4, "|+": 1, "|-": 1, "|*": 1, "|/": 1, "|(": 1, "|)": 5,
            "+|": 2, "++": 2, "+-": 2, "+*": 1, "+/": 1, "+(": 1, "+)": 2,
            "-|": 2, "-+": 2, "--": 2, "-*": 1, "-/": 1, "-(": 1, "-)": 2,
            "*|": 2, "*+": 2, "*-": 2, "**": 2, "*/": 2, "*(": 1, "*)": 2,
            "/|": 2, "/+": 2, "/-": 2, "/*": 2, "//": 2, "/(": 1, "/)": 2,
            "(|": 5, "(+": 1, "(-": 1, "(*": 1, "(/": 1, "((": 1, "))": 3,
        };

        const result = pattern[a + "" + b];

        console.log(a + " : " + b + " = " + result);

        return result;
    }
}