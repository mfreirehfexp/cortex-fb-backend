import {baseEventClass, FbEventMode} from './baseEventClass';

/**
 * Base Class for Http Calls
 */
export abstract class onPublish extends baseEventClass{
  type: FbEventMode = "onPublish";
  path: string;
  abstract getFunction();
  // abstract getFunction(event_req, response? ): any;

  constructor(config) {
    super(config);
    if (!config.topic) {
      throw 'config.topic string missing.';
    }
    this.path = config.topic;
  }

}