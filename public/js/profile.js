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
  document.getElementById('ta4').value = "";
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
  document.getElementById('ta4').value = "";
  document.getElementById("fotoselect").value = "";

}
