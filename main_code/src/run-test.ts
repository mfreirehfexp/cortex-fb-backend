import { HelloWorldFunction } from './functions/hello-world-function';
import * as index from './index';

console.log(index);

let test = new HelloWorldFunction({path: "text"});
let test2 = new HelloWorldFunction();

console.log(test);
console.log(test2);

console.log(Object.assign({},test));


let funcTest = test.getFunction();
console.log(funcTest({
  params:{uid:'test-uid'},
  data:{
    ref:{
      child: (str)=>{
        return { str: str, set:( v ) => { console.log(v) } }
      }
    }
  }
}));
