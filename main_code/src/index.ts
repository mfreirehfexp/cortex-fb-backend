import { baseEventClass } from './fb-events/baseEventClass';
import { FbFunctionBuilder } from './fb-events/FbFunctionBuilder';
import { MaterialesOrdenDeCompra } from './functions';
import { HelloWorldHttpFunction } from './functions/hello-world-http-function';

/**
 * FirebaseCloudFunctions
 * Main Class for the entire library
 * The main concepts are:
 *    * Each function to publish must be:
 *      - A property member of this class
 *      - The function Class must extend baseEventClass
 *      - The property name must be added to the functions array (as string)
 *      - Only the functions in the property functions are published
 *      - if no class is needed, use new FbFunctionBuilder()
 *      - For the functions created with FbFunctionBuilder(), the contex is the Main class
 *      - this.database is available on every function. If it is a custom Class is added if it
 *        is builded with the FbFunctionBuilder(), the property database is a member of the class
 */
export class FirebaseCloudFunctions {
  database = null;
  functions = ['MatOrdenCompraTable','httpGus'];

  // Function "helloWorldSimple"
  // helloWorldSimple:baseEventClass =  new FbFunctionBuilder( 'onWrite', '/test/helloWorld/{uid}', ( event )=>{
  //     console.log("Hello World!"); return;
  //   });

  httpGus:baseEventClass =  new FbFunctionBuilder( 'http', null, ( request, response )=>{
      response.status(200).send("Hello " + JSON.stringify(request.body)); return;
    });

  // Function
  MatOrdenCompraTable:baseEventClass = new MaterialesOrdenDeCompra();

}
