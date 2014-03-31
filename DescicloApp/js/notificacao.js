function irn() {
	chrome.notifications.create('ir', {
		type : "basic",
		iconUrl : "../icons/icon_ir.png",
		title : "DescicloApp",
		message : "Escreva algo primeiro: Digite na barra de texto que p\u00E1gina voc\u00EA quer ir na Desciclop\u00E9dia, poser",
		priority : 0
	}, function () {
		setTimeout(function () {
			chrome.notifications.clear('ir', function (wasCleared) {})
		}, 10000)
	});
}

function editarn() {
	chrome.notifications.create('editar', {
		type : "basic",
		iconUrl : "../icons/icon_edit.png",
		title : "DescicloApp",
		message : "Escreva algo primeiro: Digite na barra de texto que p\u00E1gina voc\u00EA quer editar ou criar na Desciclop\u00E9dia, s\u00F3 n\u00E3o vai fazer merda pra um sysop n\u00E3o te pegar, seu n00b!!",
		priority : 0
	}, function () {
		setTimeout(function () {
			chrome.notifications.clear('editar', function (wasCleared) {})
		}, 10000)
	});
}

function pesquisarn() {
	chrome.notifications.create('pesquisar', {
		type : "basic",
		iconUrl : "../icons/icon_busca.png",
		title : "DescicloApp",
		message : "Escreva algo primeiro: Digite na barra de texto o que voc\u00EA quer pesquisar na Desciclop\u00E9dia, ou n\u00E3o",
		priority : 0
	}, function () {
		setTimeout(function () {
			chrome.notifications.clear('pesquisar', function (wasCleared) {})
		}, 10000)
	});
}

function mensagemn() {
	chrome.notifications.create('mensagem', {
		type : "basic",
		iconUrl : "../icons/icon_mensagem.png",
		title : "DescicloApp",
		message : "Escreva algo primeiro: Digite na barra de texto o username de um usu\u00E1rio que voc\u00ea quer enviar uma mensagem, via p\u00E1gina de discuss\u00E3o",
		priority : 0
	}, function () {
		setTimeout(function () {
			chrome.notifications.clear('mensagem', function (wasCleared) {})
		}, 10000);
	});
}

function emailn() {
	chrome.notifications.create('email', {
		type : "basic",
		iconUrl : "../icons/icon_mensagem.png",
		title : "DescicloApp",
		message : "Escreva algo primeiro: Digite na barra de texto o username de um usu\u00E1rio que voc\u00ea quer enviar um e-mail na Desciclop\u00E9dia, via Contatar usu\u00E1rio",
		priority : 0
	}, function () {
		setTimeout(function () {
			chrome.notifications.clear('email', function (wasCleared) {})
		}, 10000);
	});
}

function salvarn() {
	chrome.notifications.create('salvar', {
		type : "basic",
		iconUrl : "../icons/icon_salvar.png",
		title : "DescicloApp",
		message : "Tudo salvo :D",
		priority : 0
	}, function () {
		setTimeout(function () {
			chrome.notifications.clear('salvar', function (wasCleared) {})
		}, 10000)
	});
}
