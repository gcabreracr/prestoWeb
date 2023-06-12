$(function () {

    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

    //activaMenu();

    const $txtCodUsuario = $('#txtCodUsuario');
    const $txtNomUsuario = $('#txtNomUsuario');
    

    const $cbTipoUsu = $('#cbTipoUsu');
    const $cbEstadoUsu = $('#cbEstadoUsu'); 


    const $btnBuscaUsu = $('#btnBuscaUsu').click(function (e) {
        e.preventDefault();
    });

    const $btnActualizar = $('#btnActualizar');
    const $btnCancelar = $('#btnCancelar');

    ini_componentes();
    limpiaCampos();
    inactivaCampos();


    function ini_componentes() {

        $txtCodUsuario.focus(function () {
            $(this).select();
            inactivaCampos();

        }).keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                if ($txtCodUsuario.val().length > 0) {

                    console.log('Consultando Usuario')

                    activaCampos();

                    $txtNomUsuario.focus();


                }

                e.preventDefault();
            }
        });

        $txtNomUsuario.focus(function () {
            $(this).select();
        }).keydown(function (e) {

            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                $cbTipoUsu.focus();

                e.preventDefault();
            }

        });

       

        $cbTipoUsu.change(function () {

           

        });

        $cbEstadoUsu.change(function () {

           

        });

        $btnCancelar.click(function (e) {

            $txtCodUsuario.val('');
            $txtCodUsuario.focus();
            limpiaCampos();

            e.preventDefault();
        });


        $btnActualizar.click(function (e) {


            e.preventDefault();
        });




    }

    function limpiaCampos() {

        
        $txtNomUsuario.val('');      
        

    }


    function inactivaCampos() {
        //$txtNomCliente.attr('disabled','disabled');
        $txtNomUsuario.prop("disabled", true);        
        $cbTipoUsu.prop('disabled', true);
        $cbEstadoUsu.prop('disabled', true);        
        $btnActualizar.prop('disabled', true);

    }

    function activaCampos() {
        $txtNomUsuario.prop("disabled", false);       
        $cbTipoUsu.prop('disabled', false);
        $cbEstadoUsu.prop('disabled', false);
        
        $btnActualizar.prop('disabled', false);

    }


    

   


    function consultaUsuario() {

        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'consulta_cliente';
        req.cod



        let codCliente = $txtCodCliente.val();





    }




});