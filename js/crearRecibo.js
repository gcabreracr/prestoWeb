/***  */


const LF = '<br>'

const FNT = new Intl.NumberFormat('en');


function creaTkt57mm(datos) {

    const ANCHO = 25;

    let titTkt = sessionStorage.getItem('NOM_CIA');
    let _titTkt = titTkt.length + Math.trunc((ANCHO - titTkt.length) / 2);  

    let mNumRec = datos.num_recibo;
    let linNumRec = 'Recibo Dinero # ' + mNumRec;
    let _linNumRec = linNumRec.length + Math.trunc((ANCHO - linNumRec.length) / 2);

    
  
    let mFechaRec = datos.fec_recibo;
    let nomCliente = datos.nomCliente;
    let detAbono = datos.det_abono;
    let mSalIni = datos.salIni;
    let mMonAbo = datos.monAbo;
    let mSalFin = datos.salFin;
    //let mSalFin = mSalIni - mMonAbo;

    let mUsuario = sessionStorage.getItem('COD_USUARIO');
    let linFirma = 'Emitido por ' + mUsuario;
    let _linFirma = linFirma.length + Math.trunc((ANCHO - linFirma.length) / 2);   

    let tkt = '<pre>';
    tkt += titTkt.padStart(_titTkt) + LF;
    tkt += linNumRec.padStart(_linNumRec) + LF + LF;
    tkt += 'Fecha'.padEnd(8) + mFechaRec + LF;
    tkt += 'Hemos recibido de: '+ nomCliente + LF;
    //tkt += nomCliente + LF + LF;
    tkt += 'La suma de :' +   mMonAbo.padStart(10) + ' colones' + LF;

    tkt += 'Por concepto de :' + detAbono + LF + LF;
    
   //tkt += 'Saldo Anterior'.padEnd(15,'.') +  FNT.format(mSalIni).padStart(10) + LF;
   tkt += 'Saldo Anterior'.padEnd(15,'.') +  mSalIni.padStart(10) + LF;

   //tkt += 'Este Abono'.padEnd(15,'.') +  FNT.format(mMonAbo).padStart(10) + LF;
   tkt += 'Este Abono'.padEnd(15,'.') +  mMonAbo.padStart(10) + LF;

   //tkt += 'Nuevo Saldo'.padEnd(15,'.') +  FNT.format(mSalFin).padStart(10) + LF + LF + LF;
   tkt += 'Nuevo Saldo'.padEnd(15,'.') +  mSalFin.padStart(10) + LF + LF + LF;

    tkt += linFirma + LF + LF + '</pre>';

    return tkt;

}


function creaTkt80mm(datos) {

    const ANCHO = 28;

    let titTkt = sessionStorage.getItem('NOM_CIA');
    let _titTkt = titTkt.length + Math.trunc((ANCHO - titTkt.length) / 2);  

    let mNumRec = datos.num_recibo;
    let linNumRec = 'Recibo Dinero # ' + mNumRec;
    let _linNumRec = linNumRec.length + Math.trunc((ANCHO - linNumRec.length) / 2);

    let mFechaRec = datos.fec_recibo;
    let nomCliente = datos.nomCliente;
    let detAbono = datos.det_abono;
    let mSalIni = datos.salIni;
    let mMonAbo = datos.monAbo;
    let mSalFin = datos.salFin;
    //let mSalFin = mSalIni - mMonAbo;

    let mUsuario = sessionStorage.getItem('COD_USUARIO');
    let linFirma = 'Emitido por ' + mUsuario;
    let _linFirma = linFirma.length + Math.trunc((ANCHO - linFirma.length) / 2);    

    let tkt = '<pre>';
    tkt += titTkt.padStart(_titTkt) + LF;
    tkt += linNumRec.padStart(_linNumRec) + LF + LF;
    tkt += 'Fecha'.padEnd(8) + mFechaRec + LF;
    tkt += 'Hemos recibido de: '+ nomCliente + LF;
    //tkt += nomCliente + LF + LF;
    tkt += 'La suma de :' +   mMonAbo.padStart(10) + ' colones' + LF;

    tkt += 'Por concepto de :' + detAbono + LF + LF;

    //tkt += 'Saldo Anterior'.padEnd(15,'.') +  FNT.format(mSalIni).padStart(10) + LF;
    tkt += 'Saldo Anterior'.padEnd(15,'.') +  mSalIni.padStart(10) + LF;

    //tkt += 'Este Abono'.padEnd(15,'.') +  FNT.format(mMonAbo).padStart(10) + LF;
    tkt += 'Este Abono'.padEnd(15,'.') +  mMonAbo.padStart(10) + LF;

    //tkt += 'Nuevo Saldo'.padEnd(15,'.') +  FNT.format(mSalFin).padStart(10) + LF + LF + LF;
    tkt += 'Nuevo Saldo'.padEnd(15,'.') +  mSalFin.padStart(10) + LF + LF + LF;

    tkt += linFirma + LF + LF + '</pre>';


    return tkt;

}

function imprimeTkt() {

    var divToPrint = document.getElementById("divTT");

    newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();

}

function copiaTkt() {
    let range = document.createRange();
    range.selectNode(document.getElementById('divTT'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    //alert('Tiquete copiado');

}

