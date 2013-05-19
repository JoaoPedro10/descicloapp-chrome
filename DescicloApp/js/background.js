chrome.omnibox.onInputChanged.addListener(
	function(text, suggest) {
		console.log('inputChanged: ' + text);
		suggest([
		{content: " " + text, description: "Agora digite o nome da p\u00E1gina que voc\u00EA quer ir na Desciclop\u00E9dia e d\u00EA enter"},
		{content: "Chuck Norris", description: "Chuck Norris"},
		{content: "Cheiramento de gatinhos", description: "Cheiramento de gatinhos"},
		{content: "Noku", description: "Noku"},
		{content: "Desciclop%C3%A9dia", description: "Desciclop\u00E9dia"},
	]);
});

chrome.omnibox.onInputEntered.addListener(
	function(text) {
		console.log('inputEntered: ' + text);
		chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/' + text});
});
  
function irdescicloapp(info)
{
	var textoselecionado = info.selectionText;
	chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/' + textoselecionado})
}

function editardescicloapp(info)
{
	var textoselecionado = info.selectionText;
	chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/index.php?title=' + textoselecionado + '&action=edit'})
}

function buscadescicloapp(info)
{
	var textoselecionado = info.selectionText;
	chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/index.php?title=Especial%3ABusca&search=' + textoselecionado})
}

chrome.contextMenus.create({
	title: "Ir a '%s' na Desciclop\u00E9dia",
	contexts:["selection"],
	onclick: irdescicloapp
});

chrome.contextMenus.create({
	title: "Editar '%s' na Desciclop\u00E9dia",
	contexts:["selection"],
	onclick: editardescicloapp
});

chrome.contextMenus.create({
	title: "Pesquisar '%s' na Desciclop\u00E9dia",
	contexts:["selection"],
	onclick: buscadescicloapp
});

if(!localStorage.atualizacao51){
    var pagina = "../paginas/atualizacao.html";
	var notificacao = webkitNotifications.createHTMLNotification(pagina);
	notificacao.show();
    localStorage.atualizacao51 = "true";
}

if(!localStorage.primeira){
    chrome.tabs.create({url: "paginas/opcoes.html"});
    chrome.tabs.create({url: "paginas/toolbar.html"});
    localStorage.primeira = "true";
}

if(!localStorage.storagepadrao){
	localStorage["alternativo_favorito"] = "desciclopedia.org";
	localStorage["cor-favorita"] = "#00ffff";
	localStorage["coricone"] = "imagens/buscawp72.png";
	localStorage["iricone"] = "imagens/avancarwp7.png";
	localStorage["editaricone"] = "imagens/novowp7.png";
	localStorage["pesquisaricone"] = "imagens/buscawp7.png";
	localStorage["botaomais"] = "true";
	localStorage["barrabusca"] = "true";
	localStorage["botaofeedback"] = "true";
    localStorage.storagepadrao = "true";
}