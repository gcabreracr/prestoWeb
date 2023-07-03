$(function () {

   /** Procesos de carga de pagina */
   cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

   const $cbFondos = $('#cbFondos');

   const $txtAcuFondo = $('#txtAcuFondo').val('0');
   const $txtMonPtmos = $('#txtMonPtmos').val('0');
   const $txtEfeCajas = $('#txtEfeCajas').val('0');
   const $txtEfeFondo = $('#txtEfeFondo').val('0');

   ini_componentes();
   llenaComboFondos();

   function ini_componentes() {



      $cbFondos.change(function (e) {

         consultaEstado();

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
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );

   }


   function consultaEstado() {


      $('#spinner').show();

      let req = [];
      req.w = 'apiPresto';
      req.r = 'consulta_estado_fondo';
      req.cod_fondo = $(":selected", $('#cbFondos')).val();


      api_postRequest(
         req,
         function (data) {
            $('#spinner').hide();

            let _acumFondo = parseInt(data.resp.acum_fondo);
            let _monPtmos = parseInt(data.resp.saldo_ptmos);
            let _efeCajas = parseInt(data.resp.saldo_cajas);
            let _efeFondo = _acumFondo - _monPtmos - _efeCajas;

            $txtAcuFondo.val(nf_entero.format(_acumFondo));
            $txtMonPtmos.val(nf_entero.format(_monPtmos));
            $txtEfeCajas.val(nf_entero.format(_efeCajas));
            $txtEfeFondo.val(nf_entero.format(_efeFondo));

         },
         function (data) {
            $('#spinner').hide();
            sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
         }
      );
   }








});