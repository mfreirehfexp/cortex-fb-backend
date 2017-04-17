import { baseEventClass, FbEventMode } from './baseEventClass';

const path_needers = ["onWrite"];


class noClassFunction {
  type: any;
  path: any;
  callbackFunction: any;
  database: any;

  constructor(config?, specs?) {
    this.database = ( config && config.database )? config.database : null;
    if( specs ){
      this.type = ( specs.type )? specs.type : null;
      this.path = ( specs.path )? specs.path : null;
      this.callbackFunction = ( specs.callbackFunction )? specs.callbackFunction : null;
    }
  }
};


/**
 * This let you create a function with only constructor arguments (no Class needed)
 * Note: don't forget to call .getFunctionDeclarator() to get the function object
 * Example:
 * new FbFunctionBuilder( 'onWrite', '/test/{uid}', ( event )=>{
 *    console.log("Hello World!"); return;
 *  }).getFunctionDeclarator(),
 */
export class FbFunctionBuilder extends baseEventClass {
  database: any;

  constructor(public type: FbEventMode, public path: string, public callback: ( event_req, response? ) => any ){
    super();
    if ( !type )
      throw 'type string missing. Looks like "onWrite"';
    if ( path_needers.indexOf(type) >= 0 && !path )
      throw 'path string missing. Looks like "/users"';
    if ( !callback )
          throw 'callback function missing.';

    this.builder = noClassFunction;
  }

  getFunction(): (event_req, response?) => any {
    return this.callback;
  }

}