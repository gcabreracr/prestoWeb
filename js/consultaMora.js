$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

   var listaPtmos = [];

   const $cbFondos = $('#cbFondos');
   const $txtTotMora = $('#txtTotMora').val('0');

   var $tblPtmos;


   ini_componentes();

   llenaComboFondos();

   function ini_componentes() {

      $tblPtmos = $('#tblPtmosMora').DataTable({

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

            }, {
               data: 'numCuotas',
               className: 'dt-center',

            },

            {
               data: 'salMora',
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

         listaPtmosMora();

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

   function listaPtmosMora() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_mora';
      req.cod_fondo = $(":selected", $('#cbFondos')).val();

      $tblPtmos.clear().draw();

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();

            let _totMora = 0;

            listaPtmos = [];

            if (data.resp != null) {

               let _ptmos = data.resp.mora;

               for (let i = 0; i < _ptmos.length; i++) {

                  let _ptmo = new Object();
                  _ptmo.numPtmo = _ptmos[i].num_ptmo;
                  _ptmo.nomCliente = _ptmos[i].nomCliente;

                  _ptmo.numCuotas = parseInt(_ptmos[i].canCuo);

                  let _salMora = parseInt(_ptmos[i].salMora);
                  _ptmo.salMora = _salMora;

                  _totMora += _salMora;

                  listaPtmos.push(_ptmo);
               }

               $tblPtmos.rows.add(listaPtmos).draw();
            }

            $txtTotMora.val(nf_entero.format(_totMora));



         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });

   }

});