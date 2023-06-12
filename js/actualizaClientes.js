$(function () {

    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

    //activaMenu();

    const $txtCodCliente = $('#txtCodCliente');
    const $txtNomCliente = $('#txtNomCliente');
    const $txtApeCliente = $('#txtApeCliente');

    const $cbProvincias = $('#cbProvincias');
    const $cbCantones = $('#cbCantones');
    const $cbDistritos = $('#cbDistritos');

    const $txtSennas = $('#txtSennas');


    const $btnBuscaCli = $('#btnBuscaCli').click(function (e) {
        e.preventDefault();
    });

    const $btnActualizar = $('#btnActualizar');
    const $btnCancelar = $('#btnCancelar');

    ini_componentes();
    limpiaCampos();
    inactivaCampos();


    function ini_componentes() {

        $txtCodCliente.focus(function () {
            $(this).select();
            inactivaCampos();

        }).keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                if ($txtCodCliente.val().length > 0) {

                    console.log('Consultando Cliente')

                    activaCampos();

                    $txtNomCliente.focus();


                }

                e.preventDefault();
            }
        });

        $txtNomCliente.focus(function () {
            $(this).select();
        }).keydown(function (e) {

            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                $txtApeCliente.focus();

                e.preventDefault();
            }

        });

        $txtApeCliente.focus(function () {
            $(this).select();
        }).keydown(function (e) {

            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                $cbProvincias.focus();

                e.preventDefault();
            }

        });

        $txtSennas.focus(function () {
            $(this).select();
        }).keydown(function (e) {

            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                $btnActualizar.focus();

                e.preventDefault();
            }

        });

        $cbProvincias.change(function () {

            llenaComboCantones();


        });

        $cbCantones.change(function () {

            llenaComboDistritos();


        });

        $btnCancelar.click(function (e) {

            $txtCodCliente.val('');
            $txtCodCliente.focus();
            limpiaCampos();

            e.preventDefault();
        });


        $btnActualizar.click(function (e) {


            e.preventDefault();
        });




    }

    function limpiaCampos() {

        $txtCodCliente.val('');
        $txtNomCliente.val('');
        $txtApeCliente.val('');
        $txtSennas.val('');

        llenaComboProvincias();

    }


    function inactivaCampos() {
        //$txtNomCliente.attr('disabled','disabled');
        $txtNomCliente.prop("disabled", true);
        $txtApeCliente.prop('disabled', true);
        $cbProvincias.prop('disabled', true);
        $cbCantones.prop('disabled', true);
        $cbDistritos.prop('disabled', true);
        $txtSennas.prop('disabled', true);
        $btnActualizar.prop('disabled', true);

    }

    function activaCampos() {
        $txtNomCliente.prop("disabled", false);
        $txtApeCliente.prop('disabled', false);
        $cbProvincias.prop('disabled', false);
        $cbCantones.prop('disabled', false);
        $cbDistritos.prop('disabled', false);
        $txtSennas.prop('disabled', false);
        $btnActualizar.prop('disabled', false);

    }


    function llenaComboProvincias() {

        $('#spinner').show();
        let req = [];
        req.w = 'apiPresto';
        req.r = 'llena_provincias';

        $('#cbProvincias').empty();

        api_postRequest(req,
            function (data) {
                $('#spinner').hide();

                if (data.resp != null) {
                    let provincias = data.resp.provincias;
                    for (item in provincias) {

                        let idProvincia = provincias[item]['idProvincia'];
                        let nomProvincia = provincias[item]['nomProvincia'];

                        $('#cbProvincias').append($("<option>", {
                            value: idProvincia,
                            text: nomProvincia
                        }));
                    }
                }
            }, function (data) {
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            });

        llenaComboCantones();


    }

    function llenaComboCantones() {
        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'llena_cantones';
        req.idProvincia = $(":selected", $('#cbProvincias')).val();

        $('#cbCantones').empty();

        api_postRequest(req,
            function (data) {
                $('#spinner').hide();

                if (data.resp != null) {
                    let cantones = data.resp.cantones;
                    for (item in cantones) {

                        let idCanton = cantones[item]['idCanton'];
                        let nomCanton = cantones[item]['nomCanton'];

                        $('#cbCantones').append($("<option>", {
                            value: idCanton,
                            text: nomCanton
                        }));
                    }
                }
            }, function (data) {
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            });





        llenaComboDistritos();

    }

    function llenaComboDistritos() {

        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'llena_distritos';
        req.idProvincia = $(":selected", $('#cbProvincias')).val();
        req.idCanton = $(":selected", $('#cbCantones')).val();


        $('#cbDistritos').empty();

        api_postRequest(req,
            function (data) {
                $('#spinner').hide();

                if (data.resp != null) {
                    let distritos = data.resp.distritos;
                    for (item in distritos) {

                        let idDistrito = distritos[item]['idDistrito'];
                        let nomDistrito = distritos[item]['nomDistrito'];

                        $('#cbDistritos').append($("<option>", {
                            value: idDistrito,
                            text: nomDistrito
                        }));
                    }
                }
            }, function (data) {
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            });


    }


    function consultaCliente() {

        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'consulta_cliente';
        req.cod



        let codCliente = $txtCodCliente.val();





    }




});