export class TableConf{
  path: string;
  saveLocal: boolean;
  orderBy: string = null;
  modelParser: (v:any)=>any = null;
  constructor( pathIn , svlc: boolean = false ){
    this.path = pathIn;
    this.saveLocal = svlc;
  }
}

export const CortexDbConfigs = {
  MATERIALES: {
    ORDENES_DE_COMPRA: {
      LISTADO: new TableConf('test/materiales/orden-compra', false)
    }
  }
};
