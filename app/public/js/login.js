$(function(){
    $("#submit_link").on('click', function(e){
        e.preventDefault();
        $("#upload:hidden").trigger('click');
    });
  });
  
function keyStoreChange(e){
    var file = e.files[0],
    fr = new FileReader();
    fr.onload = onload;
    fr.readAsText(file);
    function onload(e) {
        try {
            var ta = document.getElementById('jsoncontents');
            ta.value = e.target.result;
        } catch (e) {
  
        }
    }
}

  