	function verificarSuporte()
	{
		var c = (window.webkitNotifications !== undefined);
		if (!c)
		{
			alert("Que porra \u00E9 essa? Tem um probleminha no seu Google Chrome, n\u00E3o t\u00E1 mostrando as notifica\u00E7\u00F5es =[ Ou voc\u00EA ta usando outro navegador? Poser");
		}
		return c;
	}

	function verificarPermissao()
	{
		if (!verificarSuporte()) return;
		switch (webkitNotifications.checkPermission())
		{
		case 0:
			alert("Est� dando pra usar as notifica��es (ou n�o)");
			break;
		case 1:
			alert("Voc� desativou as notifica��es? VTNC!!");
			break;
		case 2:
			alert("Voc� n�o permitiu as notifica��es seu emo? Poser");
			break;
		}
	}

	function solicitarPermissao()
	{
		if (!verificarSuporte()) return;
		webkitNotifications.requestPermission();
	}

	function Ir()
	{
		if (!verificarSuporte()) return;
		if (webkitNotifications.checkPermission() == 0)
		{
			var icone = "icons/icon_32.png";
			var titulo = "DescicloApp";
			var subTitulo = "Escreva algo primeiro: Digite na barra de texto que p�gina voc� quer ir na Desciclop�dia, poser";
			var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
			notificacao.show();
			setTimeout(function ()
			{
				notificacao.cancel()
			}, 5000);
		}
	}
	function Editar()
	{
		if (!verificarSuporte()) return;
		if (webkitNotifications.checkPermission() == 0)
		{
			var icone = "icons/icon_32.png";
			var titulo = "DescicloApp";
			var subTitulo = "Escreva algo primeiro: Digite na barra de texto que p�gina voc� quer editar ou criar na Desciclop�dia, s� n�o vai fazer merda pra um sysop n�o te pegar, seu n00b!!";
			var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
			notificacao.show();
			setTimeout(function ()
			{
				notificacao.cancel()
			}, 5000);
		}
	}
 	function Pesquisar()
	{
		if (!verificarSuporte()) return;
		if (webkitNotifications.checkPermission() == 0)
		{
			var icone = "icons/icon_32.png";
			var titulo = "DescicloApp";
			var subTitulo = "Escreva algo primeiro: Digite na barra de texto o que voc� quer pesquisar na (Xvideos) Desciclop�dia, ou n�o";
			var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
			notificacao.show();
			setTimeout(function ()
			{
				notificacao.cancel()
			}, 5000);
		}
	}
 	function Sobre()
	{
		if (!verificarSuporte()) return;
		if (webkitNotifications.checkPermission() == 0)
		{
			var url = "../sobre.html";
			var notificacao = webkitNotifications.createHTMLNotification( url );
			notificacao.show();
			setTimeout(function ()
			{
				notificacao.cancel()
			}, 10000);
		}
	}
 	function Sugestao()
	{
		if (!verificarSuporte()) return;
		if (webkitNotifications.checkPermission() == 0)
		{
			var url = "../sugestao.html";
			var notificacao = webkitNotifications.createHTMLNotification( url );
			notificacao.show();
			setTimeout(function ()
			{
				notificacao.cancel()
			}, 10000);
		}
	}