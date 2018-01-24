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
        let result = letter != '' && '/*+-()'.indexOf(letter) !== -1;
        return result;
    }

    convert(input) {
        let resultStack = [];
        let frontStack = [];
        let awaitStack = [];

        const {
            BehaviorDirectly, BehaviorAwait, BehaviorContinue,
            BehaviorBraces, BehaviorFinish, BehaviorError
        } = this.state.behavior;

        let accum = "";
        let sourceValues = [];

        let index = 0;
        while (index++ < input.length) {
            if (Converter.isOperation(input[index])) {
                sourceValues.push({value: accum});
                accum = input[index];
            } else {
                if (Converter.isOperation(accum)) {
                    sourceValues.push({value: accum});
                    accum = input[index];
                } else {
                    accum = accum + '' + input[index];
                }
            }
        }

        if (!sourceValues || sourceValues.length === 0)
            return "[Converter input data error]";

        // Mark the both head and tail
        sourceValues[0].side = sourceValues[sourceValues.length - 1].side = "side";

        sourceValues.forEach((el, index, arr) => {
            let behavior = BehaviorError;
            let item = el;

            // Head and any numbers is always getting to the front stack
            if (index === 0 || !Converter.isOperation(item)) {
                behavior = BehaviorDirectly;
            } else {
                behavior = this.getOperationsBehavior(item, awaitStack[awaitStack.length - 1]);
            }

            switch (behavior) {
                case BehaviorDirectly:
                    frontStack.push(item);
                    break;
                case BehaviorAwait:
                    awaitStack.push(item);
                    break;
                case BehaviorContinue:
                    frontStack.push(awaitStack.pop());
                    break;
                case BehaviorBraces:
                    awaitStack.pop();
                    break;
                case BehaviorFinish:
                    resultStack.concat(frontStack);
                    break;
                case BehaviorError:
                    resultStack.push("[Algorythm Error]");
                    break;
            }
        });

        return resultStack.toString();
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

        const result = pattern[a + "" + b];

        console.log(a + " : " + b + " = " + result);

        return result;
    }
}