$(function () {

    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina

    var nuevo = true;
    var listaFondosUsu = [];
    var listaFondos = [];
    var listaUsuarios = [];

    const $txtCodUsuario = $('#txtCodUsuario');
    const $txtNomUsuario = $('#txtNomUsuario');


    const $cbTipoUsu = $('#cbTipoUsu');
    const $cbEstadoUsu = $('#cbEstadoUsu');


    const $btnBuscaUsu = $('#btnBuscaUsu').click(function (e) {
        e.preventDefault();
        llenaTablaUsuarios();
    });

    const $btnActualizar = $('#btnActualizar');
    const $btnCancelar = $('#btnCancelar');

    const $btnAgregaFondo = $('#btnBuscaFondo').click(function (e) {

        e.preventDefault();

        llenaTablaFondos();

    });

    var $tblFondosUsu;
    var $tblFondos;
    var $tblUsuarios;

    ini_componentes();
    limpiaCampos();
    inactivaCampos();


    function ini_componentes() {

        $tblFondosUsu = $('#tblFondosUsu').DataTable({

            destroy: true,
            data: listaFondosUsu,
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
                    defaultContent: '<button class="eliminar btn btn-danger"><i class="bi bi-trash"></i></button>',
                    className: 'dt-right',
                    width: '10%'


                }

            ],

            ordering: false,
            language: lenguaje_data_table

        }); /// Fin de creacion de datatable

        $tblFondosUsu.clear().draw();

        $('#tblFondosUsu').on('click', 'button.eliminar', function () {

            let fila = $tblFondosUsu.row($(this).parents('tr')).index();

            //$('#modBuscaUsu').modal('hide');

            let _codFondo = listaFondosUsu[fila].codFondo;


            eliminaFondoUsu(_codFondo);


        }); // Fin de funcion boton editar numero table




        $tblUsuarios = $('#tblUsuarios').DataTable({

            destroy: true,
            data: listaUsuarios,
            columns: [

                {
                    data: 'nomUsu',

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

        $tblUsuarios.clear().draw();

        $('#tblUsuarios').on('click', 'button.editar', function () {

            let fila = $tblUsuarios.row($(this).parents('tr')).index();

            $('#modBuscaUsu').modal('hide');

            $txtCodUsuario.val(listaUsuarios[fila].codUsu);

            consultaUsuario();


        }); // Fin de funcion boton editar numero table



        $tblFondos = $('#tblFondos').DataTable({

            destroy: true,
            data: listaFondos,
            columns: [

                {
                    data: 'nomFondo',

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

        $tblFondos.clear().draw();

        $('#tblFondos').on('click', 'button.editar', function () {

            let fila = $tblFondos.row($(this).parents('tr')).index();

            $('#modBuscaFondo').modal('hide');

            let _codFondo = listaFondos[fila].codFondo;

            agregaFondoUsuario(_codFondo);


        }); // Fin de funcion boton editar numero table



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
            $tblFondosUsu.clear().draw();

            e.preventDefault();
        });


        $btnActualizar.click(function (e) {


            actualizaUsuario();

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
        $btnAgregaFondo.prop('disabled', true);


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
                    $btnAgregaFondo.prop('disabled', false);
                    $("#cbTipoUsu option[value='" + _tipoUsu + "']").attr("selected", true);
                    $("#cbEstadoUsu option[value='" + _estUsu + "']").attr("selected", true);
                    nuevo = false;

                } else {
                    limpiaCampos();
                    nuevo = true;
                }


                llenaTablaFondosUsu();
                activaCampos();
                $txtNomUsuario.focus();


            },
            function (data) {
                $('#spinner').hide();
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            });


    }


    function llenaTablaFondosUsu() {

        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'lista_fondos_usu';
        req.cod_usuario = $txtCodUsuario.val();

        $tblFondosUsu.clear().draw();

        api_postRequest(
            req,
            function (data) {
                $('#spinner').hide();

                if (data.resp != null) {

                    let _fondosUsu = data.resp.fondosUsu;

                    listaFondosUsu = [];

                    for (let i = 0; i < _fondosUsu.length; i++) {
                        let fondo = new Object();
                        fondo.codFondo = _fondosUsu[i].cod_fondo;
                        fondo.nomFondo = _fondosUsu[i].nom_fondo;

                        listaFondosUsu.push(fondo);
                    }

                    $tblFondosUsu.rows.add(listaFondosUsu).draw();
                }

            },
            function (data) {
                $('#spinner').hide();
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            }
        );

    }

    function llenaTablaUsuarios() {

        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'lista_usuarios';
        $tblUsuarios.clear().draw();

        api_postRequest(
            req,
            function (data) {
                $('#spinner').hide();

                if (data.resp != null) {

                    let _usuarios = data.resp.listaUsu;

                    listaUsuarios = [];

                    for (let i = 0; i < _usuarios.length; i++) {
                        let usu = new Object();
                        usu.codUsu = _usuarios[i].cod_usuario;
                        usu.nomUsu = _usuarios[i].nom_usuario;

                        listaUsuarios.push(usu);
                    }

                    $tblUsuarios.rows.add(listaUsuarios).draw();
                }
            },
            function (data) {
                $('#spinner').hide();
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            }
        );

    }



    function llenaTablaFondos() {

        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'lista_fondos';
        $tblFondos.clear().draw();

        api_postRequest(
            req,
            function (data) {
                $('#spinner').hide();

                if (data.resp != null) {

                    let _listaFondos = data.resp.listaFondos;

                    listaFondos = [];

                    for (let i = 0; i < _listaFondos.length; i++) {
                        let fondo = new Object();
                        fondo.codFondo = _listaFondos[i].cod_fondo;
                        fondo.nomFondo = _listaFondos[i].nom_fondo;

                        listaFondos.push(fondo);
                    }

                    $tblFondos.rows.add(listaFondos).draw();
                }
            },
            function (data) {
                $('#spinner').hide();
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            }
        );

    }

    function agregaFondoUsuario(_codFondo) {

        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'agrega_fondo_usu';
        req.cod_usuario = $txtCodUsuario.val();
        req.cod_fondo = _codFondo;


        api_postRequest(
            req,
            function (data) {
                $('#spinner').hide();

                if (data.resp.estadoResp == 0) {

                    let _msg = data.resp.msg;
                    sweetAlert({ title: _msg, type: "error" });

                } else {

                    let _msg = data.resp.msg;
                    sweetAlert({ title: _msg, type: "success" });

                    llenaTablaFondosUsu();

                }


            },
            function (data) {
                $('#spinner').hide();
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            }
        );

    }


    function eliminaFondoUsu(_codFondo) {


        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'elimina_fondo_usu';
        req.cod_usuario = $txtCodUsuario.val();
        req.cod_fondo = _codFondo;


        api_postRequest(
            req,
            function (data) {
                $('#spinner').hide();

                if (data.resp.estadoResp == 0) {

                    let _msg = data.resp.msg;
                    sweetAlert({ title: _msg, type: "error" });

                } else {

                    let _msg = data.resp.msg;
                    sweetAlert({ title: _msg, type: "success" });

                    llenaTablaFondosUsu();

                }


            },
            function (data) {
                $('#spinner').hide();
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            }
        );

    }


    function actualizaUsuario() {

        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'actualiza_usuario';
        req.nuevo = nuevo;
        req.cod_usuario = $txtCodUsuario.val();
        req.nom_usuario = $txtNomUsuario.val();
        req.tipo_usuario = $(":selected", $('#cbTipoUsu')).val();
        req.est_usuario = $(":selected", $('#cbEstadoUsu')).val();


        api_postRequest(
            req,
            function (data) {
                $('#spinner').hide();

                $btnAgregaFondo.prop('disabled', false);

                let _msg = data.resp.msg;
                sweetAlert({ title: _msg, type: "success" });


            },
            function (data) {
                $('#spinner').hide();
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            }
        );




    }



});