function irn() {
//Quando eu tava fazendo essa parte da extensao (30/08/2012) o icone nao aparecia sendo que ta tudo certo, talvez seja um bug no Google Chrome ja que isso tambem tava acontecendo com outras extensoes que usam as notificacoes, por isso coloquei para pegar o icone por url mesmo
//Ate hoje (10/05/2013) da no mesmo
		var icone = "https://raw.github.com/alefesouza/descicloapp-chrome/master/DescicloApp/icons/icon_32.png";
		var titulo = "DescicloApp";
		var subTitulo = "Escreva algo primeiro: Digite na barra de texto que p\u00E1gina voc\u00ea quer ir na Desciclop\u00E9dia, poser";
		var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
		notificacao.show();
		setTimeout(function () {
			notificacao.cancel()
	}, 5000);
}
	
function editarn() {
		var icone = "https://raw.github.com/alefesouza/descicloapp-chrome/master/DescicloApp/icons/icon_32.png";
		var titulo = "DescicloApp";
		var subTitulo = "Escreva algo primeiro: Digite na barra de texto que p\u00E1gina voc\u00ea quer editar ou criar na Desciclop\u00E9dia, s\u00f3 n\u00E3o vai fazer merda pra um sysop n\u00E3o te pegar, seu n00b!!";
		var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
		notificacao.show();
		setTimeout(function ()
		{
		notificacao.cancel()
	}, 5000);
}
	
 function pesquisarn() {
		var icone = "https://raw.github.com/alefesouza/descicloapp-chrome/master/DescicloApp/icons/icon_32.png";
		var titulo = "DescicloApp";
		var subTitulo = "Escreva algo primeiro: Digite na barra de texto o que voc\u00ea quer pesquisar na Desciclop\u00E9dia, ou n\u00E3o";
		var notificacao = webkitNotifications.createNotification(icone, titulo, subTitulo);
		notificacao.show();
		setTimeout(function ()
		{
			notificacao.cancel()
		}, 5000);
}
	
function salvarn() {
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