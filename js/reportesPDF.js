/** Archivo de clases para generar reportes PDF */



/*
* Reporte de movimientos por fondo
*/

class Movimientos_Fondo {


    _numPag = 0;
    _lineasPag = 1;


    constructor(datos) {
        this.doc = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'letter'
        });

        this.doc.setFont('courier', 'normal');

        this.datos = datos;

        this.generaReporte();


    }


    addTitulo() {

        //this.doc.setFont('times', 'bold')

        let _nomCia = sessionStorage.getItem("NOM_CIA");
        this.doc.setFontSize(14)
        this.doc.text(_nomCia, 20, 20)
        this.doc.setFontSize(12)
        this.doc.text('Reporte de Movimientos del Fondo', 20, 30);

        this.doc.setFontSize(10)
        this.doc.text('Nombre del fondo: ' + this.datos.nomFondo, 20, 40);


        //this.doc.text(20, 50, 'Periodo')
        this.doc.text('Saldo Inicial', 100, 50)
        this.doc.text(this.datos.salIni.padStart(12), 200, 50)
        //this.doc.text(20, 60, 'Del: ')
        this.doc.text('Total Movimientos', 100, 60)
        this.doc.text(this.datos.monMov.padStart(12), 200, 60)

        let _periodo = 'del ' + this.datos.fecIni + ' al ' + this.datos.fecFin;

        this.doc.text(_periodo, 260, 60)

        this.doc.text('Saldo Final', 100, 70)
        this.doc.text(this.datos.salFin.padStart(12), 200, 70)

        this.doc.setFontSize(8);
        this.doc.text(20, 80, ''.padEnd(115, '-'))
        this.doc.text(25, 90, '   Fecha')
        this.doc.text(70, 90, '   Doc. Referencia')

        this.doc.text(150, 90, 'Monto'.padStart(12));
        this.doc.text(200, 90, 'Detalle')
        this.doc.text(20, 100, ''.padEnd(115, '-'))



    }

    addFooter() {

        this.doc.text(20, 570, ''.padEnd(115, '-'))
        this.doc.text(375, 580, ' Pagina: ' + this._numPag)
    }


    generaReporte() {

        let listaMov = this.datos.listaMov;

        this.addTitulo();

        this._lineasPag = 0;
        this._impTit = 0;
        this._numPag = 1;
        this._impFooter = 1;

        for (let i = 0; i < listaMov.length; i++) {

            if (this._impTit == 1) {
                this.doc.addPage();
                this.addTitulo();
                this._numPag += 1;
                this._impTit = 0;
                this._impFooter = 1;
            }

            this._lineasPag += 1;

            this.doc.text(listaMov[i].fecMov, 25, 100 + (this._lineasPag * 10))
            this.doc.text(listaMov[i].docRef, 70, 100 + (this._lineasPag * 10))
            let _monto = nf_entero.format(listaMov[i].monMov);
            this.doc.text(_monto.padStart(12), 150, 100 + (this._lineasPag * 10))
            this.doc.text(listaMov[i].detMov, 200, 100 + (this._lineasPag * 10))

            if (this._lineasPag >= 45) {

                this.addFooter();
                this._lineasPag = 0;
                this._impTit = 1;
                this._impFooter = 0;
            }

        }

        if (this._impFooter == 1) {

            this.addFooter();

        }



        this.doc.output('dataurlnewwindow')

    }

}

/**
 * Reporte de movimiento de caja
 */

class Movimientos_Caja {


    _numPag = 0;
    _lineasPag = 1;


    constructor(datos) {
        this.doc = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'letter'
        });

        this.doc.setFont('courier', 'normal');

        this.datos = datos;

        this.generaReporte();


    }


    addTitulo() {

        //this.doc.setFont('times', 'bold')
        let _nomCia = sessionStorage.getItem("NOM_CIA");
        this.doc.setFontSize(14)
        this.doc.text(_nomCia, 20, 20)
        this.doc.setFontSize(12)
        this.doc.text('Reporte de Movimientos de Caja', 20, 30);
        this.doc.setFontSize(10)

        this.doc.text('Usuario: ' + this.datos.nomCaja, 20, 40);
        this.doc.text('Fondo..: ' + this.datos.nomFondo, 20, 50);



        this.doc.text('Saldo Inicial', 100, 60)
        this.doc.text(this.datos.salIni.padStart(12), 200, 60)
        this.doc.text('Total Movimientos', 100, 70)
        this.doc.text(this.datos.monMov.padStart(12), 200, 70)
        //console.log(this.datos.monMov)

        let _periodo = 'del ' + this.datos.fecIni + ' al ' + this.datos.fecFin;

        this.doc.text(_periodo, 270, 70)

        this.doc.text('Saldo Final', 100, 80)
        this.doc.text(this.datos.salFin.padStart(12), 200, 80)

        this.doc.setFontSize(8);
        this.doc.text(20, 90, ''.padEnd(115, '-'))
        this.doc.text(25, 100, '   Fecha')
        this.doc.text(70, 100, '   Doc. Referencia')

        this.doc.text(150, 100, 'Monto'.padStart(12));
        this.doc.text(200, 100, 'Detalle')
        this.doc.text(20, 110, ''.padEnd(115, '-'))


    }

    addFooter() {
        this.doc.text(20, 570, ''.padEnd(115, '-'))
        this.doc.text(375, 580, ' Pagina: ' + this._numPag)


    }


    generaReporte() {

        let listaMov = this.datos.listaMov;

        this.addTitulo();

        this._lineasPag = 0;
        this._impTit = 0;
        this._numPag = 1;
        this._impFooter = 1;

        for (let i = 0; i < listaMov.length; i++) {

            if (this._impTit == 1) {

                this.doc.addPage();
                this.addTitulo();
                this._numPag += 1;
                this._impTit = 0;
                this._impFooter = 1;
            }

            this._lineasPag += 1;
            this.doc.text(listaMov[i].fecMov, 25, 110 + (this._lineasPag * 10))
            this.doc.text(listaMov[i].docRef, 70, 110 + (this._lineasPag * 10))
            let _monto = nf_entero.format(listaMov[i].monMov);
            // console.log(_monto)
            this.doc.text(_monto.padStart(12), 150, 110 + (this._lineasPag * 10))
            this.doc.text(listaMov[i].detMov, 200, 110 + (this._lineasPag * 10))           

            if (this._lineasPag >= 45) {

                this.addFooter();
                this._lineasPag = 0;
                this._impTit = 1;
                this._impFooter = 0;

            }

        }

        if (this._impFooter == 1) {

            this.addFooter();
        }

        this.doc.output('dataurlnewwindow')
    }

}



