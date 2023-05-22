$(function () {

    $('#idUsuario').val('');
    $('#pinUsuario').val('');
    $('#codCliente').val('');


    if(localStorage.getItem("COD_CLIENTE")){

        $('#codCliente').val(localStorage.getItem("COD_CLIENTE"));

        $('#idUsuario').focus();
    }


  
    $('#btnIngresar').on('click', function (e) {
        e.preventDefault();
        loginUsuario();
    });


    function loginUsuario() {

        if ($('#codCliente').val().length == 0) {
            sweetAlert({ title: "Código de cliente es requerido", type: "error" });
            $('#codCliente').focus();
            return;
        }

        if ($('#idUsuario').val().length == 0) {
            sweetAlert({ title: "ID de usuario es requerido", type: "error" });
            $('#idUsuario').focus();
            return;
        }

        if ($('#pinUsuario').val().length == 0) {
            sweetAlert({ title: "Pin de Usuario es requerido", type: "error" });
            $('#pinUsuario').focus();
            return;
        }


        let carpeta = '../../../' + $('#codCliente').val() + '/';
        console.log(carpeta);
        checkFileExist(carpeta);

    }


    function checkFileExist(urlToFile) {
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', urlToFile, false);
        xhr.send();

        if (xhr.status == "404") {

            sweetAlert({ title: "Código cliente NO existe", type: "error" });
            $('#codCliente').focus();


        } else {


            let url = window.location.origin + '/' + $('#codCliente').val() + '/';
            console.log(url);
            sessionStorage.setItem("URL_API", url);
            checkUser();
        }
    }


    function checkUser() {
        var req = [];
        req.w = 'apiPresto';
        req.r = 'login_usuario';
        req.id_usuario = $('#idUsuario').val();
        //req.pin_pass = $('#pinUsuario').val();

        api_postRequest(req,
            function (data) {

                if (data.resp != null) {

                    if (data.resp.status_usu == 0) {
                        sweetAlert({ title: "Usuario Inactivo", type: "error" });

                    } else {

                        let pin = $('#pinUsuario').val();

                        if (pin != data.resp.pass_usu) {

                            sweetAlert({ title: "PIN Incorrecto", type: "error" });

                        } else {

                            var cod_usuario = data.resp.codigo_usu;
                            var nom_usuario = data.resp.nombre_usu;
                            var tipo_usuario = data.resp.tipo_usu;
                            var cod_pdv = data.resp.cod_pdv;
                            var nom_pdv = data.resp.nom_pdv;
                            var cod_agencia = data.resp.cod_agencia;
                            var nom_agencia = data.resp.nom_agencia;
                            var cod_bodega = data.resp.cod_bodega;


                            switch (tipo_usuario) {
                                case '1':
                                    var titUsuario = 'Vendedor';
                                    break;
                                case '2':               
                                    var titUsuario = 'ADM General';
                                    break;
                                default:
                                    var titUsuario = 'Indefinido';
                                    break;
                            }


                            sessionStorage.setItem("COD_USUARIO", cod_usuario);
                            sessionStorage.setItem("TIPO_USUARIO", tipo_usuario);
                            sessionStorage.setItem("TIT_USUARIO", titUsuario);
                            sessionStorage.setItem("NOM_USUARIO", nom_usuario);                           

                            localStorage.setItem("COD_CLIENTE",$('#codCliente').val());


                            //sessionStorage.setItem("NOM_IMP", nom_imp);
                            //sessionStorage.setItem("ANCHO_TKT", ancho_tkt);

                            iGoTo('./inicio.html');
                        }
                    }


                } else {
                    sweetAlert({ title: "Usuario NO encontrado", type: "error" });
                }

            },
            function (data) {
                sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
            }
        );
    }

});