$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

   var listaMovCaja = [];


   const $cbFondos = $('#cbFondos');
   const $cbUsuarios = $('#cbUsuarios');

   const $txtFechaIni = $('#txtFechaIni').val(obtieneFechaActual());
   const $txtFechaFin = $('#txtFechaFin').val(obtieneFechaActual());

   const $txtSaldoIni = $('#txtSaldoIni').val('0');
   const $txtTotMov = $('#txtTotMov').val('0');
   const $txtSaldoFin = $('#txtSaldoFin').val('0');

   const $btnConsultar = $('#btnConsultar');
   const $btnImprimir = $('#btnImprimir');

   var $tblMovCaja;



   ini_componentes();
   //llenaComboFondos();
   llenaComboUsuarios();


   function ini_componentes() {


      $tblMovCaja = $('#tblMovCaja').DataTable({

         destroy: true,
         data: listaMovCaja,
         columns: [
            {
               data: 'fecMov',
               className: 'dt-center'

            },
            {
               data: 'docRef'

            },
            {
               data: 'monMov',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false
            },
            {
               data: 'detMov'

            }

         ],

         ordering: false,
         language: lenguaje_data_table

      }); /// Fin de creacion de datatable

      $tblMovCaja.clear().draw();


      $cbFondos.change(function () {

         $tblMovCaja.clear().draw();
         listaMovCaja = [];

      });

      $cbUsuarios.change(function () {

         $tblMovCaja.clear().draw();
         listaMovCaja = [];


      });

      $btnConsultar.click(function (e) {

         e.preventDefault();

         let _codFondo = $(":selected", $('#cbFondos')).val();
         let _codUsuario = $(":selected", $('#cbUsuarios')).val();

         if (_codUsuario == 0) {

            $cbUsuarios.focus();
            sweetAlert({ title: "Debe seleccionar un usuario", type: "error" });
            return;
         }

         if (_codFondo == 0) {

            $cbFondos.focus();
            sweetAlert({ title: "Debe seleccionar un fondo", type: "error" });
            return;

         }

         consultaMovimientos();

      });

      $btnImprimir.click(function (e) {

         e.preventDefault();

         imprimeReporte();

      });



   }


   function llenaComboFondos() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'lista_fondos';

      $cbFondos.empty();

      $cbFondos.append($("<option>", {
         value: 0,
         text: 'Seleccione un Fondo'
      }));

      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();

            if (data.resp != null) {

               let _listaFondos = data.resp.listaFondos;


               for (item in _listaFondos) {

                  let _codFondo = _listaFondos[item]['cod_fondo'];
                  let _nomFondo = _listaFondos[item]['nom_fondo'];

                  $cbFondos.append($("<option>", {
                     value: _codFondo,
                     text: _nomFondo
                  }));
               }


            }
         },
         function (data) {
            $('#spinner').hide();
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );

   }


   function llenaComboFondosUsu() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'lista_fondos_usu';
      req.cod_usuario = $(":selected", $('#cbUsuarios')).val();

      $cbFondos.empty();

      $cbFondos.append($("<option>", {
         value: 0,
         text: 'Seleccione un Fondo'
      }));

      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();

            if (data.resp != null) {

               let _listaFondos = data.resp.fondosUsu;


               for (item in _listaFondos) {

                  let _codFondo = _listaFondos[item]['cod_fondo'];
                  let _nomFondo = _listaFondos[item]['nom_fondo'];

                  $cbFondos.append($("<option>", {
                     value: _codFondo,
                     text: _nomFondo
                  }));
               }


            }
         },
         function (data) {
            $('#spinner').hide();
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );

   }



   function llenaComboUsuarios() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'lista_usuarios';

      $cbUsuarios.empty();

      $cbUsuarios.append($("<option>", {
         value: 0,
         text: 'Seleccione un Usuario'
      }));

      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();

            if (data.resp != null) {

               let _listaUsuarios = data.resp.listaUsu;

               for (item in _listaUsuarios) {

                  let _codUsu = _listaUsuarios[item]['cod_usuario'];
                  let _nomUsu = _listaUsuarios[item]['nom_usuario'];

                  $cbUsuarios.append($("<option>", {
                     value: _codUsu,
                     text: _nomUsu
                  }));
               }


               $("#cbUsuarios option[value='" + sessionStorage.getItem("COD_USUARIO") + "']").attr("selected", true);



               if (sessionStorage.getItem("TIPO_USUARIO") != 3) {

                  $cbUsuarios.prop("disabled", true);
                  llenaComboFondosUsu();
               }else{
                  llenaComboFondos();
               }

               $cbFondos.focus();

            }
         },
         function (data) {
            $('#spinner').hide();
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );

   }


   function consultaMovimientos() {


      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_periodo_mov_caja';
      req.cod_fondo = $(":selected", $('#cbFondos')).val();
      req.cod_usuario = $(":selected", $('#cbUsuarios')).val();
      req.fecha_inicial = $txtFechaIni.val();
      req.fecha_final = $txtFechaFin.val();


      $tblMovCaja.clear().draw();

      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();
           // console.log(data);

            if (data.resp != null) {

               let _saldoIni = Number.parseInt(data.resp.saldo_inicial);

               let _movimientos = data.resp.movimientos;

               listaMovCaja = [];

               let _montoMov = 0;

               for (let i = 0; i < _movimientos.length; i++) {
                  let mov = new Object();
                  mov.numConse = _movimientos[i].num_conse;

                  let a_fecha = (_movimientos[i].fec_mov).split('-');
                  let fecha_liq = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];
                  mov.fecMov = fecha_liq;
                  //mov.fecMov = _movimientos[i].fec_mov;
                  mov.docRef = _movimientos[i].doc_refe;
                  mov.detMov = _movimientos[i].det_mov;

                  mov.monMov = Number.parseInt(_movimientos[i].mon_mov);
                  //mov.monMov = _movimientos[i].mon_mov;
                  _montoMov = _montoMov + Number.parseInt(_movimientos[i].mon_mov);

                  listaMovCaja.push(mov);
               }

               _saldoFin = _saldoIni + _montoMov;

               $txtSaldoIni.val(nf_entero.format(_saldoIni));
               $txtTotMov.val(nf_entero.format(_montoMov));
               $txtSaldoFin.val(nf_entero.format(_saldoFin));


               $tblMovCaja.rows.add(listaMovCaja).draw();
            }

         },
         function (data) {
            $('#spinner').hide();
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );
   }

   function imprimeReporte() {

      if ($(":selected", $('#cbFondos')).val() != 0 && $(":selected", $('#cbUsuarios')).val() != 0) {
         console.log('Imprimiendo reporte');

         let datos = new Object();
         datos.nomFondo = $(":selected", $('#cbFondos')).text()
         datos.nomCaja = $(":selected", $('#cbUsuarios')).text()
         datos.salIni = $txtSaldoIni.val();
         datos.monMov = $txtTotMov.val();
         datos.salFin = $txtSaldoFin.val();
         let a_fecha = $txtFechaIni.val().split('-');
         datos.fecIni = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];
         a_fecha = $txtFechaFin.val().split('-');
         datos.fecFin = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];
         datos.listaMov = listaMovCaja;

         new Movimientos_Caja(datos);

      }
   }

});