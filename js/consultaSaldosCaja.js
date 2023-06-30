$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

   var listaSaldosCaja = [];


   const $cbUsuarios = $('#cbUsuarios');

   const $txtSaldoTot = $('#txtSaldoTot').val('0');


   var $tblSaldosCaja;
   ini_componentes();
   llenaComboUsuarios();

  
   function ini_componentes() {


      $tblSaldosCaja = $('#tblSaldosCaja').DataTable({

         destroy: true,
         data: listaSaldosCaja,
         columns: [
            {
               data: 'codigo',
               className: 'dt-center',
               width: '10%'
            },
            {
               data: 'nombre',

            },

            {
               data: 'saldo',
               width: '20%',
               className: 'dt-right',
               render: DataTable.render.number(',', '.'),
               searchable: false
            }

         ],

         ordering: false,
         language: lenguaje_data_table

      }); /// Fin de creacion de datatable

      $tblSaldosCaja.clear().draw();




      $cbUsuarios.change(function () {

         $tblSaldosCaja.clear().draw();
         //listaSaldosCaja = [];
         $txtSaldoTot.val('0');

         let _codUsuario = $(":selected", $('#cbUsuarios')).val();

         if (_codUsuario == 0) {

            $cbUsuarios.focus();
            sweetAlert({ title: "Debe seleccionar un usuario", type: "error" });
            return;
         }

         consultaSaldos();

      });

   }


   function llenaComboUsuarios() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'lista_usuarios';

      $cbUsuarios.empty();

      /*$cbUsuarios.append($("<option>", {
         value: 0,
         text: 'Seleccione un Usuario'
      }));*/

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
              
               if (sessionStorage.getItem("TIPO_USUARIO") == 3) {
                  $cbUsuarios.prop("disabled", false);
               } else {
                  $cbUsuarios.prop("disabled", true);
               }
            
               consultaSaldos();
            

            }
         },
         function (data) {
            $('#spinner').hide();
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );

   }


   function consultaSaldos() {

      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_saldos_caja';
      req.cod_usuario = $(":selected", $('#cbUsuarios')).val();


      $tblSaldosCaja.clear().draw();

      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();
            //console.log(data);

            let _saldoTotal = 0;
            listaSaldosCaja = [];

            if (data.resp != null) {

               let _saldos = data.resp.saldos;

               for (let i = 0; i < _saldos.length; i++) {

                  let fondo = new Object();

                  fondo.codigo = _saldos[i].cod_fondo;
                  fondo.nombre = _saldos[i].nom_fondo;

                  let _saldo = Number.parseInt(_saldos[i].saldo);
                  fondo.saldo = _saldo;

                  _saldoTotal += _saldo;

                  listaSaldosCaja.push(fondo);
               }

            }

            $tblSaldosCaja.rows.add(listaSaldosCaja).draw();

            $txtSaldoTot.val(nf_entero.format(_saldoTotal));

         },
         function (data) {
            $('#spinner').hide();
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );
   }

});