$(function () {

    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina


    var nuevo = true;
    var idProvincia = 0;
    var idCanton = 0;
    var idDistrito = 0;
    var latitud = 0.00;
    var longitud = 0.00;
    var estado = 1;

    var listaClientes = [];

    const $txtCodCliente = $('#txtCodCliente');
    const $txtIdCliente = $('#txtIdCliente');

    const $txtNomCliente = $('#txtNomCliente');
    const $txtApeCliente = $('#txtApeCliente');

    const $cbProvincias = $('#cbProvincias');
    const $cbCantones = $('#cbCantones');
    const $cbDistritos = $('#cbDistritos');

    const $txtSennas = $('#txtSennas');

    var $tblClientes;

    const $btnBuscaCli = $('#btnBuscaCli').click(function (e) {
        e.preventDefault();
        llenaTablaClientes();

    });

    const $btnActualizar = $('#btnActualizar');
    const $btnCancelar = $('#btnCancelar');

    ini_componentes();
    limpiaCampos();
    inactivaCampos();

    function ini_componentes() {

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



        $txtCodCliente.focus(function () {
            $(this).select();
            inactivaCampos();

        }).keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                if ($txtCodCliente.val().length > 0) {

                    consultaCliente();

                } else {

                    nuevo = true;
                    longitud = 0.00;
                    latitud = 0.00;
                    estado = 1;
                    //limpiaCampos();
                    activaCampos();
                    $txtIdCliente.focus();


                }

                e.preventDefault();
            }
        });

        $txtIdCliente.focus(function () {
            $(this).select();

        }).keydown(function (e) {
            let code = e.keyCode || e.which;
            if (code == 13 || code == 9) {

                $txtNomCliente.focus();

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
            idProvincia = 0;
            idCanton = 0;
            idDistrito = 0;
            limpiaCampos();

            e.preventDefault();
        });


        $btnActualizar.click(function (e) {
            e.preventDefault();
            actualizaCliente();
        });

        $('#tblClientes').on('click', 'button.editar', function () {

            let fila = $tblClientes.row($(this).parents('tr')).index();

            $('#modBuscaCli').modal('hide');

            $txtCodCliente.val(listaClientes[fila].codCliente);

            consultaCliente();


        }); // Fin de funcion boton editar numero table



    }

    function limpiaCampos() {

        $txtCodCliente.val('');
        $txtIdCliente.val('');
        $txtNomCliente.val('');
        $txtApeCliente.val('');
        $txtSennas.val('');

        llenaComboProvincias();

    }


    function inactivaCampos() {

        $txtIdCliente.prop("disabled", true);
        $txtNomCliente.prop("disabled", true);
        $txtApeCliente.prop('disabled', true);
        $cbProvincias.prop('disabled', true);
        $cbCantones.prop('disabled', true);
        $cbDistritos.prop('disabled', true);
        $txtSennas.prop('disabled', true);
        $btnActualizar.prop('disabled', true);

    }

    function activaCampos() {

        $txtIdCliente.prop("disabled", false);
        $txtNomCliente.prop("disabled", false);
        $txtApeCliente.prop('disabled', false);
        $cbProvincias.prop('disabled', false);
        $cbCantones.prop('disabled', false);
        $cbDistritos.prop('disabled', false);
        $txtSennas.prop('disabled', false);
        $btnActualizar.prop('disabled', false);

    }


    function llenaComboProvincias() {

        $('#spinnerP').show();
        let req = [];
        req.w = 'apiPresto';
        req.r = 'llena_provincias';

        $('#cbProvincias').empty();

        api_postRequest(req,
            function (data) {
                $('#spinnerP').hide();

                if (data.resp != null) {
                    let provincias = data.resp.provincias;
                    for (item in provincias) {

                        let _idProvincia = provincias[item]['idProvincia'];
                        let _nomProvincia = provincias[item]['nomProvincia'];

                        $('#cbProvincias').append($("<option>", {
                            value: _idProvincia,
                            text: _nomProvincia
                        }));
                    }

                    $("#cbProvincias option[value='" + idProvincia + "']").attr("selected", true);

                    llenaComboCantones();

                }
            }, function (data) {
                Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
            });



    }

    function llenaComboCantones() {
        $('#spinnerC').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'llena_cantones';
        req.idProvincia = $(":selected", $('#cbProvincias')).val();

        $('#cbCantones').empty();

        api_postRequest(
            req,
            function (data) {
                $('#spinnerC').hide();

                if (data.resp != null) {
                    let cantones = data.resp.cantones;
                    for (item in cantones) {

                        let _idCanton = cantones[item]['idCanton'];
                        let _nomCanton = cantones[item]['nomCanton'];

                        $('#cbCantones').append($("<option>", {
                            value: _idCanton,
                            text: _nomCanton
                        }));
                    }

                    $("#cbCantones option[value='" + idCanton + "']").attr("selected", true);
                    llenaComboDistritos();
                }

            }, function (data) {
                Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
            });


    }

    function llenaComboDistritos() {

        $('#spinnerD').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'llena_distritos';
        req.idProvincia = $(":selected", $('#cbProvincias')).val();
        req.idCanton = $(":selected", $('#cbCantones')).val();


        $('#cbDistritos').empty();

        api_postRequest(req,
            function (data) {
                $('#spinnerD').hide();

                if (data.resp != null) {
                    let distritos = data.resp.distritos;
                    for (item in distritos) {

                        let _idDistrito = distritos[item]['idDistrito'];
                        let _nomDistrito = distritos[item]['nomDistrito'];

                        $('#cbDistritos').append($("<option>", {
                            value: _idDistrito,
                            text: _nomDistrito
                        }));
                    }

                    $("#cbDistritos option[value='" + idDistrito + "']").attr("selected", true);
                }
            }, function (data) {
                Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
            });


    }


    function consultaCliente() {

        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'consulta_cliente';
        req.cod_cliente = $txtCodCliente.val();
        //req.id_cliente = $txtCodCliente.val();

        api_postRequest(req,
            function (data) {
                $('#spinner').hide();

                if (data.resp == null) {

                    $txtCodCliente.focus();
                    Swal.fire({ title: "Código Cliente NO Existe", icon: "error" });
                    return;
                }

                nuevo = false;
                $txtIdCliente.val(data.resp.id_cliente);
                $txtNomCliente.val(data.resp.nom_cliente);
                $txtApeCliente.val(data.resp.ape_cliente);
                $txtSennas.val(data.resp.sennas);
                idProvincia = data.resp.idProvincia;
                idCanton = data.resp.idCanton;
                idDistrito = data.resp.idDistrito;
                latitud = data.resp.latitud;
                longitud = data.resp.longitud;
                estado = data.resp.est_cliente;
                activaCampos();
                $txtIdCliente.focus();

                llenaComboProvincias();


            }, function (data) {
                Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
            });
    }


    function actualizaCliente() {

        if ($txtNomCliente.val().length == 0) {

            $txtNomCliente.focus();
            Swal.fire({ title: "Campo de nombre es requerido", icon: "error" });
            return;
        }

        if ($txtApeCliente.val().length == 0) {

            $txtApeCliente.focus();
            Swal.fire({ title: "Campo de apellidos es requerido", icon: "error" });
            return;

        }

        if ($(":selected", $('#cbProvincias')).val() == 0) {

            $cbProvincias.focus();
            Swal.fire({ title: "Seleccione una provincia válida", icon: "error" });
            return;

        }
        if ($(":selected", $('#cbCantones')).val() == 0) {

            $cbCantones.focus();
            Swal.fire({ title: "Seleccione un cantón válido", icon: "error" });
            return;

        }
        if ($(":selected", $('#cbDistritos')).val() == 0) {

            $cbDistritos.focus();
            Swal.fire({ title: "Seleccione un distrito válido", icon: "error" });
            return;

        }


        if ($txtSennas.val().length == 0) {

            $txtSennas.focus();
            Swal.fire({ title: "Campo de otras señas es requerido", icon: "error" });
            return;

        }


        $('#spinner').show();

        let req = [];
        req.w = 'apiPresto';
        req.r = 'actualiza_cliente';

        req.nuevo = nuevo;
        req.cod_cliente = $txtCodCliente.val();
        req.id_cliente = $txtIdCliente.val();
        req.nom_cliente = $txtNomCliente.val();
        req.ape_cliente = $txtApeCliente.val();
        req.idProvincia = $(":selected", $('#cbProvincias')).val();
        req.provincia = $(":selected", $('#cbProvincias')).text();
        req.idCanton = $(":selected", $('#cbCantones')).val();
        req.canton = $(":selected", $('#cbCantones')).text();
        req.idDistrito = $(":selected", $('#cbDistritos')).val();
        req.distrito = $(":selected", $('#cbDistritos')).text();
        req.sennas = $txtSennas.val();
        req.latitud = latitud;
        req.longitud = longitud;
        req.est_cliente = estado;

        api_postRequest(
            req,
            function (data) {
                $('#spinner').hide();

                let msg = data.resp.msg;
                $txtCodCliente.focus();
                idProvincia = 0;
                idCanton = 0;
                idDistrito = 0;
                limpiaCampos();

                //Swal.fire({ title: _msg, icon: "success" });
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: msg,
                    showConfirmButton: false,
                    timer: 1500
                  })



            }, function (data) {
                $('#spinner').hide();

                Swal.fire({ title: "Error en la respuesta del servidor", icon: "error" });
            });

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





});