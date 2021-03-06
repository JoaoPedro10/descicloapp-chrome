chrome.omnibox.onInputChanged.addListener(
	function (text, suggest) {
	console.log('inputChanged: ' + text);
	suggest([{
				content : " " + text,
				description : "Agora digite o nome da p\u00E1gina que voc\u00EA quer ir na Desciclop\u00E9dia e d\u00EA enter"
			}, {
				content : "Chuck Norris",
				description : "Chuck Norris"
			}, {
				content : "Cheiramento de gatinhos",
				description : "Cheiramento de gatinhos"
			}, {
				content : "Noku",
				description : "Noku"
			}, {
				content : "Desciclop%C3%A9dia",
				description : "Desciclop\u00E9dia"
			},
		]);
});

chrome.omnibox.onInputEntered.addListener(
	function (text) {
	console.log('inputEntered: ' + text);
	chrome.tabs.create({
		url : 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/' + text
	});
});

if (localStorage.getItem('buscacontexto') != "false") {
	chrome.contextMenus.create({
		title : "Ir a '%s' na Desciclop\u00E9dia",
		contexts : ["selection"],
		onclick : irdescicloapp
	});

	chrome.contextMenus.create({
		title : "Editar '%s' na Desciclop\u00E9dia",
		contexts : ["selection"],
		onclick : editardescicloapp
	});

	chrome.contextMenus.create({
		title : "Pesquisar '%s' na Desciclop\u00E9dia",
		contexts : ["selection"],
		onclick : buscadescicloapp
	});
	function irdescicloapp(info) {
		var textoselecionado = info.selectionText;
		chrome.tabs.create({
			url : 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/' + textoselecionado
		})
	}

	function editardescicloapp(info) {
		var textoselecionado = info.selectionText;
		chrome.tabs.create({
			url : 'http://' + localStorage.getItem('alternativo_favorito') + '/index.php?title=' + textoselecionado + '&action=edit'
		})
	}

	function buscadescicloapp(info) {
		var textoselecionado = info.selectionText;
		chrome.tabs.create({
			url : 'http://' + localStorage.getItem('alternativo_favorito') + '/index.php?title=Especial%3ABusca&search=' + textoselecionado
		})
	}
}

if (!localStorage.primeira) {
	chrome.tabs.create({
		url : "paginas/opcoes.html"
	});
	chrome.tabs.create({
		url : "paginas/toolbar.html"
	});
	localStorage.primeira = "true";
}

if (localStorage.getItem('cinco') == "true") {
	chrome.windows.onCreated.addListener(function () {
		if (!localStorage.page) {
			noti = chrome.notifications.create("curtir", {
					type : "basic",
					iconUrl : "icons/icon_facebook.png",
					title : "DescicloApp",
					message : "Gostando do DescicloApp? Ent\u00E3o fa\u00e7\a uma doa\u00e7\u00E3o e mimimi mimimi mimimi, como eu sei que voc\u00ea \u00E9 m\u00E3o de vaca e n\u00E3o vai doar mesmo com eu gastando tempo e dinheiro pra criar essa jo\u00e7a eu s\u00F3 te pe\u00e7o pra voc\u00ea curtir minha p\u00E1gina de humor de Facebook :D",
					buttons : [{
							title : 'Curtir Aleferror Menes',
							iconUrl : 'imagens/curtir.png'
						}
					],
					priority : 2
				}, function creationCallback() {});
			chrome.notifications.onButtonClicked.addListener(notificationBtnClick);
			function notificationBtnClick(curtir, iBtn) {
				window.open('http://facebook.com/AleferrorMenes');
				chrome.notifications.clear(curtir, function (wasCleared) {});
			}
			chrome.notifications.onClicked.addListener(function (curtir) {
				window.open('http://facebook.com/AleferrorMenes');
			});
			localStorage.page = "true";
			noti.show();
		}
	})
}

// Fazer a notificacao do Facebook aparecer somente na quinta vez que o usuario abrir o Chrome
if (localStorage.getItem('quatro') == "true") {
	chrome.windows.onCreated.addListener(function () {
		localStorage.cinco = "true";
	})
}
if (localStorage.getItem('tres') == "true") {
	chrome.windows.onCreated.addListener(function () {
		localStorage.quatro = "true";
	})
}
if (localStorage.getItem('dois') == "true") {
	chrome.windows.onCreated.addListener(function () {
		localStorage.tres = "true";
	})
}
if (localStorage.getItem('primeira') == "true") {
	chrome.windows.onCreated.addListener(function () {
		localStorage.dois = "true";
	})
}

// Corrige bug no Facebook se a DescicloToolbar estiver ativada
if (localStorage.getItem('pref_tb_is_visible') == "true") {
	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
		if (tab.url && tab.url.indexOf('https://www.facebook.com') > -1) {
			chrome.tabs.insertCSS(tabId, {
				code : ".stickyHeaderWrap{top:30px;}"
			});
		}
	});
}

// pra notificacao no icone desaparecer se o usuario entrar em algum dominio da Desciclopedia
function Visitado() {
	var a = 'http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history&printable=yes';
	BG.setPageSettings(a, {
		updated : !1
	}, function () {
		updateBadge();
		takeSnapshot(a, scheduleCheck);
	});
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.url && tab.url.indexOf('http://desciclopedia.org') > -1) {
		Visitado()
	}
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.url && tab.url.indexOf('http://desciclopedia.ws') > -1) {
		Visitado()
	}
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.url && tab.url.indexOf('http://pudim.info') > -1) {
		Visitado()
	}
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.url && tab.url.indexOf('http://vist.as') > -1) {
		Visitado()
	}
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.url && tab.url.indexOf('http://pesquisa.la') > -1) {
		Visitado()
	}
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.url && tab.url.indexOf('http://desnoticias.org') > -1) {
		Visitado()
	}
});

if(!localStorage.atualizacao61){
	localStorage.atualizacao61 = "true";
	notif = chrome.notifications.create("changelog", {
			type: "basic",
			iconUrl : "icons/icon_64.png",
			title : "DescicloApp: Vers\u00E3o 6.1",
			message : "Hey! O DescicloApp agora esta na Chrome Web Store!! Sugiro que voc\u00EA n\u00E3o baixe por aqui pois certamente a extens\u00E3o n\u00E3o funcionar\u00E1 ap\u00F3s reiniciar o Google Chrome, isso agora acontece com todas as extens\u00F5es instaladas fora da Chrome Web Store",
			buttons : [{
					title : 'Abrir DescicloApp na Chrome Web Store',
					iconUrl : 'imagens/externowp7.png'
				}
			],
			priority : 2
		}, function () {});
	chrome.notifications.onButtonClicked.addListener(function (changelog, buttonIndex) {
		if (buttonIndex == 0) {
			window.open('https://chrome.google.com/webstore/detail/descicloapp/pdejgnjfedagilkdjkgchihahejffgak');
			chrome.notifications.clear(changelog, function (wasCleared) {});
		}
	});
	notif.show();
}