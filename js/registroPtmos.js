$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
  
   var listaCuotas = [];
 

   const $cbFondos = $('#cbFondos');
   const $cbUsuarios = $('#cbUsuarios');
   const $cbProductos = $('#cbProductos');

   const $txtFechaPtmo = $('#txtFechaPtmo').val(obtieneFechaActual());
  
   const $txtSaldoIni = $('#txtSaldoIni').val('0');
   const $txtTotMov = $('#txtTotMov').val('0');
   const $txtSaldoFin = $('#txtSaldoFin').val('0');

 
   var $tblCuotas;



   ini_componentes();
   llenaComboFondos();
   llenaComboUsuarios();


   function ini_componentes() {


      $tblCuotas = $('#tblCuotas').DataTable({

         destroy: true,
         data: listaCuotas,
         columns: [
            {
               data: 'numCuota',
               className: 'dt-center',
               width: '20%'
            },
            {
               data: 'fecCuota',

            },           

            {
               data: 'monCuota',
               width: '20%',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false
            }

         ],

         ordering: false,
         language: lenguaje_data_table

      }); /// Fin de creacion de datatable

      $tblCuotas.clear().draw();


      $cbFondos.change(function () {

         $tblCuotas.clear().draw();
         listaCuotas = [];

      });

      $cbUsuarios.change(function () {

         $tblMovCaja.clear().draw();
         listaMovCaja = [];


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
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );

   }


   

});