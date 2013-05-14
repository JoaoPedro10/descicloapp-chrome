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
  
function buscadescicloapp(info)
{
	var textoselecionado = info.selectionText;
	chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/index.php?title=Especial%3ABusca&search=' + textoselecionado})
}

chrome.contextMenus.create({
	title: "Pesquisar '%s' na Desciclop\u00E9dia",
	contexts:["selection"],
	onclick: buscadescicloapp
});

if(!localStorage.opces){
    chrome.tabs.create({
       url : "paginas/opcoes.html"
    });
    localStorage.opcoes = "true";
}
