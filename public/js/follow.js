//La idea es detectar si sigue o no al usuario (quizá en otro .js), si clica el botón de seguir
//debe registrar al usuario en la BD y que el botón pase a ser rojo con "UNFOLLOW"

function follow() {
  if(document.getElementById('seguir').innerHTML === "Follow") {
    document.getElementById('seguir').innerHTML = 'Unfollow';
    document.getElementById('seguir').style.backgroundColor = "#CC0000";
  }
  else {
    document.getElementById('seguir').innerHTML = 'Follow';
    document.getElementById('seguir').style.backgroundColor = "#3f51b5";
  }
}
