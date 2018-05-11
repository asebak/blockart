$('.alert-danger').hide();
function onFileChange(e) {
    var file = e.files[0];
    if(file.size > 70000){
        $('.alert-danger').show();
        $('.alert-danger').html('File is too large, it needs to be less than 70 kb for the network to support it.')
        $('#artworkbytes').val("");
        $('#artwork').val("");
        return
    };
    $('.alert-danger').hide();
    var reader = new FileReader();
    if(file){
    reader.readAsDataURL(file);
    reader.onload = function () {
        $("#artworkbytes").val(reader.result);
    };
    reader.onerror = function (error) {
        console.log(err);
    };
}
}