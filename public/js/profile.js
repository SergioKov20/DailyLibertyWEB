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
function cambiarfoto(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#fotoselect')
                .attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);

    }
}
