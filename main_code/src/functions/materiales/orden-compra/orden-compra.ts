import {
  onDatabaseWrite,
  DB_TABLE_PROPS as DB,
  MATERIALES_BASE_PATH as BASE_PATH
} from '../dependencies';

// Firebase Path Event
const PATH = BASE_PATH + '/orden-compra/' + DB.inbox + '/{uid}';
const TABLE_PATH = BASE_PATH + '/orden-compra';
const STATES = {
  CREATED: 100,
  CLOSED: 200,
  DELETED: -100,
}

export class OrdenCompra extends onDatabaseWrite{
  // Needed to get full access on Firebase Cloud
  builder = OrdenCompra;

  constructor(config?:{path:string}){
    // OPTIONAL PATH OVERWRITE
    super(Object.assign({},{path:PATH},(config || {} )));
  }

  myUniqueElement(value){
    if( value.numerador == "" )
      return null;
    return value.empresa + value.numerador;
  }

  errorDuplicate(event, value){

  }

  getFunction(): (e, r?) => any {
    return (event) => {
      if (!event.data.exists()) return; // Exit if deleted

      let tableRef = event.data.adminRef.root.child(TABLE_PATH);
      let msg = event.data.val();

      console.log("type:",msg.type,msg);

      if( msg.type == 'create' )
        return this.createProcess(event, tableRef, msg);
      else if( msg.type == 'update' )
        return this.updateProcess(event, tableRef, msg);
      else if( msg.type == 'delete' )
        return this.deleteProcess(event, tableRef, msg);
      return ;
    }
  }

  createProcess(event, tableRef, msg){
    let value = msg.body;
    let childs, keys;
    let unique_id = this.myUniqueElement(value);

    this._ensureFbKey(event,value,DB.childs);
    this._splitDetalle(value,DB.childs,(data)=>{
      childs = data.detail;
      value = data.header;
      keys = data.keys;
      value.estado = STATES.CREATED;
    })

    return this._checkDuplicate(tableRef,unique_id).then((duplicate)=>{
      if( duplicate ){
        // CASE ERROR
        return this.setInbox('rejected',tableRef,event.data.key, msg);
      }
      else {
        // CASE ALLOWED
        return tableRef.child(DB.list).child(value.fbKey).set(value)
            .then(()=>{
              return this.setDetalles('save',tableRef,childs);
            })
            .then(()=>{
                return this._getNextNumerator(tableRef)
            })
            .then((newNumerator)=>{
              value.numerador = newNumerator;
              let unique_id_to_save = this.myUniqueElement(value);
              return Promise.all([
                this.setInbox('processed',tableRef,event.data.key, msg),
                this.setTimeStamItem('save',tableRef,value,event.timestamp),
                tableRef.child(DB.list).child(value.fbKey).child("numerador").set(value.numerador),
                tableRef.child(DB.unique_keys).child(unique_id_to_save).set(true)
              ]);
            })
            .catch(()=>{
              // TODO Limpiar Detalles
              return this.setInbox('rejected',tableRef,event.data.key, msg);
            })
      }
    });
  }

  updateProcess(event, tableRef, msg){
    let value = msg.body;

    return new Promise((resolve,reject)=>{
      tableRef.child(DB.list).child(value.fbKey).once("value", (currentValue)=>{
        if(this._isClose(currentValue.val())){
          // CASE ERROR
          return Promise.all([
            this.setInbox('rejected',tableRef,event.data.key, msg),
            tableRef.child(DB.list).child(value.fbKey).child(DB.item_last_attempt_timestamp).set(event.timestamp)
          ]);
        }
        else {
          // CASE ALLOWED
          let childs, keys;

          this._ensureFbKey(event,value,DB.childs);
          this._splitDetalle(value,DB.childs,(data)=>{
            childs = data.detail;
            value = data.header;
            keys = data.keys;
            value.estado = STATES.CREATED;
          });

          // TODO Check campos no modificables, se actualiza todo
          return new Promise((resolve,reject)=>{
            let unique_id_to_save = this.myUniqueElement(value);
            return Promise.all([
              tableRef.child(DB.list).child(value.fbKey).set(value),
              this.setInbox('processed',tableRef,event.data.key, msg),
              this.setDetalles('update',tableRef,childs),
              this.setTimeStamItem("update",tableRef,value,event.timestamp),
            ]);
          });
        }
      }, reject);
    });
  }

  deleteProcess(event, tableRef, msg){
    let value = msg.body;
    let childs,keys;

    this._ensureFbKey(event,value,DB.childs);
    this._splitDetalle(value,DB.childs,(data)=>{
      childs = data.detail;
      value = data.header;
      keys = data.keys;
      value.estado = STATES.DELETED;
    });

    return new Promise((resolve,reject)=>{
      tableRef.child(DB.list).child(value.fbKey).once("value", (currentValue)=>{
        if(this._isClose(currentValue.val())){
          // CASE ERROR
          return Promise.all([
            this.setInbox('rejected',tableRef,event.data.key, msg),
            tableRef.child(DB.list).child(value.fbKey).child(DB.item_last_attempt_timestamp).set(event.timestamp)
          ]);
        }
        else {
          // CASE ALLOWED
          return new Promise((resolve,reject)=>{
            let unique_id_to_save = this.myUniqueElement(value);
            value[DB.item_update_timestamp] = event.timestamp;
            value[DB.item_last_attempt_timestamp] = event.timestamp;

            return Promise.all([
              // Delete
              tableRef.child(DB.deleted).child(value.fbKey).set(value),
              tableRef.child(DB.deleted_unique_keys).child(unique_id_to_save).push(value.fbKey),
              // Clean
              tableRef.child(DB.list).child(value.fbKey).set(null),
              tableRef.child(DB.unique_keys).child(unique_id_to_save).set(null),

              this.setInbox('processed',tableRef,event.data.key, msg),
              this.setDetalles("remove", tableRef,childs),
              this.setTimeStamItem("remove", tableRef,value,event.timestamp),
            ]);
          });
        }
      }, reject);
    });
  }

