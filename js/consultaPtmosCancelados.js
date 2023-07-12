$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina


   var listaPtmos = [];

   const $cbFondos = $('#cbFondos');
  

   const $txtFechaIni = $('#txtFechaIni').val(obtieneFechaActual());
   const $txtFechaFin = $('#txtFechaFin').val(obtieneFechaActual());


   const $txtMonTotal = $('#txtMonTotal').val('0');
  

   const $btnConsultar = $('#btnConsultar');
   const $btnVistaPrevia = $('#btnVistaPrevia');


   var $tblPtmos;



   ini_componentes();

   llenaComboFondos();
  


   function ini_componentes() {


      $tblPtmos = $('#tblPtmos').DataTable({

         destroy: true,
         data: listaPtmos,
         columns: [
            
            {
               data: 'numPtmo',
               className: 'dt-center',
               width: '10%'
               

            },
            {
               data: 'nomCliente'

            },
            {
               data: 'fecPago',
               className: 'dt-center',
               width: '20%'
               

            },
            {
               data: 'monPtmo',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false,
               width: '20%'
            },
           
            {
               data: 'codUsuario',
               width: '20%'

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



   function consultaPtmos() {


      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_ptmos_cancelados';
      req.cod_fondo = $(":selected", $('#cbFondos')).val();      
      req.fecha_ini = $txtFechaIni.val();
      req.fecha_fin = $txtFechaFin.val();


      $tblPtmos.clear().draw();
      listaPtmos = [];

      //console.log(req)

      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();
            //console.log(data);

            if (data.resp != null) {


               let _ptmos = data.resp.ptmosCancelados;
               let _totPtmos = 0;
               


               for (let i = 0; i < _ptmos.length; i++) {
                  let ptmo = new Object();
                  ptmo.numPtmo = _ptmos[i].num_ptmo;

                  let a_fecha = (_ptmos[i].fecha_abo).split('-');
                  let fecha = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];
                  ptmo.fecPago = fecha;

                  ptmo.nomCliente = _ptmos[i].nomCliente;

                  let _monPtmo = Number.parseInt(_ptmos[i].mon_ptmo);                  

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