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


