var iricone=localStorage.getItem('iricone');
var editaricone=localStorage.getItem('editaricone');
var pesquisaricone=localStorage.getItem('pesquisaricone');


function enter(){
if(event.keyCode=='13'){
		window.open('http://' + document.getElementById('alternativo').value + '/wiki/' + document.getElementById('q').value) }
}

function ir(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/' + document.getElementById('q').value}) }
	else {
		irn() }
}

function editar(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?title=' + document.getElementById('q').value + '&action=edit'}) }
	else {
		editarn() }
}

function pesquisar(){
 	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?title=Especial%3ABusca&search=' + document.getElementById('q').value}) }
	else {
		pesquisarn() }
}

function irb(){
	chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/P%C3%A1gina_principal'})
}

function pagina(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Usu%C3%A1rio:' + document.getElementById('q').value}) }
	else {
	//Eu usei window.open() porque com ele demora mais pra aparecer a url, dando a impressao de que a extensao descobriu sozinha o username
	window.open('http://' + document.getElementById('alternativo').value + '/wiki/Especial:Minha_p%C3%A1gina') }
}

function discussao(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Usu%C3%A1rio_discuss%C3%A3o:' + document.getElementById('q').value}) }
	else {
	window.open('http://' + document.getElementById('alternativo').value + '/wiki/Especial:Minha_discuss%C3%A3o') }
}

function contribuicao(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Especial:Contribui%C3%A7%C3%B5es/' + document.getElementById('q').value}) }
	else {
	window.open('http://' + document.getElementById('alternativo').value + '/wiki/Special:MyContributions') }
}

function vigiado(){
	chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Especial:P%C3%A1ginas_vigiadas'})
}

function carregar(){
	chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Especial:Carregar_arquivo'})
}

function aleatorio(){
	chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Especial:Aleat%C3%B3ria'})
}

function mensagem(){
	window.open('msg.html', '_self')
}

function recentes(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Special:Recentchanges/' + document.getElementById('q').value}) }
	else {
	chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Special:Recentchanges/250'}) }
}

function recentespopup(){
	window.open('paginas/recentes.html', '_self')
}

function mais(){
	if (this.parentNode.nextSibling.childNodes[0].style.display != '') {
		document.getElementById('mais').innerHTML = '<img src="imagens/cimawp7.png" width="16px"> Menos';
		this.parentNode.nextSibling.childNodes[0].style.display = ''; }
	else {
	document.getElementById('mais').innerHTML = '<img src="imagens/baixowp7.png" width="16px"> Mais';
	this.parentNode.nextSibling.childNodes[0].style.display = 'none';}
}

function boteco(){
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Forum:Boteco'})
}

function aa(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?action=edit&preload= Predefini%C3%A7%C3%A3o%3AForumheader%2FAlco%C3%B3licos+An%C3%B4nimos&editintro=&title=Forum%3A' + document.getElementById('q').value + '&create=Adicionar+novo+t%C3%B3pico'}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Forum:Alco%C3%B3licos_An%C3%B4nimos'}) }
}

function truco(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?action=edit&preload=Predefini%C3%A7%C3%A3o%3AForumheader%2FOfftopic&title=Forum%3A' +  document.getElementById('q').value + '&create=Adicionar+novo+t%C3%B3pico'}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Forum:Mesa_de_Truco'}) }
}

function desnoticias(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?action=edit&preload=Predefini%C3%A7%C3%A3o%3ANova+not%C3%ADcia&title=DesNot%C3%ADcias%3A' + document.getElementById('q').value + '&create=Criar+p%C3%A1gina'}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Desnot%C3%ADcias:P%C3%A1gina_principal'}) }
}

function descionario(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Descion%C3%A1rio:' + document.getElementById('q').value}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Descion%C3%A1rio:P%C3%A1gina_principal'}) }
}

function deslivros(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?action=edit&preload=Predefini%C3%A7%C3%A3o%3ANovo+deslivro&title=Deslivros%3A' + document.getElementById('q').value + '&create=Criar+p%C3%A1gina'}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Deslivros:P%C3%A1gina_principal'}) }
}

function despoesias(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?action=edit&preload=Predefini%C3%A7%C3%A3o%3ANova+despoesia&title=Despoesias%3A' + document.getElementById('q').value + '&create=Criar+p%C3%A1gina'}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Despoesias:P%C3%A1gina_principal'}) }
}

