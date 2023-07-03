$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina


   var listaPtmos = [];
   var listaAbonos = [];



   const $btnBuscaPtmo = $('#btnBuscaPtmo');

   const $btnVistaPrevia = $('#btnVistaPrevia');

   const $txtNumPtmo = $('#txtNumPtmo');

   const $txtNomCli = $('#txtNomCli');




   const $txtMonPtmo = $('#txtMonPtmo').val('0');
   const $txtMonAbo = $('#txtMonAbo').val('0');
   const $txtSalPtmo = $('#txtMonSal').val('0');
   


   var $tblPtmos;
   var $tblAbonos;


   ini_componentes();


   function ini_componentes() {

      $tblPtmos = $('#tblPtmos').DataTable({

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
               defaultContent: '<button class="editar btn btn-light"><i class="bi bi-arrow-right-circle"></i></button>',
               className: 'dt-right',
               width: '10%'

            }              
          

         ],

         ordering: false,
         language: lenguaje_data_table

      }); /// Fin de creacion de datatable

      $tblPtmos.clear().draw();

      $('#tblPtmos').on('click', 'button.editar', function () {

         let fila = $tblPtmos.row($(this).parents('tr')).index();

         $('#modBuscaPtmo').modal('hide');

         $txtNumPtmo.val(listaPtmos[fila].numPtmo);

         consultaPrestamo();


      }); // Fin de funcion boton editar numero table


      $tblAbonos = $('#tblAbonos').DataTable({

         destroy: true,
         data: listaAbonos,
         columns: [

           
            {
               data: 'fecAbo',
               className: 'dt-center',
               width: '20%'

            },

            {
               data: 'numConse',
               className: 'dt-center',

            },

            {
               data: 'monAbo',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false
            },
            {
               data: 'salPtmo',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false
            }       

         ],

         ordering: false,
         language: lenguaje_data_table

      }); /// Fin de creacion de datatable

      $tblAbonos.clear().draw();

      $btnBuscaPtmo.click(function (e) {

         listaPtmosTotal();

         e.preventDefault();
      })

      $txtNumPtmo.focus(function () {
         $(this).select();        

      }).keydown(function (e) {
         let code = e.keyCode || e.which;
         if (code == 13 || code == 9) {

            if ($txtNumPtmo.val().length > 0) {

               console.log('Consultando prestamo');
               consultaPrestamo();
            } 

            e.preventDefault();
         }
      });  



      $btnVistaPrevia.click(function (e) {

         console.log('Imprimiendo Prestamo')

      });




   }



   function listaPtmosTotal() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'lista_ptmos_total';

      $tblPtmos.clear().draw();

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();

            listaPtmos = [];

            if (data.resp != null) {

               let _ptmos = data.resp.listaPtmos;

               for (let i = 0; i < _ptmos.length; i++) {

                  let _ptmo = new Object();
                  _ptmo.numPtmo = _ptmos[i].num_ptmo;
                  _ptmo.nomCliente = _ptmos[i].nomCliente;
                  _salPtmo = parseInt(_ptmos[i].mon_saldo);
                  _ptmo.salPtmo = _salPtmo;

                  listaPtmos.push(_ptmo);
               }

               $tblPtmos.rows.add(listaPtmos).draw();
            }

         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });

   }




   function consultaPrestamo() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_estado_ptmo';
      req.num_ptmo = $txtNumPtmo.val();

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();

           //console.log(data);

            if (data.resp == null) {
               $txtNumPtmo.focus();

               Swal.fire("Préstamo No Exite");
              
               return;
            }

          
            $txtNomCli.val(data.resp.nomCliente);
         

            let _montoPtmo = parseInt(data.resp.monTotal);
            let _saldoPtmo = parseInt(data.resp.mon_saldo);
            let _monAbonos = _montoPtmo - _saldoPtmo;

            $txtMonPtmo.val(nf_entero.format(_montoPtmo));
            $txtMonAbo.val(nf_entero.format(_monAbonos));            
            $txtSalPtmo.val(nf_entero.format(_saldoPtmo));

            
            let _abonos = data.resp.abonos;

            listaAbonos = [];
            $tblAbonos.clear().draw();

            let _saldo = _montoPtmo;

            for (let i = 0; i < _abonos.length; i++) {
               let _abono = new Object();
               _abono.numConse = _abonos[i].num_conse;

               let _fecha = _abonos[i].fecha_abo;

               let a_fecha = _fecha.split('-');

               _abono.fecAbo = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];

               let _monAbo= parseInt(_abonos[i].mon_abono);
            
               _abono.monAbo = _monAbo;

               _saldo -= _monAbo;

               _abono.salPtmo =  _saldo;

               listaAbonos.push(_abono);
            }

            $tblAbonos.rows.add(listaAbonos).draw();           

          $btnVistaPrevia.focus();



         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });

   }




});