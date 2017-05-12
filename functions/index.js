const functions = require('firebase-functions');
const admin = require('firebase-admin');
const config = functions.config();

admin.initializeApp(config.firebase);

const index = require('./dist/index');
const app_functions = new index.FirebaseCloudFunctions();

if( !app_functions ) return;

app_functions.database = admin.database();

app_functions.functions.forEach((funcName,index)=>{
  app_functions[funcName].setDatabaseConnection(admin.database());

  let funct = app_functions[funcName];

  console.log(funct.path);

  switch( funct.type ){
    case "onWrite":
      exports[funcName] = functions.database.ref(funct.path).onWrite(funct.callbackFunction);
      break;
    case "http":
      exports[funcName] = functions.https.onRequest(funct.callbackFunction);
      break;
    case "onCreateUser":
      exports[funcName] = functions.auth.user().onCreate(funct.callbackFunction);
      break;
    case "onDeleteUser":
      exports[funcName] = functions.auth.user().onDelete(funct.callbackFunction);
    case "onPublish":
      exports[funcName] = functions.pubsub.topic(funct.path).onPublish(funct.callbackFunction);
      break;
    default: break;
  }
})
