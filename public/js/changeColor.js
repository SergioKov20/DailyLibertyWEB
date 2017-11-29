//Like & Undislike funciona
//Dislike & Unlike funciona

$('#muteGreen').click(function() {
    $('#nogreen').toggleClass('likenogreen');
    $('#nogreen').toggleClass('likegreen');
    $('#nored').removeClass('dislikered');
    $('#nored').addClass('dislikenored');
});

$('#muteRed').click(function() {
    $('#nored').toggleClass('dislikenored');
    $('#nored').toggleClass('dislikered');
    $('#nogreen').removeClass('likegreen');
    $('#nogreen').addClass('likenogreen');
});


//Unlike i undislike funciona

$('#muteNoGreen').click(function() {
    $('#nogreen').toggleClass('likegreen');
    $('#nored').removeClass('dislikered');
});

$('#muteNoRed').click(function() {
    $('#nored').toggleClass('dislikered');
    $('#nogreen').removeClass('likegreen');
});



