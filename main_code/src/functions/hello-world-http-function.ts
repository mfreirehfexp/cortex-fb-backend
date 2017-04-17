import { onHttp } from '../fb-events/onHttp';


export class HelloWorldHttpFunction extends onHttp{
  // Needed to get full access on Firebase Cloud
  builder = HelloWorldHttpFunction;

  constructor(config?:any){
    super(config);
  }

  myMethod(a,b){
    return a+b;
  }

  getFunction(): (e, r?) => any {
    let self = this;

    return (request, response) => {
      let msg = "Hello World from a Class!";
      console.log(msg);
      console.log("myMethod",this.myMethod(2,3));
      response.status(200).send(msg.toUpperCase() + this.myMethod(2,3));
    }
  }
}