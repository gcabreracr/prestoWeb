// Constantes Globales
const nf_entero = new Intl.NumberFormat('en'); // Formato entero

const nf_decimal = new Intl.NumberFormat('en', {
  style: "decimal",
  minimumFractionDigits: 2
});


const pattern_entero = /^-?\d*(\.\d+)?$/;
const pattern_numero = /^\d*\.\d+$/;

const lenguaje_data_table = {
  decimal: '.',
  emptyTable: 'No hay información',
  info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
  infoEmpty: 'Mostrando 0 to 0 of 0 registros',
  infoFiltered: '(Filtrado de _MAX_ total registros)',
  infoPostFix: '',
  thousands: ',',
  lengthMenu: 'Mostrar _MENU_ registros',
  loadingRecords: 'Cargando...',
  processing: 'Procesando...',
  search: 'Buscar:',
  zeroRecords: 'Sin resultados encontrados',
  paginate: {
    first: 'Primero',
    last: 'Ultimo',
    next: 'Siguiente',
    previous: 'Anterior'
  }
}

function activaBotonMenu() {

  /**
* Sidebar toggle
*/
  $('.toggle-sidebar-btn').click(function (e) {

    document.querySelector('body').classList.toggle('toggle-sidebar');
  });


}


/*--
Funcion para agregar el header 
--*/
function addHeader() {

  $('#header').load('./templates/header.html');

}



// Obtiene el idUsuario en sessionStorage
function getDatosSessionUsu() {

  let usuario = [];
  //usuario.idUsu = sessionStorage.getItem('ID_USUARIO');
  usuario.codUsu = sessionStorage.getItem('COD_USUARIO');
  usuario.nomUsu = sessionStorage.getItem('NOM_USUARIO');
  usuario.tipoUsu = sessionStorage.getItem('TIPO_USUARIO');
  usuario.codSuc = sessionStorage.getItem('COD_PDV');
  usuario.titUsu = sessionStorage.getItem('TIT_USUARIO');

  return usuario;
}

/*** Carga los datos del usuario en el Header de la pagina */

function cargaDatosUsuario() {

  let usuSession = getDatosSessionUsu();

  $('#nomUsuDrop span').text(usuSession.codUsu);
  $('#mnUsuario h6').text(usuSession.nomUsu);
  $('#mnUsuario span').text(usuSession.titUsu);
}

/** Funcion para verificar inicio de sesion del usuario */
function checkInicioSesion() {

  if (!sessionStorage.getItem("COD_USUARIO")) {

    window.location.href = './login.html';
  }
}

/** Funcion para obtener la fecha actual */
function obtieneFechaActual() {

  let fecha = new Date();
  let dia = fecha.getDate() > 9 ? fecha.getDate() : "0" + fecha.getDate();
  let mes = (fecha.getMonth + 1) > 9 ? fecha.getMonth() + 1 : "0" + (fecha.getMonth() + 1);
  let anio = fecha.getFullYear();

  var fechaInput = anio + "-" + mes + "-" + dia;

  return fechaInput;
}

function obtenerHoraActual() {
  let myDate = new Date();
  let hours = myDate.getHours();
  let minutes = myDate.getMinutes();
  let seconds = myDate.getSeconds();
  if (hours < 10) hours = 0 + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  let horaActual = hours + ":" + minutes + ":" + seconds;
  return horaActual;

}



/**********************************************/
/* Function para hacer request POST           */
/* Req request data, func success, func error */
/**********************************************/
async function api_postRequest(req, success, error, timeout = 30000, times = 0) {

  /*generate the form*/
  var _data = new FormData();
  for (var key in req) {
    var value = req[key];

    _data.append(key, value);
  }

  const api_url = sessionStorage.getItem('URL_API') + 'api.php';

  console.log(api_url);

  var oReq = new XMLHttpRequest();
  oReq.open("POST", api_url, true);
  oReq.timeout = timeout;
  oReq.onload = function (oEvent) {
    if (oReq.status == 200) {
      var r = oReq.responseText;
      //console.log(r);
      r = JSON.parse(r);
      success(r);

    } else {
      var r = oReq.responseText;

      error(r);
    }
  };
  oReq.ontimeout = function (e) {

    times = times + 1;
    if (times < 2) {
        api_postRequest(req, success, error, timeout, times);
        
    } else {
      sweetAlert({ title: "Agotado el tiempo de espera con el servidor", type: "error" });
    }

   
  }
  oReq.send(_data);
}


/**********************************************/
/* Function para hacer request POST con Fetch */
/* Req request data, func success, func error */
/**********************************************/
function fetch_postRequest(req, success) {

  const api_url = sessionStorage.getItem('URL_API') + 'api.php';

  fetch(api_url, {
    method: 'POST',
    body: JSON.stringify(req), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok)
        return response.text()
      else
        throw new Error(response.status);
    })
    .catch(error => {
      console.log(error);
      sweetAlert({ title: "Error de Conexión\n" + error, type: "error" });
    })
    .then(data => {
      //console.log(data);
      let r = JSON.parse(data);
      success(r);
    });
}


// Funcion para redirigir a otra pagina
function iGoTo(goTo) {
  $("body").hide();
  window.location.href = goTo;
}

/** Funcion para cerrar sesion del Usuario */
function cerrarSession() {

  sessionStorage.removeItem('COD_USUARIO');
  sessionStorage.removeItem('NOM_USUARIO');
  sessionStorage.removeItem('TIPO_USUARIO');
  sessionStorage.removeItem('NOM_CIA');
  sessionStorage.removeItem('ANCHO_TKT');
  sessionStorage.removeItem('TIT_USUARIO');  
  sessionStorage.removeItem('URL_API');


  iGoTo('./login.html');

}



function activaMenu() {

  let req = [];
  req.w = 'apiSeccab';
  req.r = 'consulta_acceso_menu_usu';
  req.id_usuario = sessionStorage.getItem('COD_USUARIO');

  api_postRequest(req,
    function (data) {

      if (data.resp != null) {

        let response = data.resp;

        for (let menu in response) {

          if (document.getElementById(menu) != null) {
            if (response[menu] == 1) {

              if (document.getElementById(menu).classList.contains('disabled')) {

                document.getElementById(menu).classList.remove('disabled');

              }

            } else {

              if (!document.getElementById(menu).classList.contains('disabled')) {

                document.getElementById(menu).classList.add('disabled');

              }

            }

          }
        }

        console.log('Menu Activado');
      }

    }, function (data) {
      sweetAlert({ title: "Error en la respuesta del servidor", type: "error" });
    });


}

/*** Funcion para verificar acceso a modulos de usuario Administrado */
function enlaceAdm(_pagina) {

  let tipoUsuario = sessionStorage.getItem('TIPO_USUARIO');

  if (tipoUsuario == 1) {
    sweetAlert({ title: "Usuario NO tiene acceso autorizado al Módulo Administrador", type: "info" });
    return;
  }

  iGoTo(_pagina);

}