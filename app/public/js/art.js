$('.alert-danger').hide();
$('#imagePreview').hide();
function onFileChange(e) {
  let file = e.files[0];
  if (file.size > 70000) {
    $('.alert-danger').show();
    $('.alert-danger').html('File is too large, it needs to be less than 70 kb for the network to support it.');
    $('#artworkbytes').val('');
    $('#artwork').val('');
    $('#imagePreview').attr('src', '');
    $('#imagePreview').hide();
    return;
  }
    $('.alert-danger').hide();
  let reader = new FileReader();
  if (file) {
    reader.readAsDataURL(file);
    reader.onload = function () {
      $('#artworkbytes').val(reader.result);
      $('#imagePreview').attr('src', reader.result);
      $('#imagePreview').show();
    };
    reader.onerror = function (error) {
      console.log(err);
    };
  }
}
