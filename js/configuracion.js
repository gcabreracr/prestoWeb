$(function () {

    /** Procesos de carga de pagina */
    cargaDatosUsuario(); // Carga los datos del usuario en el Header la pagina
    //activaBotonMenu();

    //** Constantes y variables globales de la página */



    var $tituloTkt = $('#tituloTkt')
        .val(sessionStorage.getItem('TIT_TKT'))
        .focus(function () {
            $(this).select();
        }).keydown((e) => {
            let code = e.keyCode || e.which;
            if (code == 13) {
                $('#msgTkt').focus();
                e.preventDefault();
            }
        });

   
    let anchoTkt = sessionStorage.getItem('ANCHO_TKT');

    $("input[name=anchoTkt][value='" + anchoTkt + "']").prop("checked", true);


    $('#btnActualizar').click((e) => {

        actualizaConfiguracion();
        e.preventDefault();

    });


    function actualizaConfiguracion() {

        let titTkt = $tituloTkt.val();
        
        let anchoTkt = $("input[type=radio][name=anchoTkt]:checked").val();

        console.log(titTkt, anchoTkt)

        sessionStorage.setItem('TIT_TKT', titTkt);        
        sessionStorage.setItem('ANCHO_TKT', anchoTkt);


        let req = new Object();
        req.w = 'apiPresto';
        req.r = 'configura_tkt';
        req.cod_usuario = sessionStorage.getItem('COD_USUARIO');
        req.tit_tkt = titTkt;
        req.ancho_tkt = anchoTkt;

        fetch_postRequest(req,
            function (data) {

                console.log(data);

                let msg = data.resp;

                sweetAlert({ title: msg, type: "success" });

            });

    }

});