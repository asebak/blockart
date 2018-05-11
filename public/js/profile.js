/*var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
var nebPay = new NebPay();
var dappAddress = 'n1wkefRnGXPJHU9RCiHTMDct6Uo51DuQjVo';

function getProfile(addressId){
    debugger;
    var to = dappAddress
    var value = "0";
    var callFunction = "get";
    var callArgs = "[\"" + addressId + "\"]";
    nebPay.simulateCall(to, value, callFunction, callArgs, {    
        listener: cbSearch     
    });
}

function updateProfile(){
    var save = function() {
        var to = dappAddress;
        var value = "0";
        var callFunction = "save"
        var callArgs = "[\"" + name + "\", \"" + location + "\", \"" + website + "\", \"" + avatar + "\"]";

        nebPay.call(to, value, callFunction, callArgs, {  
            listener: function(response){
                $('.alert.alert-success').show();
                $('#successmessage').text("Updated with tx: " + response.txhash)
                console.log(response);
            }
        });
    };
    var name = $("#profileInfo :input[name='name']").val(); 
    var location = $("#profileInfo :input[name='location']").val(); 
    var website = $("#profileInfo :input[name='website']").val(); 
    var avatar = "";
    var e = $("#profileInfo :input[type='file']").prop('files');
    var file = e[0];
    var reader = new FileReader();
    if(file){
    // reader.readAsDataURL(file);
    reader.onload = function () {
        var compressed = LZString.compress(reader.result);
        avatar = compressed;
        save();
    };
    reader.onerror = function (error) {
        console.log(err);
        save();
    };
} else{
    save();
}


}
*/
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
/*
function cbSearch(resp) {
    var result = resp.result
    console.log("return of rpc call: " + JSON.stringify(result))

    if (result === 'null') {
        console.log('empty profile');
    } else {
        //if result is not null, then it should be "return value" or "error message"
        try{
            result = JSON.parse(result)
            var name = $("#profileInfo :input[name='name']").val(result.name); 
            var location = $("#profileInfo :input[name='location']").val(result.location); 
            var website = $("#profileInfo :input[name='website']").val(result.website); 
            var avatar = result.avatar;
        }catch (err){
            $('.alert.alert-danger').show();
            $('#errormessage').text(err);

        }
    }
}

  */