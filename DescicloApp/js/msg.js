function enter(){
	if(event.keyCode=='13'){
		window.open('http://' + document.getElementById('alternativo').value + '/index.php?title=User_talk:' + document.getElementById('q').value + '&action=edit&section=new') }
}

function mensagem(){
	if(q.value != "") {
		//Coloquei em ingles (user_talk) porque se colocasse em portugues (Usu%C3%A1rio_Discuss%C3%A3o) dava um erro estranho quando o user tinha acento
		window.open('http://' + document.getElementById('alternativo').value + '/index.php?title=User_talk:' + document.getElementById('q').value + '&action=edit&section=new') }
	else {
		mensagemn() }
}

function email(){
	if(q.value != "") {
		window.open('http://' + document.getElementById('alternativo').value + '/wiki/Especial:Contatar_usu%C3%A1rio/' + document.getElementById('q').value) }
	else {
		emailn() }
}

function restaurar() {
  var favorito = localStorage["alternativo_favorito"];
  if (!favorito) {
    return;
  }
  var select = document.getElementById("alternativo");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorito) {
      child.selected = "true";
      break;
    } else { if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { document.getElementById("alternativo").options[8]=new Option(localStorage["napopup"], localStorage["alternativo_favorito"]); child.selected = "outro"; } }
  }
}

window.onload = function(){
	$('hr').css('background-color',localStorage.getItem('cor-favorita'));
	$('#voltar').click(function(){  
		window.location="popup.html";
	});
	$('#mensagem').click(function() { mensagem() });
	$('#email').click(function() { email() });
	document.getElementById('q').focus();
	restaurar();
}

window.onkeypress = function(){
	enter()
}