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
			curtir = chrome.notifications.create(curtir, {
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
			curtir.show();
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

if (localStorage.atualizacao57 == "true") {
	if (!localStorage.atualizacao60) {
		localStorage.atualizacao60 = "true";
		notif = chrome.notifications.create("changelog", {
				type : "list",
				iconUrl : "icons/icon_64.png",
				title : "DescicloApp atualizado: Vers\u00E3o 6.0",
				message : "",
				items : [{
						title : "NOTA",
						message : "DescicloToolbar agora desativada por padr\u00E3o, se voc\u00ea a usava ent\u00E3o ative-a novamente nas op\u00e7\u00F5es"
					}, {
						title : "",
						message : "Nova fun\u00e7\u00E3o de receber notifica\u00e7\u00F5es de novas mensagens."
					}, {
						title : "",
						message : "Widget de mudan\u00e7as recentes melhorado."
					}, {
						title : "",
						message : "Novos widgets de Twitter e Facebook na Popup e DescicloToolbar."
					}, {
						title : "",
						message : "E outras melhoras menores."
					}, ],
				buttons : [{
						title : 'Ver changelog completo',
						iconUrl : 'imagens/externowp7.png'
					}, {
						title : 'Abrir op\u00e7\u00F5es',
						iconUrl : 'imagens/externowp7.png'
					}
				],
				priority : 2
			}, function () {
				if (!localStorage.username) {
					localStorage.setItem('notifications_enabled', 'false');
					localStorage.setItem('username', '');
				} else {
					localStorage.setItem('notifications_enabled', 'true');
					setTimeout(function () {
						var bg = chrome.extension.getBackgroundPage();

						bg.addPage({
							//coloquei o &printable=yes porque as vezes aparece uma predefinicao do twitter/blog na pagina que fica mudando toda hora
							url : 'http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history&printable=yes'
						})
						bg.takeSnapshot('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history&printable=yes')
					}, 5000);
				}
				localStorage.setItem('pref_tb_is_visible', 'true');
				setTimeout(function () {
					localStorage["check_interval"] = "5400"
				}, 5000);
			});
		chrome.notifications.onButtonClicked.addListener(function (changelog, buttonIndex) {
			if (buttonIndex == 0) {
				window.open('paginas/changelog.html');
				chrome.notifications.clear(changelog, function (wasCleared) {});
			} else if (buttonIndex == 1) {
				window.open('paginas/opcoes.html');
				chrome.notifications.clear(redef, function (wasCleared) {});
			}
		});
		chrome.notifications.onClicked.addListener(function (changelog, byUser) {
			window.open('paginas/changelog.html');
			chrome.notifications.clear(changelog, function (wasCleared) {});
		});
		notif.show();
	}
} else {
	localStorage.atualizacao55 = "true";
	localStorage.atualizacao57 = "true";
	notif = chrome.notifications.create("changelog", {
			type : "list",
			iconUrl : "icons/icon_64.png",
			title : "DescicloApp: Vers\u00E3o 6.0",
			message : "",
			items : [{
					title : "NOTA",
					message : "Passe o mouse em cima"
				}, {
					title : "",
					message : "Nova fun\u00e7\u00E3o de receber notifica\u00e7\u00F5es de novas mensagens."
				}, {
					title : "",
					message : "Widget de mudan\u00e7as recentes melhorado."
				}, {
					title : "",
					message : "Novos widgets de Twitter e Facebook na Popup e DescicloToolbar."
				}, {
					title : "",
					message : "Pode escolher qualquer dom\u00EDnio para ser seu favorito, inclusive de outras wikis"
				}, {
					title : "",
					message : "Pode escolher os bot\u00F5es que aparecem na popup"
				}
			],
			buttons : [{
					title : 'Ver changelog completo',
					iconUrl : 'imagens/externowp7.png'
				}
			],
			priority : 2
		}, function () {});
	chrome.notifications.onButtonClicked.addListener(function (changelog, buttonIndex) {
		if (buttonIndex == 0) {
			window.open('paginas/changelog.html');
			chrome.notifications.clear(changelog, function (wasCleared) {});
		}
	});
	chrome.notifications.onClicked.addListener(function (changelog, byUser) {
		window.open('paginas/changelog.html');
		chrome.notifications.clear(changelog, function (wasCleared) {});
	});
	notif.show();
}
