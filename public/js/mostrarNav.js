$('#btnMostrarNav').on('click', function (){
    $('nav').toggleClass('mostrarMenu');
    $('#divFondo').toggleClass('mostrarDiv');
});

$('#divFondo').on('click', function (){
    $('nav').removeClass('mostrarMenu');
    $('#divFondo').removeClass('mostrarDiv');
});

$('#buscador').on('click', function (){
    $('nav').removeClass('mostrarMenu');
    $('#divFondo').removeClass('mostrarDiv');
});

$('#muteGreen').click(function() {
    //$('#nogreen').toggleClass('likenogreen');
    $('#nogreen').toggleClass('likegreen');
    $('#nored').removeClass('dislikered');
});

$('#muteRed').click(function() {
    //$('#nored').toggleClass('dislikenored');
    $('#nored').toggleClass('dislikered');
    $('#nogreen').removeClass('likegreen');
});



/*
// función que actualiza el zoom del elemento body
function actualizarTama() {
  
  $("body").css("zoom", window.innerWidth / 1200);
  
}

$(document).ready(function() {

  // actualizaremos el zoom cuando la ventana cambie de tamaño
  $(window).on("resize", actualizarTama);
  
  // y al cargar la página
  actualizarTama();
  
});
*/

