$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

   var listaCuotas = [];
   var listaClientes = [];
   var listaPtmos = [];

   var tasaInts = 0;
   var tipoInts = 1;
   var numCuotas = 30;
   var monCuota = 0;
   var tipoCuota = '1';
   var montoPtmo = 0;


   var codUsuario = sessionStorage.getItem("COD_USUARIO");

   const $cbFondos = $('#cbFondos');
   const $cbUsuarios = $('#cbUsuarios');
   const $cbProductos = $('#cbProductos');
   const $cbForPago = $('#cbForPago');

   const $btnBuscaPtmo = $('#btnBuscaPtmo');
   const $btnBuscaCli = $('#btnBuscaCli');
   const $btnImprimir = $('#btnImprimir');

   const $txtNumPtmo = $('#txtNumPtmo');

   const $txtCodCli = $('#txtCodCli');
   const $txtNomCli = $('#txtNomCli');


   const $txtFecPtmo = $('#txtFecPtmo').val(obtieneFechaActual());

   const $txtMonPtmo = $('#txtMonPtmo').val('0');
   const $txtMonInts = $('#txtMonInts').val('0');
   const $txtMonTot = $('#txtMonTot').val('0');
   const $txtNumCuo = $('#txtNumCuo').val('0');
   const $txtMonCuo = $('#txtMonCuo').val('0');

   const $btnGuardar = $('#btnGuardar');
   const $btnAnular = $('#btnAnular');
   const $btnCancelar = $('#btnCancelar');
   const $btnNuevo = $('#btnNuevo');


   var $tblCuotas;



   ini_componentes();
   //llenaComboFondos();
   llenaComboUsuarios();
   llenaComboProductos();
   inactivaCampos();

   function ini_componentes() {


      $tblCuotas = $('#tblCuotas').DataTable({

         destroy: true,
         data: listaCuotas,
         columns: [
            {
               data: 'numCuota',
               className: 'dt-center',
               width: '10%'
            },
            {
               data: 'fecCuota',
               className: 'dt-center',
               width: '30%'

            },
            {
               data: 'monCuota',
               width: '30%',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false
            },

            {
               data: 'salPtmo',
               width: '30%',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false
            }

         ],

         ordering: false,
         language: lenguaje_data_table

      }); /// Fin de creacion de datatable

      $tblCuotas.clear().draw();

      $tblClientes = $('#tblClientes').DataTable({

         destroy: true,
         data: listaClientes,
         columns: [

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

      $tblClientes.clear().draw();


      $('#tblClientes').on('click', 'button.editar', function () {

         let fila = $tblClientes.row($(this).parents('tr')).index();

         $('#modBuscaCli').modal('hide');

         $txtCodCli.val(listaClientes[fila].codCliente);

         consultaCliente();


      }); // Fin de funcion boton editar numero table



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






      $txtFecPtmo.change(function (e) {

         calculaCuotas();
         $txtMonPtmo.focus();

         e.preventDefault();
      });



      $cbFondos.change(function () {

         $cbProductos.focus();

      });

      $cbUsuarios.change(function () {

         $cbFondos.focus();

      });

      $cbProductos.change(function () {

         if ($(":selected", $('#cbProductos')).val() > 0) {

            consultaProducto();

            $txtMonPtmo.focus();

         }


      });




      $btnBuscaCli.click(function (e) {
         llenaTablaClientes();
         e.preventDefault();
      })

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

            } else {

               nuevoPrestamo();

            }

            e.preventDefault();
         }
      });



      $txtCodCli.focus(function () {
         $(this).select();

      }).keydown(function (e) {
         let code = e.keyCode || e.which;
         if (code == 13 || code == 9) {

            if ($txtCodCli.val().length > 0) {

               consultaCliente();

            }

            e.preventDefault();
         }
      });

      $txtMonPtmo.focus(function () {
         $(this).select();

      }).keydown(function (e) {
         let code = e.keyCode || e.which;
         if (code == 13 || code == 9) {

            if ($txtMonPtmo.val().length > 0) {

               let x = Number.parseInt($(this).val());

               $(this).val(nf_entero.format(x));

               calculaCuotas();

               $btnGuardar.focus();


            }

            e.preventDefault();
         }
      });

      $btnNuevo.click(function (e) {

         nuevoPrestamo();

         e.preventDefault();
      });


      $btnGuardar.click(function (e) {

         guardaPrestamo();

         e.preventDefault();
      });


      $btnAnular.click(function (e) {



         Swal
            .fire({
               title: "Desea Eliminar el Movimiento?",              
               icon: 'warning',
               showCancelButton: true,
               confirmButtonText: "Sí, eliminar",
               cancelButtonText: "Cancelar",
            })
            .then(resultado => {
               if (resultado.value) {
               
                  anulaPrestamo();

               } else{

                  document.forms.regPtmo_form.reset();
                  $txtFecPtmo.val(obtieneFechaActual());
                  $txtMonPtmo.val('0');
                  $txtMonInts.val('0');
                  $txtMonTot.val('0');
                  $txtNumCuo.val('0');
                  $txtMonCuo.val('0');
                  $tblCuotas.clear().draw();
   
                  $("#cbUsuarios option[value='0']").attr("selected", true);
                  $("#cbFondos option[value='0']").attr("selected", true);
                  $("#cbProductos option[value='0']").attr("selected", true);
   
                  $("#cbForPago option[value='" + 1 + "']").attr("selected", true);   
                  $txtNumPtmo.focus();   

               }
            });



        /* Swal.fire({
            title: 'Desea anular el prestamo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
         }).then((result) => {
            if (result.isConfirmed) {
               console.log('Anulando el prestamo')

               anulaPrestamo();
            } else {
               document.forms.regPtmo_form.reset();
               $txtFecPtmo.val(obtieneFechaActual());
               $txtMonPtmo.val('0');
               $txtMonInts.val('0');
               $txtMonTot.val('0');
               $txtNumCuo.val('0');
               $txtMonCuo.val('0');
               $tblCuotas.clear().draw();

               $("#cbUsuarios option[value='0']").attr("selected", true);
               $("#cbFondos option[value='0']").attr("selected", true);
               $("#cbProductos option[value='0']").attr("selected", true);

               $("#cbForPago option[value='" + 1 + "']").attr("selected", true);

               $txtNumPtmo.focus();

            }


         })*/



         e.preventDefault();
      });

      $btnCancelar.click(function (e) {

         location.reload();

      });

      $btnImprimir.click(function (e) {

         console.log('Imprimiendo Prestamo')

      });




   }

   function inactivaCampos() {

      $txtCodCli.prop("disabled", true);
      $txtFecPtmo.prop("disabled", true);
      $cbFondos.prop("disabled", true);
      $cbUsuarios.prop("disabled", true);
      $cbProductos.prop("disabled", true);
      $txtMonPtmo.prop("disabled", true);
      $btnBuscaCli.prop("disabled", true);
      $btnGuardar.prop("disabled", true);
      $btnAnular.prop("disabled", true);
      $btnImprimir.prop("disabled", true);
   }

   function activaCampos() {

      $txtCodCli.prop("disabled", false);
      $cbFondos.prop("disabled", false);

      if (sessionStorage.getItem("TIPO_USUARIO") == 3) {
         $cbUsuarios.prop("disabled", false);
         $txtFecPtmo.prop("disabled", false);
      }

      $cbProductos.prop("disabled", false);
      $txtMonPtmo.prop("disabled", false);
      $btnBuscaCli.prop("disabled", false);

   }

   function nuevoPrestamo() {

      console.log('Registrando nuevo prestamo');

      nuevo = true;
      document.forms.regPtmo_form.reset();
      $txtFecPtmo.val(obtieneFechaActual());
      $txtMonPtmo.val('0');
      $txtMonInts.val('0');
      $txtMonTot.val('0');
      $txtNumCuo.val('0');
      $txtMonCuo.val('0');
      $tblCuotas.clear().draw();

      $("#cbUsuarios option[value='" + sessionStorage.getItem("COD_USUARIO") + "']").attr("selected", true);
      $("#cbForPago option[value='" + 1 + "']").attr("selected", true);

      $btnGuardar.prop("disabled", false);


      activaCampos();

      $txtCodCli.focus();

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

               if (sessionStorage.getItem("TIPO_USUARIO") != 3) {

                  $cbUsuarios.prop("disabled", true);
                  $txtFecPtmo.prop("disabled", true);

                  llenaComboFondosUsu();
               } else {

                  llenaComboFondos();
               }



            }
         },
         function (data) {
            $('#spinner').hide();
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         }
      );

   }


   function llenaComboProductos() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'lista_productos';

      $cbProductos.empty();

      $cbProductos.append($("<option>", {
         value: 0,
         text: 'Seleccione un Producto'
      }));

      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();

            if (data.resp != null) {

               let _productos = data.resp.productos;


               for (item in _productos) {

                  let _codProducto = _productos[item]['cod_ptmo'];
                  let _nomProducto = _productos[item]['nom_ptmo'];

                  $cbProductos.append($("<option>", {
                     value: _codProducto,
                     text: _nomProducto
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


   function llenaTablaClientes() {

      let req = [];
      req.w = 'apiPresto';
      req.r = 'listar_clientes';


      $tblClientes.clear().draw();


      api_postRequest(req,
         function (data) {
            console.log(data);

            if (data.resp != null) {

               let clientes = data.resp.clientes;

               listaClientes = [];

               for (let i = 0; i < clientes.length; i++) {
                  let cliente = new Object();
                  cliente.codCliente = clientes[i].cod_cliente;
                  cliente.nomCliente = clientes[i].ape_cliente + ", " + clientes[i].nom_cliente;

                  listaClientes.push(cliente);
               }

               $tblClientes.rows.add(listaClientes).draw();

            }

         }
         , function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });
   }



   function consultaCliente() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_cliente';
      req.cod_cliente = $txtCodCli.val();

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();

            if (data.resp == null) {

               $txtCodCli.focus();
               Swal.fire({ title: "Código Cliente NO Existe", icon: "error" });
               return;
            }

            let _nombre = data.resp.ape_cliente + ', ' + data.resp.nom_cliente;
            $txtNomCli.val(_nombre);

            $cbFondos.focus();


         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });
   }


   function consultaProducto() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_producto';
      req.cod_ptmo = $(":selected", $('#cbProductos')).val();

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();

            numCuotas = Number.parseInt(data.resp.num_cuotas);
            $txtNumCuo.val(data.resp.num_cuotas);

            tipoCuota = Number.parseInt(data.resp.tipo_cuota);
            //tipoCuota = data.resp.tipo_cuota;                

            $("#cbForPago option[value='" + tipoCuota + "']").attr("selected", true);

            tasaInts = Number.parseInt(data.resp.tasa_ints);
            tipoInts = Number.parseInt(data.resp.tipo_ints);

            calculaCuotas();

         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
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
      req.r = 'consulta_prestamo';
      req.num_ptmo = $txtNumPtmo.val();

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();

            console.log(data);

            if (data.resp == null) {
               $txtNumPtmo.focus();

               Swal.fire("Préstamo No Exite");

               //sweetAlert({ title: "Préstamo NO existe", type: "error" });
               return;
            }

            $txtCodCli.val(data.resp.cod_cliente);
            $txtNomCli.val(data.resp.nomCliente);
            $txtFecPtmo.val(data.resp.fecha_reg);

            $("#cbUsuarios option[value='" + data.resp.cod_usuario + "']").attr("selected", true);
            $("#cbFondos option[value='" + data.resp.cod_fondo + "']").attr("selected", true);
            $("#cbProductos option[value='" + data.resp.cod_ptmo + "']").attr("selected", true);

            let _montoPtmo = parseInt(data.resp.mon_ptmo);
            $txtMonPtmo.val(nf_entero.format(_montoPtmo));
            let _montoInts = parseInt(data.resp.mon_ints);
            $txtMonInts.val(nf_entero.format(_montoInts));
            let _montoTot = _montoPtmo + _montoInts;
            $txtMonTot.val(nf_entero.format(_montoTot));
            let saldo_ptmo = parseInt(data.resp.mon_saldo);

            let _numCuotas = parseInt(data.resp.num_cuotas);
            $txtNumCuo.val(nf_entero.format(_numCuotas));
            let _monCuota = parseInt(data.resp.mon_cuota);
            $txtMonCuo.val(nf_entero.format(_monCuota));
            $("#cbForPago option[value='" + data.resp.forma_pago + "']").attr("selected", true);

            let _cuotas = data.resp.cuotas;

            listaCuotas = [];
            $tblCuotas.clear().draw();

            let _saldoPtmo = _montoTot;

            for (let i = 0; i < _cuotas.length; i++) {
               let _cuota = new Object();
               _cuota.numCuota = _cuotas[i].num_cuota;

               let _fecha = _cuotas[i].fec_cuota;

               let a_fecha = _fecha.split('-');

               _cuota.fecCuota = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];

               //_cuota.fecCuota = _fecha;

               _cuota.monCuota = _saldoPtmo > _monCuota ? _monCuota : _saldoPtmo;

               _cuota.salPtmo = _saldoPtmo > _monCuota ? _saldoPtmo -= _monCuota : 0;

               listaCuotas.push(_cuota);
            }

            $tblCuotas.rows.add(listaCuotas).draw();


            if (saldo_ptmo == _montoTot && sessionStorage.getItem("TIPO_USUARIO") == 3) {

               $btnAnular.prop("disabled", false);
            }

            $btnImprimir.prop("disabled", false);
            $btnImprimir.focus();

         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });


   }


   function anulaPrestamo() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'anula_prestamo';
      req.num_ptmo = $txtNumPtmo.val();

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();

            document.forms.regPtmo_form.reset();
            $txtFecPtmo.val(obtieneFechaActual());
            $txtMonPtmo.val('0');
            $txtMonInts.val('0');
            $txtMonTot.val('0');
            $txtNumCuo.val('0');
            $txtMonCuo.val('0');
            $tblCuotas.clear().draw();
            $("#cbUsuarios option[value='0']").attr("selected", true);
            $("#cbFondos option[value='0']").attr("selected", true);
            $("#cbProductos option[value='0']").attr("selected", true);

            $("#cbForPago option[value='" + 1 + "']").attr("selected", true);
            $txtNumPtmo.focus();

            let msg = data.resp.msg;

            Swal.fire({ title: msg, icon: "success" });


         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });


   }


   function calculaCuotas() {

      montoPtmo = Number.parseInt($txtMonPtmo.val().replace(/,/g, ''));
      monInts = montoPtmo * tasaInts / 100;
      monTot = montoPtmo + monInts;
      monCuota = monTot > 0 ? Math.ceil(monTot / numCuotas) : 0;
      $txtMonCuo.val(nf_entero.format(monCuota));
      $txtMonInts.val(nf_entero.format(monInts));
      $txtMonTot.val(nf_entero.format(monTot));

      listaCuotas = [];
      $tblCuotas.clear().draw();

      if (montoPtmo > 0) {

         let a_fecha = $txtFecPtmo.val().split('-');
         let fechaCuota = new Date(parseInt(a_fecha[0]), parseInt(a_fecha[1] - 1), parseInt(a_fecha[2]));

         if ($(":selected", $('#cbForPago')).val() == '2' && fechaCuota.getDay() == 0) {
            fechaCuota = sumarDias(fechaCuota, 1);
         }

         let dias = $(":selected", $('#cbForPago')).val() == 1 ? 1 : 7;

         let _saldoPtmo = monTot;

         for (let i = 0; i < numCuotas; i++) {

            let cuota = new Object();
            cuota.numCuota = i + 1;

            fechaCuota = sumarDias(fechaCuota, dias);
            if (fechaCuota.getDay() == 0) {
               fechaCuota = sumarDias(fechaCuota, dias);
            }
            cuota.fecCuota = fechaCuota.toLocaleDateString('es');

            cuota.monCuota = _saldoPtmo > monCuota ? monCuota : _saldoPtmo;

            //_saldoCuota = _saldoCuota > _monCuota ? _saldoCuota -= _monCuota : 0;

            cuota.salPtmo = _saldoPtmo > monCuota ? _saldoPtmo -= monCuota : 0;

            listaCuotas.push(cuota);
         }

         $tblCuotas.rows.add(listaCuotas).draw();

      }


   }

   function guardaPrestamo() {

      if ($txtCodCli.val().length == 0 || $txtNomCli.val().length == 0) {
         $txtCodCli.focus();
         Swal.fire({ title: "Debe seleccionar un Cliente válido", icon: "error" });
         return;

      }
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
      if ($(":selected", $('#cbProductos')).val() == 0) {
         $cbProductos.focus();
         Swal.fire({ title: "Debe seleccionar un Tipo Prestamo", icon: "error" });
         return;
      }


      let _montoPtmo = Number.parseInt($txtMonPtmo.val().replace(/,/g, ''));
      if (_montoPtmo == 0) {
         $txtMonPtmo.focus();
         Swal.fire({ title: "Digite un monto de prestamo", icon: "error" });
         return;
      }

      calculaCuotas();

      let fecha = new Date();
      let hora = fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();


      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'agrega_prestamo';
      req.cod_cliente = $txtCodCli.val();
      req.cod_usuario = $(":selected", $('#cbUsuarios')).val();
      req.cod_fondo = $(":selected", $('#cbFondos')).val();
      req.cod_ptmo = $(":selected", $('#cbProductos')).val();
      req.fec_ptmo = $txtFecPtmo.val();
      req.hora_ptmo = hora;
      req.mon_ptmo = montoPtmo;
      req.tasa_ints = tasaInts;
      req.mon_ints = monInts;
      req.forma_pago = $(":selected", $('#cbForPago')).val();
      req.num_cuotas = numCuotas;
      req.mon_cuota = monCuota;
      req.listaCuotas = JSON.stringify(listaCuotas);

      api_postRequest(req,
         function (data) {
            $('#spinner').hide();

            console.log(data);

            $txtNumPtmo.val(data.resp.num_ptmo);
            let msg = data.resp.msg;

            inactivaCampos();
            //$txtNumPtmo.focus();            
            $btnImprimir.prop("disabled", false);
            $btnImprimir.focus();

            Swal.fire({ title: msg, icon: "success" });



         }, function (data) {
            Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
         });



   }


   function sumarDias(fecha, dias) {
      fecha.setDate(fecha.getDate() + dias);
      return fecha;
   }

});