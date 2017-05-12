
export type FbEventMode = "onWrite" | "http" | "onCreateUser" | "onDeleteUser" | "onPublish";

export abstract class baseEventClass{
  type: FbEventMode;
  path: string;
  database: any; // admin.database(),
  builder: any;

  abstract getFunction(): ( event_req, response? ) => any
  // abstract callbackFunction( event_req, response? ): any


  constructor(config?) {
    this.database = ( config && config.database )? config.database : null;
  }

  get callbackFunction(){
    return this.getFunction();
  }

  getFunctionDeclarator(){
    console.log("called");
    return {
      builder: this.builder,
      type: this.type,
      path: this.path,
      database: this.database,
      callbackFunction: this.getFunction()
    }
  }

  testLog(data){
    console.log("TEST LOG works!",data);
  }

  setDatabaseConnection(db){
    this.database = db;
  }
}