  setDetalles(type: 'save'|'update'|'remove', tableRef, detail:[{fbKey:string, parentFbKey:string}]){
    let arrP = [];
    detail.forEach((item,index)=>{
      if( type == 'save'){
        arrP.push(tableRef.child(DB.list_childs).child(item.fbKey).set(item));
        arrP.push(tableRef.child(DB.list_childs_keys).child(item.parentFbKey).child(item.fbKey).set(true));
      }
      else if( type == 'update'){
        arrP.push(tableRef.child(DB.list_childs).child(item.fbKey).update(item));
        arrP.push(tableRef.child(DB.list_childs_keys).child(item.parentFbKey).child(item.fbKey).set(true));
      }
      else if( type == 'remove'){
        arrP.push(tableRef.child(DB.list_childs).child(item.fbKey).set(null));
        arrP.push(tableRef.child(DB.list_childs_keys).child(item.parentFbKey).child(item.fbKey).set(null));
        arrP.push(tableRef.child(DB.deleted_childs).child(item.fbKey).set(item));
        arrP.push(tableRef.child(DB.deleted_childs_keys).child(item.parentFbKey).child(item.fbKey).set(true));
      }
    });
    return Promise.all(arrP);
  }

  setTimeStamItem(type: 'save'|'update'|'remove', tableRef, value:{fbKey:string}, timestamp){
    let arrP = [];

    if( type == 'save'){
      arrP.push(tableRef.child(DB.list).child(value.fbKey).child(DB.item_create_timestamp).set(timestamp));
      arrP.push(tableRef.child(DB.list).child(value.fbKey).child(DB.item_update_timestamp).set(timestamp));
      arrP.push(tableRef.child(DB.list).child(value.fbKey).child(DB.item_last_attempt_timestamp).set(timestamp));
    }
    else if( type == 'update'){
      arrP.push(tableRef.child(DB.list).child(value.fbKey).child(DB.item_update_timestamp).set(timestamp));
      arrP.push(tableRef.child(DB.list).child(value.fbKey).child(DB.item_last_attempt_timestamp).set(timestamp));
    }
    else if( type == 'remove'){
      arrP.push(tableRef.child(DB.deleted).child(value.fbKey).child(DB.item_update_timestamp).set(timestamp));
      arrP.push(tableRef.child(DB.deleted).child(value.fbKey).child(DB.item_last_attempt_timestamp).set(timestamp));
    }

    return Promise.all(arrP);
  }

  setInbox(type: 'processed'|'rejected', tableRef, key, msg){
    let arrP = [];

    if( type == 'processed'){
      arrP.push( tableRef.child(DB.inbox).child(key).set(null) );
      arrP.push( tableRef.child(DB.inbox_processed).child(key).set(msg) );
    }
    else if( type == 'rejected'){
      arrP.push( tableRef.child(DB.inbox).child(key).set(null) );
      arrP.push( tableRef.child(DB.inbox_rejected).child(key).set(msg) );
    }

    return Promise.all(arrP);
  }


  _isClose(currentValue){
    // console.log("closed state:?",currentValue.estado, STATES.CLOSED, currentValue);
    return (currentValue.estado >= STATES.CLOSED);
  }

  _splitDetalle(value,detail_field:string,callback:(obj:{header:any ,detail:any ,keys:any })=>void){
    let empty_detail = {};
    empty_detail[detail_field] = null;
    let header = Object.assign({},value, empty_detail);
    let detail = []; // Mode 1 {}   // Mode 2 []
    let keys = {}; // Only Mode 2

    for( let key in value[detail_field] ){
      // Mode 1
      // let detLine = value[detail_field][key];
      // detail[detLine.fbKey] = Object.assign(detLine);

      // Module 2
      let detLine = value[detail_field][key];
      detLine.parentFbKey = value.fbKey;
      keys[detLine.fbKey] = true;
      detail.push( Object.assign(detLine) );
    }

    callback({
      header: header,
      detail: detail,
      keys: keys
    });
  }


  _ensureFbKey(event, value, detail_field:string){
    if(!value.fbKey)
      value.fbKey = event.data.adminRef.push().key;
    for(let key in value[detail_field] ){
      if(value[detail_field][key].fbKey === undefined )
        value[detail_field][key]['fbKey'] = event.data.adminRef.push().key;
    }
  }

  _checkDuplicate(tableRef, unique_id){
    return new Promise((resolve,reject)=>{
      if( unique_id === null )
        resolve( false );

      tableRef.child(DB.unique_keys).child(unique_id).once("value", (duplicateSnap)=>{
        resolve( duplicateSnap.val() !== null );
      }, reject);
    })
  }

  _getNextNumerator(tableRef){
    return new Promise((resolve,reject)=>{
      tableRef.child(DB.numerator).transaction((numerator)=> {
        return (numerator + 1);
      },(error, committed, snapshot)=>{
        if( committed )
          resolve(snapshot.val());
        else
          reject(error);
      })
    });
  }

}