"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TableConf = (function () {
    function TableConf(pathIn, svlc) {
        if (svlc === void 0) { svlc = false; }
        this.orderBy = null;
        this.modelParser = null;
        this.path = pathIn;
        this.saveLocal = svlc;
    }
    return TableConf;
}());
exports.TableConf = TableConf;
exports.CortexDbConfigs = {
    MATERIALES: {
        ORDENES_DE_COMPRA: {
            LISTADO: new TableConf('test/materiales/orden-compra', false)
        }
    }
};
