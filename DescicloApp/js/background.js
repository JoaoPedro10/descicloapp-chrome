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

if(localStorage.getItem('buscacontexto') != "false") {
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
}

if(!localStorage.primeira){
    chrome.tabs.create({url: "paginas/opcoes.html"});
    chrome.tabs.create({url: "paginas/toolbar.html"});
    localStorage.primeira = "true";
}

if(!localStorage.storagepadrao){
	localStorage["alternativo_favorito"] = "desciclopedia.org";
	localStorage["cor-favorita"] = "#00ffff";
	localStorage["cor2"] = "black";
	localStorage["buscacontexto"] = "true";
	localStorage["descicloguia"] = "false";
	localStorage["coricone"] = "imagens/buscawp72.png";
	localStorage["iricone"] = "imagens/avancarwp7.png";
	localStorage["editaricone"] = "imagens/novowp7.png";
	localStorage["pesquisaricone"] = "imagens/buscawp7.png";
	localStorage["botaomais"] = "true";
	localStorage["barrabusca"] = "true";
	localStorage["botaofeedback"] = "true";
	localStorage["pref_tb_is_visible"] = "true";
    localStorage.storagepadrao = "true";
}

if(localStorage.getItem('tres') == "true"){ 
if(!localStorage.page){
	noti = chrome.notifications.create("curtir", { type: "basic", iconUrl: "icons/icon_facebook.png", title: "DescicloApp", message: "Gostando do DescicloApp? Ent\u00E3o fa\u00e7\a uma doa\u00e7\u00E3o e mimimi mimimi mimimi, como eu sei que voc\u00ea \u00E9 m\u00E3o de vaca e n\u00E3o vai doar mesmo com eu gastando tempo e dinheiro pra criar essa jo\u00e7a eu s\u00F3 te pe\u00e7o pra voc\u00ea curtir minha p\u00E1gina de humor de Facebook :D", buttons: [{ title: 'Curtir Aleferror Menes', iconUrl: 'imagens/curtir.png' }], priority: 2}, function creationCallback() {});
	chrome.notifications.onButtonClicked.addListener(notificationBtnClick);
function notificationBtnClick(curtir, iBtn) {
	window.open('http://facebook.com/AleferrorMenes');
	chrome.notifications.clear(curtir, function(wasCleared) {});
}
	chrome.notifications.onClicked.addListener(function(curtir) { window.open('http://facebook.com/AleferrorMenes'); });
    localStorage.page = "true";
	noti.show();
} }

// Fazer a notificacao do Facebook aparecer somente na terceira vez que o usuario abrir o Chrome
if(localStorage.getItem('dois') == "true"){ localStorage.tres = "true"; }
if(localStorage.getItem('primeira') == "true"){ localStorage.dois = "true"; }

// Corrige bug no Facebook se a DescicloToolbar estiver ativada
if(localStorage.getItem('pref_tb_is_visible') == "true") { chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.url && tab.url.indexOf('https://www.facebook.com') > -1){
    chrome.tabs.insertCSS(tabId, {code: ".stickyHeaderWrap{top:30px;}"});
  }
}); }

if(localStorage.atualizacao53 == "true"){
	if(!localStorage.atualizacao55) {
	localStorage.atualizacao55 = "true";
	notif = chrome.notifications.create("changelog", { type: "list", iconUrl: "icons/icon_64.png", title: "DescicloApp atualizado: Vers\u00E3o 5.5", message: "", items: [ { title: "", message: "Nova op\u00e7\u00E3o de redefinir"}, { title: "", message: "Corre\u00e7\u00E3o de bugs"}, { title: "", message: "E outras melhoras menores"},], buttons: [{ title: 'Ver changelog completo', iconUrl: 'imagens/externowp7.png' }], priority: 0}, function() {});
	chrome.notifications.onButtonClicked.addListener(function(changelog, buttonIndex) {
		if (buttonIndex == 0) {
			window.open('paginas/changelog.html');
			chrome.notifications.clear(changelog, function(wasCleared) {});
		}});
	chrome.notifications.onClicked.addListener(function(changelog, byUser) {
		window.open('paginas/changelog.html');
		chrome.notifications.clear(changelog, function(wasCleared) {});
	});
	notif.show();
	}
} else {
	localStorage.atualizacao53 = "true";
	localStorage.atualizacao55 = "true";
	notif = chrome.notifications.create("changelog", { type: "list", iconUrl: "icons/icon_64.png", title: "DescicloApp atualizado: Vers\u00E3o 5.5", message: "", items: [ { title: "NOTA", message: "Passe o mouse em cima"}, { title: "", message: "Nova op\u00e7\u00E3o de abrir um artigo aleat\u00F3rio na Nova guia"}, { title: "", message: "Agora voc\u00ea pode escolher se quer ou n\u00E3o a busca pelo menu contexto"}, { title: "", message: "Corre\u00e7\u00E3o de bugs"}, { title: "", message: "Nova op\u00e7\u00E3o de redefinir"} ], buttons: [{ title: 'Ver changelog completo', iconUrl: 'imagens/externowp7.png' }], priority: 0}, function() {});
	chrome.notifications.onButtonClicked.addListener(function(changelog, buttonIndex) {
		if (buttonIndex == 0) {
			window.open('paginas/changelog.html');
			chrome.notifications.clear(changelog, function(wasCleared) {});
		}});
	chrome.notifications.onClicked.addListener(function(changelog, byUser) {
		window.open('paginas/changelog.html');
		chrome.notifications.clear(changelog, function(wasCleared) {});
	});
	notif.show();
}