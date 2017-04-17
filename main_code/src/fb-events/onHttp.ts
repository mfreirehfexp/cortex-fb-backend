import {baseEventClass, FbEventMode} from './baseEventClass';

/**
 * Base Class for Http Calls
 */
export abstract class onHttp extends baseEventClass{
  type: FbEventMode = "http";
  path: string;
  abstract getFunction();
  // abstract getFunction(event_req, response? ): any;

  constructor(config) {
    super(config);
    this.path = null;
  }

}