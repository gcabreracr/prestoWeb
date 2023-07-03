$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

   var listaPtmos = [];

   const $cbFondos = $('#cbFondos');
   const $txtTotPtmos = $('#txtTotPtmos').val('0');

   var $tblPtmos;


   ini_componentes();

   llenaComboFondos();

   function ini_componentes() {

      $tblPtmos = $('#tblPtmosFondo').DataTable({

         destroy: true,
         data: listaPtmos,
         columns: [
            {
               data: 'numPtmo',
               className: 'dt-center',
               width: '20%'
            },
            {
               data: 'nomCliente',

            },

            {
               data: 'salPtmo',
               width: '20%',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false
            }

         ],

         ordering: false,
         language: lenguaje_data_table

      }); /// Fin de creacion de datatable

      $tblPtmos.clear().draw();


      $cbFondos.change(function (e) {

         listaPtmosFondo();

         e.preventDefault();


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

   function listaPtmosFondo() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'lista_ptmos_fondo';
      req.cod_fondo = $(":selected", $('#cbFondos')).val();

      $tblPtmos.clear().draw();

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();           

            let _totPtmos = 0;
          
            listaPtmos = [];

            if (data.resp != null) {

               let _ptmos = data.resp.listaPtmos;

               for (let i = 0; i < _ptmos.length; i++) {
                  
                  let _ptmo = new Object();
                  _ptmo.numPtmo = _ptmos[i].num_ptmo;
                  _ptmo.nomCliente = _ptmos[i].nomCliente;
                  _salPtmo = parseInt(_ptmos[i].mon_saldo);
                  _ptmo.salPtmo = _salPtmo;

                  _totPtmos += _salPtmo;

                  listaPtmos.push(_ptmo);
               }

               $tblPtmos.rows.add(listaPtmos).draw();
            }
            
            $txtTotPtmos.val(nf_entero.format(_totPtmos));



         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });

   }

});