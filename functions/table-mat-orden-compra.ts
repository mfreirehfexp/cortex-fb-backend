/**
 * Created by martin.freire on 7/4/2017.
 */

import rq = require('request-promise');
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CortexDbConfigs } from './cortex-db-configs';

// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
exports.setFbKey = functions.database.ref('/stats/cola/{pushId}/eventSuma').onWrite(event => {
  // /stats/totalcajas

  return admin.database().ref('/T1617/pallets-deposito/42').once('value', (snapshot) => {
    let cajas = 0;

    snapshot.forEach((childSnapshot) => {
      var childKey = childSnapshot.key;
      var pallet = childSnapshot.val();
      if( !!pallet && pallet.detalle ){
        pallet.detalle.forEach((det) => {
          if( !!det && det.cantCajas ){
            cajas += det.cantCajas;
          }
        })
      }
      return true;
    });

    let msg = '<br>\n' + 'Total cajas: ' + cajas;
    console.log( msg );

    admin.database().ref('/stats/totalCajas').set(cajas);

    return cajas;
  });
});

