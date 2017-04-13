/**
 * Created by martin.freire on 7/4/2017.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
exports.setFbKey = functions.database.ref('/stats/cola/{pushId}/eventSuma').onWrite(function (event) {
    // /stats/totalcajas
    return admin.database().ref('/T1617/pallets-deposito/42').once('value', function (snapshot) {
        var cajas = 0;
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var pallet = childSnapshot.val();
            if (!!pallet && pallet.detalle) {
                pallet.detalle.forEach(function (det) {
                    if (!!det && det.cantCajas) {
                        cajas += det.cantCajas;
                    }
                });
            }
            return true;
        });
        var msg = '<br>\n' + 'Total cajas: ' + cajas;
        console.log(msg);
        admin.database().ref('/stats/totalCajas').set(cajas);
        return cajas;
    });
});
