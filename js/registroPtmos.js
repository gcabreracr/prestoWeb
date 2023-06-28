$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

   var listaCuotas = [];
   var listaClientes = [];
   var listaPtmos = [];

   var tasaInts = 0;
   var tipoInts = 1;
   var numCuotas = 30;
   var tipoCuota = 1;
   var montoPtmo = 0;


   var codUsuario = sessionStorage.getItem("COD_USUARIO");

   const $cbFondos = $('#cbFondos');
   const $cbUsuarios = $('#cbUsuarios');
   const $cbProductos = $('#cbProductos');
   const $cbForPago = $('#cbForPago');

   const $btnBuscaPtmo = $('#btnBuscaPtmo');
   const $btnBuscaCli = $('#btnBuscaCli');

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


   var $tblCuotas;



   ini_componentes();
   llenaComboFondos();
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



      $cbFondos.change(function () {

         $cbProductos.focus();

      });

      $cbUsuarios.change(function () {

         $cbFondos.focus();

      });

      $cbProductos.change(function () {

         consultaProducto();

         $txtMonPtmo.focus();

      });




      $btnBuscaCli.click(function (e) {
         llenaTablaClientes();
         e.preventDefault();
      })

      $btnBuscaPtmo.click(function (e) {

         e.preventDefault();
      })

      $txtNumPtmo.focus(function () {
         $(this).select();
         inactivaCampos();

      }).keydown(function (e) {
         let code = e.keyCode || e.which;
         if (code == 13 || code == 9) {

            if ($txtNumPtmo.val().length > 0) {

               consultaPrestamo();

            } else {

               nuevo = true;

               activaCampos();
               $txtCodCli.val('');
               $txtNomCli.val('');
               $txtFecPtmo.val(obtieneFechaActual());
               $txtMonPtmo.val('0');
               $txtMonInts.val('0');
               $txtMonTot.val('0');
               $txtNumCuo.val('0');
               $txtMonCuo.val('0');
               $("#cbUsuarios option[value='" + codUsuario + "']").attr("selected", true);
               $("#cbFonfos option[value=0]").attr("selected", true);
               $("#cbProductos option[value=0]").attr("selected", true);
               $("#cbForPago option[value=1]").attr("selected", true);

               $txtCodCli.focus();
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
       

            }

            e.preventDefault();
         }
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

   }

   function activaCampos() {

      $txtCodCli.prop("disabled", false);
      $txtFecPtmo.prop("disabled", false);
      $cbFondos.prop("disabled", false);
      $cbUsuarios.prop("disabled", false);
      $cbProductos.prop("disabled", false);
      $txtMonPtmo.prop("disabled", false);
      $btnBuscaCli.prop("disabled", false);

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
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
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
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
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
               sweetAlert({ title: "Código Cliente NO Existe", type: "error" });
               return;
            }

            let _nombre = data.resp.ape_cliente + ', ' + data.resp.nom_cliente;
            $txtNomCli.val(_nombre);

            $cbFondos.focus();



         }, function (data) {
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
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
            $("#cbForPago option[value='" + tipoCuota + "']").attr("selected", true);
            tasaInts = Number.parseInt(data.resp.tasa_ints);
            tipoInts = Number.parseInt(data.resp.tipo_ints);

            calculaCuotas();

         }, function (data) {
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         });


   }

   function calculaCuotas() {

      let _montoPtmo = Number.parseInt($txtMonPtmo.val().replace(/,/g, ''));
      let _monInts = _montoPtmo * tasaInts / 100;
      let _monTot = _montoPtmo + _monInts;
      let _monCuota = _monTot > 0 ? Math.round(_monTot / numCuotas) : 0;
      $txtMonCuo.val(nf_entero.format(_monCuota));
      $txtMonInts.val(nf_entero.format(_monInts));
      $txtMonTot.val(nf_entero.format(_monTot));


   }



});