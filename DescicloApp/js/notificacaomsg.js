function mensagemn() {
	chrome.notifications.create("mensagem", {	type : "basic", iconUrl: "../icons/icon_mensagem.png", title: "DescicloApp", message: "Escreva algo primeiro: Digite na barra de texto o username de um usu\u00E1rio que voc\u00ea quer enviar uma mensagem, via p\u00E1gina de discuss\u00E3o", priority: 2}, function() { console.log("Succesfully created notification");});
}

function emailn() {
	chrome.notifications.create("email", {	type : "basic", iconUrl: "../icons/icon_mensagem.png", title: "DescicloApp", message: "Escreva algo primeiro: Digite na barra de texto o username de um usu\u00E1rio que voc\u00ea quer enviar um e-mail na Desciclop\u00E9dia, via Contatar usu\u00E1rio", priority: 2}, function() { console.log("Succesfully created notification");});
}