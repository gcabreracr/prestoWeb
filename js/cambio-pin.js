$(function () {

    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    //activaBotonMenu();

    //** Constantes y variables globales de la página */

    $('#idPerfil').val(sessionStorage.getItem('COD_USUARIO'));
    $('#nomUsuPerfil').val(sessionStorage.getItem('NOM_USUARIO'));


    const $pinActual = $('#pinActual').val('');

    const $pinNuevo = $('#pinNuevo').val('');


    const $pinNuevoConf = $('#pinNuevoConf').val('');

    $('#btnCambiar').click((e) => {
        e.preventDefault();
        cambiaPin();

    });


    function cambiaPin() {

        let pinActual = $pinActual.val();
        let pinNuevo = $pinNuevo.val();
        let pinNuevoConf = $pinNuevoConf.val();

        if (pinNuevo.length < 4) {
            $pinNuevo.focus();
            sweetAlert({ title: "El PIN nuevo debe tener de 4-8 digitos", type: "error" });           
            return;
        }


        if (pinNuevo != pinNuevoConf) {
            $pinNuevoConf.focus();
            sweetAlert({ title: "Error al validar el nuevo pin. Campos NO son iguales", type: "error" });          
            return;
        }


        let req = new Object();
        req.w = "apiPresto";
        req.r = "cambia_pin";
        req.cod_usuario = sessionStorage.getItem('COD_USUARIO');
        req.pin_actual = pinActual;
        req.nuevopin = pinNuevo;

        fetch_postRequest(req, function (data) {
           
            if (data.resp.estadoRes == 0) {
                let msg = data.resp.msg;
                sweetAlert({ title: msg, type: "error" });

            } else {
                let msg = data.resp.msg;
               
                $pinActual.val('');
                $pinNuevo.val('');
                $pinNuevoConf.val('');
                $pinActual.focus();
                sweetAlert({ title: msg, type: "success" });
            }


        });


    }


});