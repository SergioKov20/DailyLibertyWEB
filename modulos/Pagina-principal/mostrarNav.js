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
