//Nao consegui fazer as notificacoes das duas paginas funcionarem o mesmo arquivo...

	function verificarSuporte()
	{
		var c = (window.webkitNotifications !== undefined);
		if (!c)
		{
			alert("Que porra \u00E9 essa? Tem um probleminha no seu Google Chrome, n\u00E3o t\u00E1 mostrando as notifica\u00E7\u00F5es =[ Ou voc\u00EA ta usando outro navegador? Poser");
		}
		return c;
	}

 	function mensagemn()
	{
		if (!verificarSuporte()) return;
		if (webkitNotifications.checkPermission() == 0)
		{
			var icone = "https://raw.github.com/alefesouza/descicloapp-chrome/master/DescicloApp/icons/icon_32.png";
			var titulo = "DescicloApp";
			var subTitulo = "Escreva algo primeiro: Digite na barra de texto o username de um usuário que você quer enviar uma mensagem, via página de discussão";
			var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
			notificacao.show();
			setTimeout(function ()
			{
				notificacao.cancel()
			}, 5000);
		}
	}
 	function emailn()
	{
		if (!verificarSuporte()) return;
		if (webkitNotifications.checkPermission() == 0)
		{
			var icone = "https://raw.github.com/alefesouza/descicloapp-chrome/master/DescicloApp/icons/icon_32.png";
			var titulo = "DescicloApp";
			var subTitulo = "Escreva algo primeiro: Digite na barra de texto o username de um usuário que você quer enviar um e-mail na Desciclopédia, via Contatar usuário";
			var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
			notificacao.show();
			setTimeout(function ()
			{
				notificacao.cancel()
			}, 5000);
		}
	}