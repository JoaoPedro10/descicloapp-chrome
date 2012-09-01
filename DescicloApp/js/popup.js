function $(id){  
		return document.getElementById(id);  
	}  

function enter(){
if(event.keyCode=='13'){
		window.open('http://' + document.getElementById('alternativo').value + '/wiki/' + document.getElementById('q').value) }
}

function ir(){
	var irei = document.getElementById('q');
	if(irei.value != "")
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/' + document.getElementById('q').value})
	else
		irn()
}

function editar(){
	var editarei = document.getElementById('q');
	if(editarei.value != "")
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?title=' + document.getElementById('q').value + '&action=edit'})
	else
		editarn()	
}

function pesquisar(){
	var pesquisarei = document.getElementById('q');
	if(pesquisarei.value != "")
		chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/index.php?title=Especial%3ABusca&search=' + document.getElementById('q').value})
	else
		pesquisarn()
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

function facebook(){
	chrome.tabs.create({url: 'http://facebook.com/Desciclopedia'})
}

function twitter(){
	chrome.tabs.create({url: 'http://twitter.com/DaDesciclopedia'})
}

function blog(){
	chrome.tabs.create({url: 'http://descicloblog.blogspot.com'})
}

function tumblr(){
	chrome.tabs.create({url: 'http://desciclopedia.tumblr.com/'})
}

function ajuda(){
	window.open('paginas/faq.html', '_blank')
}

window.onload = function(){
		$('ir').onclick=ir;
		$('editar').onclick=editar;
		$('pesquisar').onclick=pesquisar;
		$('irb').onclick=irb;
		$('pagina').onclick=pagina;
		$('discussao').onclick=discussao;
		$('contribuicao').onclick=contribuicao;
		$('vigiado').onclick=vigiado;
		$('carregar').onclick=carregar;
		$('mensagem').onclick=mensagem;
		$('recentes').onclick=recentes;
		$('facebook').onclick=facebook;
		$('twitter').onclick=twitter;
		$('blog').onclick=blog;
		$('tumblr').onclick=tumblr;
		$('ajuda').onclick=ajuda;
}

window.onkeypress = function(){
		enter()
}