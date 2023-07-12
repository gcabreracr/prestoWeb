$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina


   var listaAbonos = [];

   const $cbFondos = $('#cbFondos');
   const $cbUsuarios = $('#cbUsuarios');

   const $txtFechaIni = $('#txtFechaIni').val(obtieneFechaActual());
   const $txtFechaFin = $('#txtFechaFin').val(obtieneFechaActual());


   const $txtMonTotal = $('#txtMonTotal').val('0');

   const $btnConsultar = $('#btnConsultar');
   const $btnVistaPrevia = $('#btnVistaPrevia');


   var $tblAbonos;



   ini_componentes();

   llenaComboFondos();
   llenaComboUsuarios();


   function ini_componentes() {


      $tblAbonos = $('#tblAbonos').DataTable({

         destroy: true,
         data: listaAbonos,
         columns: [
            {
               data: 'fecRec',
               className: 'dt-center'

            },
            {
               data: 'numRec',
               className: 'dt-center'

            },
            {
               data: 'numPtmo',
               className: 'dt-center'

            },
            {
               data: 'nomCliente'

            },
            {
               data: 'monAbono',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false
            }

         ],

         ordering: false,
         language: lenguaje_data_table

      }); /// Fin de creacion de datatable

      $tblAbonos.clear().draw();


      $cbFondos.change(function () {

         $tblAbonos.clear().draw();
         listaAbonos = [];

      });

      $cbUsuarios.change(function () {

         $tblAbonos.clear().draw();
         listaAbonos = [];

      });



      $btnConsultar.click(function (e) {

         e.preventDefault();

         let _codFondo = $(":selected", $('#cbFondos')).val();
         let _codUsuario = $(":selected", $('#cbUsuarios')).val();


         if (_codFondo == 0) {

            $cbFondos.focus();
            Swal.fire({ title: "Debe seleccionar un fondo", icon: "error" });
            return;
         }

         if (_codUsuario == '0') {

            $cbUsuarios.focus();
            Swal.fire({ title: "Debe seleccionar una caja ", icon: "error" });
            return;
         }


         consultaAbonos();

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
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
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

            }
         },
         function (data) {
            $('#spinner').hide();
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         }
      );

   }


   function consultaAbonos() {


      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_abonos_emitidos';
      req.cod_fondo = $(":selected", $('#cbFondos')).val();
      req.cod_usuario = $(":selected", $('#cbUsuarios')).val();
      req.fecha_ini = $txtFechaIni.val();
      req.fecha_fin = $txtFechaFin.val();


      $tblAbonos.clear().draw();
      listaAbonos = [];

     // console.log(req)

      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();
            //console.log(data);

            if (data.resp != null) {


               let _abonos = data.resp.listaAbonos;
               let _totAbonos = 0;

               for (let i = 0; i < _abonos.length; i++) {
                  let abono = new Object();

                  
                  let a_fecha = (_abonos[i].fecha_abo).split('-');
                  let fecha_liq = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];
                  abono.fecRec = fecha_liq;

                  abono.numRec = _abonos[i].num_conse;
                  abono.numPtmo = _abonos[i].num_ptmo;
                  abono.nomCliente = _abonos[i].nomCliente;

                  abono.monAbono = Number.parseInt(_abonos[i].mon_abono);                  
                  _totAbonos += Number.parseInt(_abonos[i].mon_abono);

                  listaAbonos.push(abono);
               }
               $txtMonTotal.val(nf_entero.format(_totAbonos));
               $tblAbonos.rows.add(listaAbonos).draw();
            }

         },
         function (data) {
            $('#spinner').hide();
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         }
      );
   }








});