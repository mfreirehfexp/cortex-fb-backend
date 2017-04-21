// import { HelloWorldFunction } from './functions/hello-world-function';
// import * as index from './index';
//
// console.log(index);
//
// let test = new HelloWorldFunction({path: "text"});
// let test2 = new HelloWorldFunction();
//
// console.log(test);
// console.log(test2);
//
// console.log(Object.assign({},test));
//
//
// let funcTest = test.getFunction();
// console.log(funcTest({
//   params:{uid:'test-uid'},
//   data:{
//     ref:{
//       child: (str)=>{
//         return { str: str, set:( v ) => { console.log(v) } }
//       }
//     }
//   }
// }));
//
class Test{
  constructor(){
    let culo = {
      detalle: [
        {hola:"hola",mundo:"mundo"},
        {hola:"hola",mundo:"mundo"},
        {hola:"hola",mundo:"mundo"}
      ]
    }

    this._ensureFbKeyDetails(culo,"detalle");

    console.log(culo);
  }

  _ensureFbKeyDetails(value,detail_field:string){
    for(let key in value[detail_field] ){
      value[detail_field][key]['fbKey'] = 'key';
    }
  }
}

let aux = new Test();

