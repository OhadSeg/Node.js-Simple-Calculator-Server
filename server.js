//jshint esversion:6
import {Stack} from "./stack.js";
import express from "express"

const app = express();
app.use(express.json());

const operations = ["Plus", "Minus", "Times", "Divide", "Pow", "Abs", "Fact", "plus", "minus", "times", "divide", "pow", "abs", "fact"];
let stack = new Stack();

app.post("/independent/calculate", function (req,res){

    const oneArgumentOperation = req.body.operation === "Abs" || req.body.operation === "Fact" || req.body.operation === "abs" || req.body.operation === "fact";
    
    if(!operations.includes(req.body.operation)) {
        res.status(409).send({ "error-message": `Error: unknown operation: ${req.operation}`});
        return;
    }
    else if(req.body.arguments.length < 2 && !oneArgumentOperation) {
        res.status(409).send({ "error-message": `Error: Not enough arguments to perform the operation ${req.body.operation}`})
        return;
    }

    else if(req.body.arguments.length < 1 && oneArgumentOperation) {
        res.status(409).send({"error-message": `Error: Not enough arguments to perform the operation ${req.body.operation}`});
        return;
    }

    else if(req.body.arguments.length > 2 && !oneArgumentOperation) {
        res.status(409).send({"error-message": `Error: Too many arguments to perform the operation ${req.body.operation}`});
        return;
    }
    else if(req.body.arguments.length > 1 && oneArgumentOperation) {
        res.status(409).send({"error-message": `Error: Too many arguments to perform the operation ${req.body.operation}`});
        return;
    }
    

    let calculation, y;
    let operator = req.body.operation;
    const x = req.body.arguments[0];
    if(!oneArgumentOperation){
        y = req.body.arguments[1];
    }

    operator = operator.toUpperCase();    // In order to checking case insensetive
    // needs to check regarding x < y 3 - 4 = -1

    switch (operator){
        case 'PLUS':
            calculation = x + y;
            break
        case 'MINUS':
            calculation = x - y;
            console.log(calculation);
            break
        case 'TIMES':
            calculation = x * y;
            break
        case 'DIVIDE':
            if(y === 0) {
                res.status(409).send({"error-message": `Error while performing operation Divide: division by 0`});
                return;
            }
            calculation = Math.floor(x / y);
            break
        case 'POW':
            calculation = Math.pow(x,y);
            break
        case 'ABS':
            calculation = Math.abs(x);
            break
        case 'FACT':
                if(x < 0) {
                    res.status(409).send({"error-message": `Error while performing operation Factorial: not supported for the negative number`});
                    return;
                }
                calculation = factorial(x);
                break
        }
        
        res.status(200).send({ "result": calculation });

    });

app.get("/stack/size", function (req,res){
    res.status(200).send({"result":stack.length()})
});

app.put("/stack/arguments", (req, res) => {
    req.body.arguments.forEach((element) => {
        stack.push(element);
    });
    res.status(200).send({ "result": stack.length() });
});

app.get("/stack/operate", function (req,res){
    
    const oneArgumentOperation = req.query.operation === "Abs" || req.query.operation === "Fact" || req.query.operation === "abs" || req.query.operation === "fact";
    
    if(!operations.includes(req.query.operation)) {
        res.status(409).send({ "error-message": `Error: unknown operation: ${req.query.operation}`});
        return;
    }
    else if(stack.length() < 2 && !oneArgumentOperation) {
        res.status(409).send({"error-message": `Error: cannot implement operation ${req.query.operation}. It requires 2 arguments and the stack has only ${stack.length()} arguments`});
        return;
    }

    else if(stack.length() < 1 && oneArgumentOperation) {
        res.status(409).send({"error-message": `Error: cannot implement operation ${req.query.operation}. It requires 1 argument and the stack has only ${stack.length()} arguments`});
        return;
    }


    let calculation, y;
    let operator = req.query.operation;
    const x = stack.pop();
    if(!oneArgumentOperation){
        y = stack.pop();;
    }

    operator = operator.toUpperCase(); 

      switch (operator){
        case 'PLUS':
            calculation = x + y;
            break
        case 'MINUS':
            calculation = x - y;
            console.log(calculation);
            break
        case 'TIMES':
            calculation = x * y;
            break
        case 'DIVIDE':
            if(y === 0) {
                res.status(409).send({"error-message": `Error while performing operation Divide: division by 0`});
                return;
            }
            calculation = Math.floor(x / y);
            break
        case 'POW':
            calculation = Math.pow(x,y);
            break
        case 'ABS':
            calculation = Math.abs(x);
            break
        case 'FACT':
                if(x < 0) {
                    res.status(409).send({"error-message": `Error while performing operation Factorial: not supported for the negative number`});
                    return;
                }
                calculation = factorial(x);
                break
        }
        
        res.status(200).send({ "result": calculation  });

    });

app.delete("/stack/arguments", function (req,res) {

    if(req.query.count > stack.length()){
        res.status(409).send({ "error-message": `Error: cannot remove ${req.query.count} from the stack. It has only ${stack.length()} arguments`});
    }
    else {
        for(let i = 0; i < req.query.count;i++){
            stack.pop();
        }
        res.status(200).send({ result: stack.length() });
    }

});

app.listen(8496, function() {
    console.log("Server started on port 8496");
  });

  function factorial(num) {
    if (num < 0)
        return -1;
    else if (num == 0)
        return 1;
    else {
        return (num * factorial(num - 1));
    }
}  
  