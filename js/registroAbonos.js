$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina


   var listaPtmos = [];

   var _saldoPtmo = 0;
   var _monAbono = 0;


   const $cbFondos = $('#cbFondos');
   const $cbUsuarios = $('#cbUsuarios');


   const $btnBuscaPtmo = $('#btnBuscaPtmo');
   const $btnVistaPrevia = $('#btnVistaPrevia');

   const $txtNumRecibo = $('#txtNumRecibo');
   const $txtNumPtmo = $('#txtNumPtmo');
   const $txtNomCli = $('#txtNomCli');


   const $txtFecAbono = $('#txtFecAbono').val(obtieneFechaActual());

   const $txtSalIni = $('#txtSalIni').val('0');
   const $txtSalFin = $('#txtSalFin').val('0');
   const $txtMonAbo = $('#txtMonAbo').val('0');


   const $btnGuardar = $('#btnGuardar');
   const $btnAnular = $('#btnAnular');
   const $btnCancelar = $('#btnCancelar');
   const $btnNuevo = $('#btnNuevo');

   $('#btnImprimir').click(function () { imprimeTkt(); });
   $('#btnCopiar').click(function () { copiaTkt(); })





   ini_componentes();
   llenaComboFondos();
   llenaComboUsuarios();

   inactivaCampos();

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


      $txtNumRecibo.focus(function () {
         $(this).select();
         inactivaCampos();
         $txtNumPtmo.prop("disabled", true);
         $btnBuscaPtmo.prop("disabled", true);

      }).keydown(function (e) {
         let code = e.keyCode || e.which;
         if (code == 13 || code == 9) {

            if ($txtNumRecibo.val().length > 0) {

               console.log('Consultando recibo');

               consultaRecibo();

            } else {

               nuevoRecibo();
            }
            e.preventDefault();
         }
      });



      $txtFecAbono.change(function (e) {

         $txtMonAbo.focus();

         e.preventDefault();
      });



      $cbFondos.change(function () {

         $cbProductos.focus();

      });

      $cbUsuarios.change(function () {

         $cbFondos.focus();

      });




      $btnBuscaPtmo.click(function (e) {

         listaPtmosTotal();

         e.preventDefault();
      })

      $txtNumPtmo.focus(function () {
         $(this).select();
         inactivaCampos();

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




      $txtMonAbo.focus(function () {
         $(this).select();

      }).keydown(function (e) {
         let code = e.keyCode || e.which;
         if (code == 13 || code == 9) {

            if ($txtMonAbo.val().length > 0) {

               let x = Number.parseInt($(this).val().replace(/,/g, ''));

               $(this).val(nf_entero.format(x));

               calculaMontos();

               $btnGuardar.focus();


            }

            e.preventDefault();
         }
      });

      $btnNuevo.click(function (e) {

         nuevoRecibo();

         e.preventDefault();
      });


      $btnGuardar.click(function (e) {

         guardaRecibo();

         e.preventDefault();
      });


      $btnAnular.click(function (e) {

         Swal.fire({
            title: 'Desea anular el recibo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
         }).then((result) => {
            if (result.isConfirmed) {
               console.log('Anulando recibos')

               anulaRecibo();
            } else {

               document.forms.regAbo_form.reset();
               $txtFecAbono.val(obtieneFechaActual());
               $txtSalIni.val('0');
               $txtMonAbo.val('0');
               $txtSalFin.val('0');


               $("#cbUsuarios option[value='0']").attr("selected", true);
               $("#cbFondos option[value='0']").attr("selected", true);


               $txtNumRecibo.focus();

            }


         })



         e.preventDefault();
      });

      $btnCancelar.click(function (e) {

         location.reload();

      });

      $btnVistaPrevia.click(function (e) {

         console.log('Imprimiendo Recibo')

         imprimeRecibo();

      });

   }

   function inactivaCampos() {

      $txtFecAbono.prop("disabled", true);
      $cbFondos.prop("disabled", true);
      $cbUsuarios.prop("disabled", true);
      $txtMonAbo.prop("disabled", true);
      $btnGuardar.prop("disabled", true);
      $btnAnular.prop("disabled", true);
      $btnVistaPrevia.prop("disabled", true);

   }

   function activaCampos() {


      if (sessionStorage.getItem("TIPO_USUARIO") == 3) {
         $txtFecAbono.prop("disabled", false);
         $cbUsuarios.prop("disabled", false);
         //$cbFondos.prop("disabled", false);
      }

      $txtMonAbo.prop("disabled", false);

   }

   function nuevoRecibo() {

      console.log('Registrando nuevo recibo');

      nuevo = true;


      document.forms.regAbo_form.reset();
      $txtFecAbono.val(obtieneFechaActual());
      $txtSalIni.val('0');
      $txtMonAbo.val('0');
      $txtSalFin.val('0');

      $("#cbUsuarios option[value='" + sessionStorage.getItem("COD_USUARIO") + "']").attr("selected", true);
      $("#cbFondos option[value='0']").attr("selected", true);

      $txtNumPtmo.prop("disabled", false);
      $btnBuscaPtmo.prop("disabled", false);
      $txtNumPtmo.focus();

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

               $("#cbUsuarios option[value='" + sessionStorage.getItem("COD_USUARIO") + "']").attr("selected", true);

            }
         },
         function (data) {
            $('#spinner').hide();
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         }
      );

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

   function consultaRecibo() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_abono';
      req.num_conse = $txtNumRecibo.val();

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();

            console.log(data);

            if (data.resp == null) {
               $txtNumRecibo.focus();
               Swal.fire({ title: "Abono NO existe", icon: "error" });
               return;
            }
            $txtNumPtmo.val(data.resp.num_ptmo);
            $txtFecAbono.val(data.resp.fecha_abo);
            $txtNomCli.val(data.resp.nomCliente);

            $("#cbFondos option[value='" + data.resp.cod_fondo + "']").attr("selected", true);
            $("#cbUsuarios option[value='" + data.resp.cod_usuario + "']").attr("selected", true);
            let _saldoFin = parseInt(data.resp.sal_final);
            let _abono = parseInt(data.resp.mon_abono);
            let _saldoIni = _saldoFin + _abono;

            $txtSalIni.val(nf_entero.format(_saldoIni));
            $txtMonAbo.val(nf_entero.format(_abono));
            $txtSalFin.val(nf_entero.format(_saldoFin));


            if (sessionStorage.getItem("TIPO_USUARIO") == 3) {

               $btnAnular.prop("disabled", false);
            }

            $btnVistaPrevia.prop("disabled", false);
            $btnVistaPrevia.focus();


         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });


   }



   function consultaPrestamo() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_prestamo';
      req.num_ptmo = $txtNumPtmo.val();

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();

            // console.log(data);

            if (data.resp == null) {
               $txtNumPtmo.focus();
               Swal.fire({ title: "Préstamo No Exite", icon: "error" });
               return;
            }

            $txtNomCli.val(data.resp.nomCliente);
            $("#cbFondos option[value='" + data.resp.cod_fondo + "']").attr("selected", true);
            _saldoPtmo = parseInt(data.resp.mon_saldo);

            $txtSalIni.val(nf_entero.format(_saldoPtmo));


            if (_saldoPtmo == 0) {

               $txtNumPtmo.focus();
               Swal.fire({ title: "Prestamo ya fue cancelado", icon: "error" });
               return;
            }

            activaCampos();
            $btnGuardar.prop("disabled", false);
            $txtMonAbo.focus();


         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });


   }


   function anulaRecibo() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'anula_abono';
      req.num_conse = $txtNumRecibo.val();

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();


            console.log(data);

            let msg = data.resp.msg;

            inactivaCampos();

            $txtNumPtmo.prop("disabled", true);
            $btnVistaPrevia.prop("disabled", true);
            $btnAnular.prop("disabled", true);
            $txtNumRecibo.focus();

            Swal.fire({ title: msg, icon: "success" })

         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });


   }


   function calculaMontos() {

      //_saldoPtmo = Number.parseInt($txtMonAbo.val().replace(/,/g, ''));
      _monAbono = Number.parseInt($txtMonAbo.val().replace(/,/g, ''));

      let _saldoFin = _saldoPtmo - _monAbono;
      $txtSalFin.val(nf_entero.format(_saldoFin));

   }

   function guardaRecibo() {


      if ($(":selected", $('#cbUsuarios')).val() == 0) {
         $cbUsuarios.focus();
         Swal.fire({ title: "Debe seleccionar un Usuario", icon: "error" });
         return;
      }

      if ($(":selected", $('#cbFondos')).val() == 0) {
         $cbFondos.focus();
         Swal.fire({ title: "Debe seleccionar un Fondo", icon: "error" });
         return;
      }



      let _monAbono = Number.parseInt($txtMonAbo.val().replace(/,/g, ''));
      let _saldoFin = Number.parseInt($txtSalFin.val().replace(/,/g, ''));

      if (_monAbono == 0) {
         $txtMonAbo.focus();
         Swal.fire({ title: "Monto abono no puede ser CERO", icon: "error" });
         return;
      }

      if (_monAbono > _saldoPtmo) {

         $txtMonAbo.focus();
         Swal.fire({ title: "Abono NO puede ser mayor al saldo del prestamo", icon: "error" });
         return;
      }




      let fecha = new Date();
      let hora = fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();


      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'agrega_abono';
      req.num_ptmo = $txtNumPtmo.val();
      req.cod_usuario = $(":selected", $('#cbUsuarios')).val();
      req.cod_fondo = $(":selected", $('#cbFondos')).val();
      req.fec_abono = $txtFecAbono.val();
      req.hora_ptmo = hora;
      req.mon_abono = _monAbono;
      req.saldo_fin = _saldoFin;


      api_postRequest(req,
         function (data) {
            $('#spinner').hide();

            //console.log(data);

            $txtNumRecibo.val(data.resp.num_conse);
            let msg = data.resp.msg;

            inactivaCampos();

            $txtNumPtmo.prop("disabled", true);
            $btnVistaPrevia.prop("disabled", false);
            $btnVistaPrevia.focus();

            Swal.fire({ title: msg, icon: "success" });

         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });

   }

   function imprimeRecibo() {

      let _numRecibo = parseInt($txtNumRecibo.val());

      if (_numRecibo == 0) {
         //sweetAlert({ title: "Tiquete NO ha sido enviado", type: "warning" });
         return;
      }


      let aFecha = $txtFecAbono.val().split('-');
      let fecha = aFecha[2] + '/' + aFecha[1] + '/' + aFecha[0];

      let datos = new Object();
      datos.num_recibo = _numRecibo;
      datos.fec_recibo = fecha;
      datos.nomCliente = $txtNomCli.val();
      datos.det_abono = 'abono OP-' + $txtNumPtmo.val();
      datos.salIni = $txtSalIni.val();
      datos.monAbo = $txtMonAbo.val();
      datos.salFin = $txtSalFin.val();



      let detalleTkt = '';

      detalleTkt = creaTkt80mm(datos);

      /*if (sessionStorage.getItem("ANCHO_TKT") == '80mm') {
         detalleTkt = creaTkt80mm(datos);
      } else {
         detalleTkt = creaTkt57mm(datos);
      }*/

      document.getElementById("divTT").innerHTML = detalleTkt;

      $('#modalTkt').modal('show');
      $('#btnImprimir').focus();
   }

   function imprimeTkt() {

      var divToPrint = document.getElementById("divTT");
  
      newWin = window.open("");
      newWin.document.write(divToPrint.outerHTML);
      newWin.print();
      newWin.close();
  
  }
  
  function copiaTkt() {
      let range = document.createRange();
      range.selectNode(document.getElementById('divTT'));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      //alert('Tiquete copiado');
  
  }
  


});