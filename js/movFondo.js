$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

   var listaMovFondo = [];
   var nuevo = true;
   var numConse = 0;


   const $cbFondos = $('#cbFondos');
   const $btnNuevoMov = $('#btnNuevoMov').click(function (e) {
      e.preventDefault();
      $txtDocRef.focus();
   });

   const $txtFechaMov = $('#txtFechaMov').val(obtieneFechaActual());
   const $txtDocRef = $('#txtDocRef');
   const $txtDetalle = $('#txtDetalle');
   const $txtMonMov = $('#txtMonMov');

   var $tblMovFondo;
   const $btnGuardar = $('#btnGuardar');


   ini_componentes();
   llenaComboFondos();


   function ini_componentes() {


      $tblMovFondo = $('#tblMovFondo').DataTable({

         destroy: true,
         data: listaMovFondo,
         columns: [
            {
               data: 'fecMov',
               className: 'dt-center',
               width: '10%'
            },
            {
               data: 'docRef',

            },
            {
               data: 'detMov',

            },

            {
               data: 'monMov',
               width: '20%',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false
            },
            {
               defaultContent: '<button class="editar btn btn-primary"><i class="bi bi-pen"></i></button> <button class="eliminar btn btn-danger"><i class="bi bi-trash"></i></button>',
               className: 'dt-right',
               width: '10%'


            }

         ],

         ordering: false,
         language: lenguaje_data_table

      }); /// Fin de creacion de datatable

      $tblMovFondo.clear().draw();


      $('#tblMovFondo tbody').on('click', 'button.editar', function () {

         //let data = $tblMovFondo.row($(this).parents('tr')).data();
         let fila = $tblMovFondo.row($(this).parents('tr')).index();     

        $txtFechaMov.val(listaMovFondo[fila].fecMov);
        $txtDocRef.val(listaMovFondo[fila].docRef);
        $txtDetalle.val(listaMovFondo[fila].detMov);
        $txtMonMov.val(nf_entero.format(listaMovFondo[fila].monMov));
        numConse = listaMovFondo[fila].numConse;
        nuevo = false;

        $('#modForFondo').modal('show');




      }); // Fin de funcion boton editar numero table

      $('#tblMovFondo tbody').on('click', 'button.eliminar', function () {


         let fila = $tblMovFondo.row($(this).parents('tr')).index();

         numConse = listaMovFondo[fila].numConse;

         anulaMovimiento();
     


      }); // Fin de funcion boton eliminar numero table


      $txtDocRef.focus(function () {
         $(this).select();
      }).keydown(function (e) {

         let code = e.keyCode || e.which;
         if (code == 13 || code == 9) {

            $txtDetalle.focus();

            e.preventDefault();
         }

      });

      $txtDetalle.focus(function () {
         $(this).select();
      }).keydown(function (e) {

         let code = e.keyCode || e.which;
         if (code == 13 || code == 9) {

            $txtMonMov.focus();

            e.preventDefault();
         }

      });

      $txtMonMov.focus(function () {
         $(this).select();
      }).keydown(function (e) {

         let code = e.keyCode || e.which;
         if (code == 13 || code == 9) {

            let x = Number.parseInt($(this).val().replace(',', ''));

            $(this).val(nf_entero.format(x));

            $btnGuardar.focus();

            e.preventDefault();
         }

      });

      $cbFondos.change(function () {
         if ($(":selected", $('#cbFondos')).val() != 0) {
            consultaMovimientos();
         } else {

            $tblMovFondo.clear().draw();
            listaMovFondo = [];
         }


      });

      $btnNuevoMov.click(function (e) {

         if ($(":selected", $('#cbFondos')).val() == 0) {
            $cbFondos.focus();
            sweetAlert({ title: "Debe seleccionar un fondo", type: "error" });
            return;

         }

         $txtFechaMov.val(obtieneFechaActual());
         $txtDocRef.val('');
         $txtDetalle.val('');
         $txtMonMov.val('0');
         $txtDocRef.focus();
         nuevo = true;
         numConse = 0;

         $('#modForFondo').modal('show');

         e.preventDefault();

      });


      $btnGuardar.click(function (e) {

         if ($txtDocRef.val().length == 0) {

            $txtDocRef.focus();
            sweetAlert({ title: "Campo Documento Referencia es requerido", type: "error" });
            return;

         }
         if ($txtDetalle.val().length == 0) {

            $txtDetalle.focus();
            sweetAlert({ title: "Campo Documento Referencia es requerido", type: "error" });
            return;

         }

         guardaMovimiento();


         e.preventDefault();
      })







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


   function consultaMovimientos() {


      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'lista_mov_fondo';
      req.cod_fondo = $(":selected", $('#cbFondos')).val();

      $tblMovFondo.clear().draw();

      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();
            console.log(data);

            if (data.resp != null) {

               let _movimientos = data.resp.movimientos;

               listaMovFondo = [];

               for (let i = 0; i < _movimientos.length; i++) {
                  let mov = new Object();
                  mov.numConse = _movimientos[i].num_conse;

                  //let a_fecha = (_movimientos[i].fec_mov).split('-');
                  //let fecha_liq = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];
                  mov.fecMov = _movimientos[i].fec_mov;
                  mov.docRef = _movimientos[i].doc_refe;
                  mov.detMov = _movimientos[i].detalle;

                  mov.monMov = Number.parseInt(_movimientos[i].mon_mov);
                  //mov.monMov = _movimientos[i].mon_mov;


                  listaMovFondo.push(mov);
               }

               $tblMovFondo.rows.add(listaMovFondo).draw();
            }

         },
         function (data) {
            $('#spinner').hide();
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );

   }


   function guardaMovimiento() {

    
      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'actualiza_mov_fondo';
      req.nuevo = nuevo;
      req.num_conse = numConse;
      req.cod_fondo = $(":selected", $('#cbFondos')).val();
      req.fecha_mov = $txtFechaMov.val();
      req.doc_refe = $txtDocRef.val();
      req.detalle = $txtDetalle.val();
      req.monto_mov = $txtMonMov.val().length > 0 ? Number.parseInt($txtMonMov.val().replace(/,/g, '')) : 0;


      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();

            console.log(data);

            $('#modForFondo').modal('hide');          
            consultaMovimientos();
            let msg = data.resp.msg;
            sweetAlert({ title: msg, type: "success" });

         },
         function (data) {
            $('#spinner').hide();
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );

   }
   
   function anulaMovimiento() {

    
      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'anula_mov_fondo';
      req.num_conse = numConse;

      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();

           
            consultaMovimientos();
            let msg = data.resp.msg;
            sweetAlert({ title: msg, type: "success" });

         },
         function (data) {
            $('#spinner').hide();
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );

   }



});