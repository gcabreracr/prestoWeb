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
               data: 'codFondo',
               className: 'dt-center',
               width: '10%'
            },
            {
               data: 'nomFondo',

            },
           
            {
               data: 'salFondo',
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
         listaSaldosCaja = [];

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


   function consultaSaldos() {

      return;


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
            console.log(data);

            if (data.resp != null) {


               let _movimientos = data.resp.movimientos;

               listaMovCaja = [];

               let _montoMov = 0;

               for (let i = 0; i < _movimientos.length; i++) {
                  let mov = new Object();
                  mov.numConse = _movimientos[i].num_conse;

                  let a_fecha = (_movimientos[i].fec_mov).split('-');
                  let fecha_liq = a_fecha[2] + '/' + a_fecha[1] + '/' + a_fecha[0];
                  mov.fecMov = fecha_liq;
                  //mov.fecMov = _movimientos[i].fec_mov;
                  mov.docRef = _movimientos[i].doc_refe;
                  mov.detMov = _movimientos[i].det_mov;

                  mov.monMov = Number.parseInt(_movimientos[i].mon_mov);
                  //mov.monMov = _movimientos[i].mon_mov;
                  _montoMov = _montoMov + Number.parseInt(_movimientos[i].mon_mov);

                  listaMovCaja.push(mov);
               }

               _saldoFin = _saldoIni + _montoMov;

               $txtSaldoIni.val(nf_entero.format(_saldoIni));
               $txtTotMov.val(nf_entero.format(_montoMov));
               $txtSaldoFin.val(nf_entero.format(_saldoFin));


               $tblMovCaja.rows.add(listaMovCaja).draw();
            }

         },
         function (data) {
            $('#spinner').hide();
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );
   }

});