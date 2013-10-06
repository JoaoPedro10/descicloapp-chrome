function irn() {
	chrome.notifications.create("ir", {	type : "basic", iconUrl: "../icons/icon_ir.png", title: "DescicloApp", message: "Escreva algo primeiro: Digite na barra de texto que p\u00E1gina voc\u00EA quer ir na Desciclop\u00E9dia, poser", priority: 2}, function() {});
}
	
function editarn() {
		chrome.notifications.create("editar", {	type : "basic", iconUrl: "../icons/icon_edit.png", title: "DescicloApp", message: "Escreva algo primeiro: Digite na barra de texto que p\u00E1gina voc\u00EA quer editar ou criar na Desciclop\u00E9dia, s\u00F3 n\u00E3o vai fazer merda pra um sysop n\u00E3o te pegar, seu n00b!!", priority: 2}, function() {});
}
	
function pesquisarn() {
		chrome.notifications.create("busca", {	type : "basic", iconUrl: "../icons/icon_busca.png", title: "DescicloApp", message: "Escreva algo primeiro: Digite na barra de texto o que voc\u00EA quer pesquisar na Desciclop\u00E9dia, ou n\u00E3o", priority: 2}, function() {});
}
	
function salvarn() {
		chrome.notifications.create("salvar", {	type : "basic", iconUrl: "../icons/icon_salvar.png", title: "DescicloApp", message: "Tudo salvo :D", priority: 2}, function() {});
}