function descifras(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?action=edit&preload=Predefini%C3%A7%C3%A3o%3ANova+descifra&title=Descifras%3A' + document.getElementById('q').value + '&create=Criar+p%C3%A1gina'}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Descifras:P%C3%A1gina_principal'}) }
}

function desentrevistas(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Desentrevistas:' + document.getElementById('q').value}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Desentrevistas:P%C3%A1gina_principal'}) }
}

function descitacoes(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Descita%C3%A7%C3%B5es:' + document.getElementById('q').value}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Descita%C3%A7%C3%B5es:P%C3%A1gina_principal'}) }
}

function deslistas(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?action=edit&preload=Predefini%C3%A7%C3%A3o%3ADeslistas%2Fpreload&title=Deslistas%3A' + document.getElementById('q').value + '&create=Criar+p%C3%A1gina'}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Deslistas:P%C3%A1gina_principal'}) }
}

function fatos(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Fatos:' + document.getElementById('q').value}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Fatos:P%C3%A1gina_principal'}) }
}

function facebook(){
	chrome.tabs.create({url: 'http://facebook.com/Desciclopedia'})
}

function twitter(){
	chrome.tabs.create({url: 'http://twitter.com/DaDesciclopedia'})
}

function blog(){
	chrome.tabs.create({url: 'http://descicloblog.blogspot.com'})
}

function ajuda(){
	window.open('paginas/faq.html', '_blank')
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
    }
  }
}

window.onload = function(){
		$('hr').css('background-color',localStorage.getItem('cor-favorita'));
		$('#ir').css({'background-image':'url(' + iricone + ')', 'background-color':localStorage.getItem('cor-favorita'), 'background-repeat': 'no-repeat', 'background-position': 'center'});
		$('#editar').css({'background-image':'url(' + editaricone + ')', 'background-color':localStorage.getItem('cor-favorita'), 'background-repeat': 'no-repeat', 'background-position': 'center'});
		$('#pesquisar').css({'background-image':'url(' + pesquisaricone + ')', 'background-color':localStorage.getItem('cor-favorita'), 'background-repeat': 'no-repeat', 'background-position': 'center'});
		$('#hifen').html(localStorage.getItem('hifen'));
		$('#username').click(function()  { chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Usu%C3%A1rio:' + localStorage.getItem('username')}); });
		$('#username').html(localStorage.getItem('username'));
		$('#ir').click(function() { ir() });
		$('#editar').click(function() { editar() });
		$('#pesquisar').click(function() { pesquisar() });
		$('#irb').click(function() { irb() });
		$('#pagina').click(function() { pagina() });
		$('#discussao').click(function() { discussao() });
		$('#contribuicao').click(function() { contribuicao() });
		$('#vigiado').click(function() { vigiado() });
		$('#carregar').click(function() { carregar() });
		$('#aleatorio').click(function() { aleatorio() });
		$('#mensagem').click(function() { mensagem() });
		$('#recentes').click(function() { recentes() });
		$('#recentespopup').click(function() { recentespopup() });
		document.getElementById('mais').onclick=mais;
		$('#boteco').click(function() { boteco() });
		$('#aa').click(function() { aa() });
		$('#truco').click(function() { truco() });
		$('#desnoticias').click(function() { desnoticias() });
		$('#descionario').click(function() { descionario() });
		$('#deslivros').click(function() { deslivros() });
		$('#despoesias').click(function() { despoesias() });
		$('#descifras').click(function() { descifras() });
		$('#desentrevistas').click(function() { desentrevistas() });
		$('#descitacoes').click(function() { descitacoes() });
		$('#deslistas').click(function() { deslistas() });
		$('#fatos').click(function() { fatos() });
		$('#facebook').click(function() { facebook() });
		$('#twitter').click(function() { twitter() });
		$('#blog').click(function() { blog() });
		$('#ajuda').click(function() { ajuda() });
		document.getElementById('q').focus();
		if(localStorage.getItem('jadesativou') != "true") { $('#apn-options-menu').css({'display':'none'}); } else { $('#apn-options-menu').css({'display':''}); };
		restaurar();
}

window.onkeypress = function(){
		enter()
}