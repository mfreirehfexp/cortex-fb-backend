import { onDatabaseWrite } from '../fb-events/onDatabaseWrite';

// Firebase Path Event
const PATH = '/test/helloWorldClass/{uid}';

export class HelloWorldFunction extends onDatabaseWrite{
  // Needed to get full access on Firebase Cloud
  builder = HelloWorldFunction;

  constructor(config?:{path:string}){
    // OPTIONAL PATH OVERWRITE
    super(Object.assign({},{path:PATH},(config || {} )));
  }

  myMethod(a,b){
    return a+b;
  }

  getFunction(): (e, r?) => any {
    let self = this;

    return (event) => {
      let msg = "Hello World from a Class!";
      console.log(msg);
      console.log("myMethod",this.myMethod(2,3));
      return event.data.ref.child('uppercase').set(msg.toUpperCase());
    }
  }
}