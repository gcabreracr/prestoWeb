$(function () {

    $('#idUsuario').val('');
    $('#pinUsuario').val('');
    $('#codCliente').val('');


    if (localStorage.getItem("COD_CLIENTE")) {

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

                            let cod_usuario = data.resp.cod_usuario;
                            let nom_usuario = data.resp.nom_usuario;
                            let tipo_usuario = data.resp.tipo_usuario;
                            let est_usuario = data.resp.est_usuario;

                            if (est_usuario==0){
                                sweetAlert({ title: "Usuario INACTIVO", type: "error" });
                                return;

                            }
                            

                            switch (tipo_usuario) {
                                case '1':
                                    var titUsuario = 'Vendedor';
                                    break;
                                case '2':
                                    var titUsuario = 'ADM Fondo';
                                    break;
                                case '3':
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

                            localStorage.setItem("COD_CLIENTE", $('#codCliente').val());


                          

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