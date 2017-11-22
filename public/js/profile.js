function switchtoedit() {
  document.getElementById('perfil').style.display = 'none';
  document.getElementById('editar').style.display = 'block';
}
function switchtoprofilenoedit() {
  document.getElementById('perfil').style.display = 'block';
  document.getElementById('editar').style.display = 'none';

  document.getElementById('ta1').value = '<%=user.firstName + " " + user.lastName %>';
  document.getElementById('ta2').value = '<%=user.email %>';
  document.getElementById('ta3').value = "";
  document.getElementById('ta4').value = "This is my profile on DailyLiberty!";
  document.getElementById("fotoselect").value = "";
  //AFEGIR DESPRÉS QUAN HI HAGI MÉS INFO A LA BD
}
function switchtoprofileedit() {
  document.getElementById('perfil').style.display = 'block';
  document.getElementById('editar').style.display = 'none';

  /*TO DO: codi per actualitzar les dades a la Base de Dades */

  /* Un cop s'ha actualitzat la BD, cal tornar a refrescar els camps si es vol editar de nou... */
  document.getElementById('ta1').value = '<%=user.firstName + " " + user.lastName %>';
  document.getElementById('ta2').value = '<%=user.email %>';
  document.getElementById('ta3').value = "";
  document.getElementById('ta4').value = "This is my profile on DailyLiberty!";
  document.getElementById("fotoselect").value = "";
}

//Funcion para cambiar de pestañas
function openTab(evt, TabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(TabName).style.display = "block";
  evt.currentTarget.className += " active";
}
/* Para que al clicar salga el desplegable de la foto */
function activarfondofoto() {
    document.getElementById("fondofoto").style.display = 'block';
}
/* Para que el fondo se pire */
function fueraya() {
    document.getElementById("fondofoto").style.display = 'none';
}

//CAMBIOS DE FOTO:
function ripfoto() {
  if(document.getElementById("document-file").value != ""){
    document.getElementById("document-file").value = "";
  }
  document.getElementById("fotoselect").src = "https://www.drupal.org/files/profile_default.jpg"
}
function cambiarfoto() {

}
