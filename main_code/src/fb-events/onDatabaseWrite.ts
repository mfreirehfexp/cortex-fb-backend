import {baseEventClass, FbEventMode} from './baseEventClass';

/**
 * Base Class for onWrite Events
 * The constructor with {path: ''} is madatory
 * The Child could use this line to make it optional, this will use a default path set by const PATH
 * and allow to use the config option in an optional way
 * // OPTIONAL PATH OVERWRITE
 * constructor(config?:{path:string}){
 *    super(Object.assign({},{path:PATH},(config || {} )));
 * }
 */
export abstract class onDatabaseWrite extends baseEventClass{
  type: FbEventMode = "onWrite";
  path: string;
  abstract getFunction();
  // abstract getFunction(event_req, response? ): any;

  constructor(config) {
    super(config);
    if (!config.path) {
      throw 'config.path string missing. Looks like "/users"';
    }
    this.path = config.path;
  }

}