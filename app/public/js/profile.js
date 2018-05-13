$(function(){
    $("#upload_link").on('click', function(e){
        e.preventDefault();
        $("#upload:hidden").trigger('click');
    });
});

function onFileChange(e) {
    var file = e.files[0];
    var reader = new FileReader();
    if(file){
    reader.readAsDataURL(file);
    reader.onload = function () {
        //var compressed = LZString.compress(reader.result);
        //avatar = compressed;
        $("#picturebytes").val(reader.result);
    };
    reader.onerror = function (error) {
        console.log(err);
        //save();
    };
}
}
