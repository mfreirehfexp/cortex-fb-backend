import {baseEventClass, FbEventMode} from './baseEventClass';

/**
 * Base Class for onCreateUser Events
 */
export abstract class onCreateUser extends baseEventClass{
  type: FbEventMode = "onCreateUser";
  path: string;
  abstract getFunction();
  // abstract getFunction(event_req, response? ): any;

  constructor(config?) {
    super(config);
  }

}