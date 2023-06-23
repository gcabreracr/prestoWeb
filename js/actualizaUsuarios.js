$(function () {

    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

    var nuevo = true;

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

                    consultaUsuario();



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
        $("#cbTipoUsu option[value=1]").attr("selected", true);
        $("#cbEstadoUsu option[value=1]").attr("selected", true);


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

        console.log('Consultando Usuario')

        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'consulta_usuario';
        req.id_usuario = $txtCodUsuario.val();

        api_postRequest(
            req,
            function (data) {
                $('#spinner').hide();

                if (data.resp != null) {
                    let _nomUsu = data.resp.nom_usuario;
                    let _tipoUsu = data.resp.tipo_usuario;
                    let _estUsu = data.resp.est_usuario;
                    $txtNomUsuario.val(_nomUsu);

                    $("#cbTipoUsu option[value='" + _tipoUsu + "']").attr("selected", true);
                    $("#cbEstadoUsu option[value='" + _estUsu + "']").attr("selected", true);

                } else {
                    limpiaCampos();
                }

                activaCampos();

                $txtNomUsuario.focus();


            },
            function (data) {
                $('#spinner').hide();
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            });


    }




});