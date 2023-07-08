$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina


   var listaPtmos = [];

   const $cbFondos = $('#cbFondos');
   const $cbUsuarios = $('#cbUsuarios');

   const $txtFechaIni = $('#txtFechaIni').val(obtieneFechaActual());
   const $txtFechaFin = $('#txtFechaFin').val(obtieneFechaActual());


   const $txtMonTotal = $('#txtMonTotal').val('0');

   const $btnConsultar = $('#btnConsultar');
   const $btnVistaPrevia = $('#btnVistaPrevia');


   var $tblPtmos;



   ini_componentes();

   llenaComboFondos();
   llenaComboUsuarios();


   function ini_componentes() {


      $tblPtmos = $('#tblPtmos').DataTable({

         destroy: true,
         data: listaPtmos,
         columns: [
            {
               data: 'fecPtmo',
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
               data: 'monPtmo',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false
            },
            {
               data: 'codUsuario'

            }

         ],

         ordering: false,
         language: lenguaje_data_table

      }); /// Fin de creacion de datatable

      $tblPtmos.clear().draw();


      $cbFondos.change(function () {

         $tblPtmos.clear().draw();
         listaPtmos = [];

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

         consultaPtmos();

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
         text: 'Todos lo usuarios'
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


   function consultaPtmos() {


      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_ptmos_emitidos';
      req.cod_fondo = $(":selected", $('#cbFondos')).val();
      req.cod_usuario = $(":selected", $('#cbUsuarios')).val();
      req.fecha_ini = $txtFechaIni.val();
      req.fecha_fin = $txtFechaFin.val();


      $tblPtmos.clear().draw();
      listaPtmos = [];

      console.log(req)

      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();
            //console.log(data);

            if (data.resp != null) {

           
               let _ptmos = data.resp.listaPtmos;              
               let _totPtmos = 0;

               for (let i = 0; i < _ptmos.length; i++) {
                  let ptmo = new Object();
                  ptmo.numPtmo = _ptmos[i].num_ptmo;

                  let a_fecha = (_ptmos[i].fecha_reg).split('-');
                  let fecha_liq = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];
                  ptmo.fecPtmo = fecha_liq;
                
                  ptmo.nomCliente = _ptmos[i].nomCliente;
                
                  let _monPtmo = Number.parseInt(_ptmos[i].mon_ptmo)+Number.parseInt(_ptmos[i].mon_ints);

                  ptmo.monPtmo = _monPtmo;
                  _totPtmos += _monPtmo;

                  ptmo.codUsuario = _ptmos[i].cod_usuario;

                  listaPtmos.push(ptmo);
               }

              
               $txtMonTotal.val(nf_entero.format(_totPtmos));


               $tblPtmos.rows.add(listaPtmos).draw();
            }

         },
         function (data) {
            $('#spinner').hide();
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         }
      );
   }

});