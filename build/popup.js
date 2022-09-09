function validate() {
    document.getElementById('label-token').style = 'color:red';
    document.getElementById('api-key').value = '';
    return false;
}
function init(){
    document.getElementById('form-private-token').onsubmit = validate;
}
window.onload = init;