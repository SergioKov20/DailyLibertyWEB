var arrayInsults = ["putas","mal parit", "soplagaites", "mala fembra", "imbècil"];
var str1 = "*****";
var arrayLength = arrayInsults.length;
for (var i = 0; i < arrayLength; i++) {
    var insultRepetit = new RegExp(arrayInsults[i], "gi");
    var newhtml = $('#global').html().replace(insultRepetit, '<span class="marked">' + str1 + '</span>');
    $('#global').html(newhtml);
}