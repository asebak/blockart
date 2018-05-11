function onFileChange(e) {
    var file = e.files[0];
    if(file.size > 70000){
        alert("File is too big!");
        return
    };
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