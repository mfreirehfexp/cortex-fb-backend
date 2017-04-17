import {baseEventClass, FbEventMode} from './baseEventClass';

/**
 * Base Class for onCreateUser Events
 */
export abstract class onDeleteUser extends baseEventClass{
  type: FbEventMode = "onDeleteUser";
  path: string;
  abstract getFunction();
  // abstract getFunction(event_req, response? ): any;

  constructor(config?) {
    super(config);
  }

}