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
	//Eu usei window.open() porque com ele demora mais pra aparecer a url, dando a impressao de que a extensao descobriu sozinha o username
	window.open('http://' + document.getElementById('alternativo').value + '/wiki/Especial:Minha_p%C3%A1gina')
}

function discussao(){
	window.open('http://' + document.getElementById('alternativo').value + '/wiki/Especial:Minha_discuss%C3%A3o')
}

function contribuicao(){
	window.open('http://' + document.getElementById('alternativo').value + '/wiki/Special:MyContributions')
}

function vigiado(){
	chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Especial:P%C3%A1ginas_vigiadas'})
}

function carregar(){
	chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Especial:Carregar_arquivo'})
}

function mensagem(){
	window.open('msg.html', '_self')
}

function recentes(){
	chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Special:Recentchanges/250'})
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
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?action=edit&preload=Predefinição%3AForumheader%2FAlcoólicos+Anônimos&editintro=&title=Forum%3A' + document.getElementById('q').value + '&create=Adicionar+novo+tópico'}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Forum:Alco%C3%B3licos_An%C3%B4nimos'}) }
}

function truco(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?action=edit&preload=Predefini%C3%A7%C3%A3o%3AForumheader%2FOfftopic&title=Forum%3A' + + document.getElementById('q').value + '&create=Adicionar+novo+t%C3%B3pico'}) }
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
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Deslivros:' + document.getElementById('q').value}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Deslivros:P%C3%A1gina_principal'}) }
}

function despoesias(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Despoesias:' + document.getElementById('q').value}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Despoesias:P%C3%A1gina_principal'}) }
}

function descifras(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Descifras:' + document.getElementById('q').value}) }
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
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Deslistas:' + document.getElementById('q').value}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Deslistas:P%C3%A1gina_principal'}) }
}

function desinopses(){
	if(q.value != "") {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Desinopses:' + document.getElementById('q').value}) }
	else {
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Desinopses:P%C3%A1gina_principal'}) }
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

function abrir(){
	window.open('janela.html', '', 'width=345,height=421'); window.close();
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
		$('hr').css('background-color',localStorage.getItem('hr-color'));
		$('#ir').click(function() { ir() });
		$('#editar').click(function() { editar() });
		$('#pesquisar').click(function() { pesquisar() });
		$('#irb').click(function() { irb() });
		$('#pagina').click(function() { pagina() });
		$('#discussao').click(function() { discussao() });
		$('#contribuicao').click(function() { contribuicao() });
		$('#vigiado').click(function() { vigiado() });
		$('#carregar').click(function() { carregar() });
		$('#mensagem').click(function() { mensagem() });
		$('#recentes').click(function() { recentes() });
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
		$('#desinopses').click(function() { desinopses() });
		$('#fatos').click(function() { fatos() });
		$('#facebook').click(function() { facebook() });
		$('#twitter').click(function() { twitter() });
		$('#blog').click(function() { blog() });
		$('#ajuda').click(function() { ajuda() });
		$('#abrir').click(function() { abrir() });
		document.getElementById('q').focus();
		restaurar();
}

window.onkeypress = function(){
		enter()
}