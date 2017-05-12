import {
  onPublish,
  // DB_TABLE_PROPS as DB,
  // MATERIALES_BASE_PATH as BASE_PATH
} from '../dependencies';

// Firebase Path Event
const TOPIC = 'worker-sql-v02'; // 'projects/hfexp-cortex-fb/topics/worker-sql-v01';
// const TABLE_PATH = BASE_PATH + '/orden-compra';



export class OrdenCompraSaved extends onPublish{
  // Needed to get full access on Firebase Cloud
  builder = OrdenCompraSaved;

  constructor(config?:{topic:string}){
    // OPTIONAL PATH OVERWRITE
    super(Object.assign({},{topic:TOPIC},(config || {} )));
  }

  getFunction(): (e, r?) => any {
    return (event) => {
      // if (!event.data.exists()) return; // Exit if deleted

      // let tableRef = event.data.adminRef.root.child(TABLE_PATH);
      let msg = event.data.toJSON();

      console.log("MSG:",msg);

      return ;
    }
  }


}