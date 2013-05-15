function mensagemn() {
	var icone = "https://raw.github.com/alefesouza/descicloapp-chrome/master/DescicloApp/icons/icon_32.png";
	var titulo = "DescicloApp";
	var subTitulo = "Escreva algo primeiro: Digite na barra de texto o username de um usu\u00E1rio que voc\u00ea quer enviar uma mensagem, via p\u00E1gina de discuss\u00E3o";
	var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
	notificacao.show();
	setTimeout(function ()
	{
		notificacao.cancel()
	}, 5000);
}

function emailn() {
	var icone = "https://raw.github.com/alefesouza/descicloapp-chrome/master/DescicloApp/icons/icon_32.png";
	var titulo = "DescicloApp";
	var subTitulo = "Escreva algo primeiro: Digite na barra de texto o username de um usu\u00E1rio que voc\u00ea quer enviar um e-mail na Desciclop\u00E9dia, via Contatar usu\u00E1rio";
	var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
	notificacao.show();
	setTimeout(function ()
	{
		notificacao.cancel()
	}, 5000);
}