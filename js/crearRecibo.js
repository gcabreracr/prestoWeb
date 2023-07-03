/***  */


const LF = '<br>'

const FNT = new Intl.NumberFormat('en');


function creaTkt57mm(datos) {

    const ANCHO = 25;


    let titTkt = sessionStorage.getItem('TIT_TKT');
    let _titTkt = titTkt.length + Math.trunc((ANCHO - titTkt.length) / 2);

    let numerosTkt = datos.numerosTkt;
    //console.log(numerosTkt);

    let mTotRev = datos.tot_rev;
    let mTotTkt = datos.tot_tkt;
    let mNomSorteo = datos.nom_sorteo;

    let mNumTkt = datos.num_tkt;
    let linNumTkt = 'Tiquete Compra # ' + mNumTkt;
    let _linNumTkt = linNumTkt.length + Math.trunc((ANCHO - linNumTkt.length) / 2);

    let mFechaTkt = datos.fecha_tkt;

    let mFacPremio = datos.fac_premio;

    let linFacPremio = 'Pagamos al ' + mFacPremio;
    let _linFac = linFacPremio.length + Math.trunc((ANCHO - linFacPremio.length) / 2);

    let mReferencia = datos.referencia;

   

    let tkt = '<pre>';
    tkt += titTkt.padStart(_titTkt) + LF;
    tkt += linNumTkt.padStart(_linNumTkt) + LF + LF;
    tkt += 'Fecha'.padEnd(8) + mFechaTkt + LF;
    tkt += 'Sorteo'.padEnd(8) + mNomSorteo + LF;

    if (mReferencia.length > 0) {
        tkt += 'Cliente'.padEnd(8) + mReferencia + LF;
    }

    if (mTotRev == 0) {

        // Ordena el array de numeros por monto

        let aNumeros = numerosTkt.sort(function (a, b) {
            if (a.apuesta > b.apuesta) {
                return 1;
            }
            if (a.apuesta < b.apuesta) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        //console.log(aNumeros);

        tkt += LF + 'Detalle' + LF;
        tkt += '---------------------------' + LF;

        let montoGrupo = 0;
        let numLinea = 1;
        mTotTkt = 0;

        for (let n = 0; n < aNumeros.length; n++) {

            let _numJugado = aNumeros[n].numero;
            let _monJugado = aNumeros[n].apuesta;
            mTotTkt += _monJugado;

            if (_monJugado != montoGrupo) {
                if (montoGrupo > 0) {
                    tkt += LF;
                }
                montoGrupo = _monJugado;
                numLinea = 1;
                tkt += FNT.format(montoGrupo).padStart(7) + ' x ';

            } else {
                if (numLinea == 1) {
                    tkt += ''.padStart(10);
                }
            }
            tkt += _numJugado;
            numLinea += 1;

            if (numLinea < 6) {
                tkt += ',';
            }
            if (numLinea == 6) {

                numLinea = 1;
                tkt += LF;
            }
        }

    } else {

        // Proceso para tiquetes con venta reventado

        let aNumeros = numerosTkt.sort(function (a, b) {
            if (a.numero > b.numero) {
                return 1;
            }
            if (a.numero < b.numero) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });


        mTotTkt = 0;

        tkt += LF;
        tkt += '#  '.padStart(5) + 'Apuesta'.padStart(10) + 'Rev'.padStart(10) + LF;
        tkt += '---------------------------' + LF;

        for (let i = 0; i < aNumeros.length; i++) {

            let _numero = aNumeros[i].numero;
            let _monJugado = aNumeros[i].apuesta;
            let _monRev = aNumeros[i].reventado;
            mTotTkt += _monJugado + _monRev;

            tkt += _numero.padStart(4);
            tkt += FNT.format(_monJugado).padStart(10);
            tkt += FNT.format(_monRev).padStart(10) + LF;
        }

    }

    tkt += LF + '---------------------------' + LF;
    tkt += 'Monto Tiquete : ' + FNT.format(mTotTkt).padStart(8) + LF + LF;

    tkt += linFacPremio.padStart(_linFac) + LF + LF;

    tkt += msgTkt + LF + LF + '</pre>';

    return tkt;

}


function creaTkt80mm(datos) {

    const ANCHO = 28;

    let titTkt = sessionStorage.getItem('TIT_TKT');
    let _titTkt = titTkt.length + Math.trunc((ANCHO - titTkt.length) / 2);



    let mNumRecibo = datos.num_recibo;
    let linNumRecibo = 'Recibo Dinero # ' + mNumRecibo;
    let _linNumRecibo = linNumRecibo.length + Math.trunc((ANCHO - linNumRecibo.length) / 2);

    let mFechaRecibo = datos.fec_recibo;

   
    let mFacPremio = datos.fac_premio;
    let linFacPremio = 'Pagamos al ' + mFacPremio;
    let _linFac = linFacPremio.length + Math.trunc((ANCHO - linFacPremio.length) / 2);

    let mReferencia = datos.referencia;


  
   

    let tkt = '<pre>';
    if (titTkt.length > 0) {
        tkt += '<strong>' + titTkt.padStart(_titTkt) + '</strong>' + LF;
    }

    tkt += linNumRecibo.padStart(_linNumRecibo) + LF + LF;
    tkt += 'Fecha'.padEnd(8) + mFechaRecibo + LF;
    tkt += 'Sorteo'.padEnd(8) + mNomSorteo + LF;

   

     




    tkt += '<strong>Monto Tiquete : ' + FNT.format(mTotTkt).padStart(8) + '</strong>' + LF + LF;

    tkt += '<strong>' + linFacPremio.padStart(_linFac) + '</strong>' + LF + LF;

    tkt += msgTkt + LF + LF + '</pre>';

    return tkt;


}
