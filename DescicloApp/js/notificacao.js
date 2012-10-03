	function verificarSuporte()
	{
		var c = (window.webkitNotifications !== undefined);
		if (!c)
		{
			alert("Que porra \u00E9 essa? Tem um probleminha no seu Google Chrome, n\u00E3o t\u00E1 mostrando as notifica\u00E7\u00F5es =[ Ou voc\u00EA ta usando outro navegador? Poser");
		}
		return c;
	}

	function irn()
	{
		if (!verificarSuporte()) return;
		{
//Quando eu tava fazendo essa parte da extensao (30/08/2012) o icone nao aparecia sendo que ta tudo certo, talvez seja um bug no Google Chrome ja que isso tambem tava acontecendo com outras extensoes que usam as notificacoes, por isso coloquei para pegar o icone por url mesmo
			var icone = "https://raw.github.com/alefesouza/descicloapp-chrome/master/DescicloApp/icons/icon_32.png";
			var titulo = "DescicloApp";
			var subTitulo = "Escreva algo primeiro: Digite na barra de texto que página você quer ir na Desciclopédia, poser";
			var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
			notificacao.show();
			setTimeout(function ()
			{
				notificacao.cancel()
			}, 5000);
		}
	}
	function editarn()
	{
		if (!verificarSuporte()) return;
		{
			var icone = "https://raw.github.com/alefesouza/descicloapp-chrome/master/DescicloApp/icons/icon_32.png";
			var titulo = "DescicloApp";
			var subTitulo = "Escreva algo primeiro: Digite na barra de texto que página você quer editar ou criar na Desciclopédia, só não vai fazer merda pra um sysop não te pegar, seu n00b!!";
			var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
			notificacao.show();
			setTimeout(function ()
			{
				notificacao.cancel()
			}, 5000);
		}
	}
 	function pesquisarn()
	{
		if (!verificarSuporte()) return;
		{
			var icone = "https://raw.github.com/alefesouza/descicloapp-chrome/master/DescicloApp/icons/icon_32.png";
			var titulo = "DescicloApp";
			var subTitulo = "Escreva algo primeiro: Digite na barra de texto o que você quer pesquisar na Desciclopédia, ou não";
			var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
			notificacao.show();
			setTimeout(function ()
			{
				notificacao.cancel()
			}, 5000);
		}
	}
	function salvarn()
	{
		if (!verificarSuporte()) return;
		{
			var icone = "https://raw.github.com/alefesouza/descicloapp-chrome/master/DescicloApp/icons/icon_32.png";
			var titulo = "DescicloApp";
			var subTitulo = "Tudo salvo :D";
			var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
			notificacao.show();
			setTimeout(function ()
			{
				notificacao.cancel()
			}, 5000);
		}
	}