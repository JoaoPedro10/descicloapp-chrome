function voce(){
	//se caso o usuario escolher um dominio alternativo diferente vai levar para a pagina no desciclopedia.org (ja que ele pode escolher dominios de outras wikis), se nao escolher leva pra pagina no dominio alternativo favorito dele
	if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { chrome.tabs.create({url: 'http://desciclopedia.org/wiki/Voc%C3%AA'}) } else { chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Voc%C3%AA'}); };
}

function servidor(){
	if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { chrome.tabs.create({url: 'http://desciclopedia.org/wiki/Servidor_da_Desciclop%C3%A9dia'}) } else { chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Servidor_da_Desciclop%C3%A9dia'}); };
}

function store(){
	if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { chrome.tabs.create({url: 'http://desciclopedia.org/wiki/Chrome_Web_Store'}) } else { chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Chrome_Web_Store'}); };
}

function yourbase(){
	if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { chrome.tabs.create({url: 'http://desciclopedia.org/wiki/All_your_base_are_belong_to_us'}) } else { chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/All_your_base_are_belong_to_us'}); };
}

function descicloApp(){
	if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { chrome.tabs.create({url: 'http://desciclopedia.org/wiki/Usu%C3%A1rio:%C3%81s/DescicloApp'}) } else { chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Usu%C3%A1rio:%C3%81s/DescicloApp'}); };
}

function opera(){
	window.open('opera.html', '_self')
}

function firefox(){
	window.open('firefox.html', '_self')
}

function usuario(){
	if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { chrome.tabs.create({url: 'http://desciclopedia.org/wiki/Usu%C3%A1rio:%C3%81s'}) } else { chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Usu%C3%A1rio:%C3%81s'}); };
}

if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { var pagina = 'desciclopedia.org'; } else { var pagina = localStorage.getItem('alternativo_favorito'); };

function mensagem(){
	new Messi('<iframe id="JotFormIFrame" allowtransparency="true" src="http://aloogle.tumblr.com/descicloapp/feedback" frameborder="0" style="width:100%; height:600px; border:none;" scrolling="no"></iframe>', {title: 'Feedback'})
}

function johnny(){
	if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { chrome.tabs.create({url: 'http://desciclopedia.org/wiki/Usu%C3%A1rio:UltraJohnn%C3%BF'}) } else { chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Usu%C3%A1rio:UltraJohnn%C3%BF'}); };
}

function sipho(){
	if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { chrome.tabs.create({url: 'http://desciclopedia.org/wiki/Usu%C3%A1rio:Siphodemos'}) } else { chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Usu%C3%A1rio:Siphodemos'}); };
}

function ounao(){
	if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { chrome.tabs.create({url: 'http://desciclopedia.org/wiki/Ou_n%C3%A3o'}) } else { chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Ou_n%C3%A3o'}); };
}

function dar(){
	if(localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "desciclopedia.ws" && localStorage["alternativo_favorito"] != "pudim.info" && localStorage["alternativo_favorito"] != "vist.as" && localStorage["alternativo_favorito"] != "pesquisa.la" && localStorage["alternativo_favorito"] != "desciclopedia.org" && localStorage["alternativo_favorito"] != "sophia.desciclopedia.org" && localStorage["alternativo_favorito"] != "roberto.desciclopedia.org") { chrome.tabs.create({url: 'http://desciclopedia.org/wiki/Dar'}) } else { chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Dar'}); };
}

function shareFacebook(){
	window.open('https://www.facebook.com/sharer/sharer.php?u=http://desciclopedia.org/wiki/Usu%C3%A1rio:%C3%81s/DescicloApp', '', 'width=657,height=367')
}

function shareTwitter(){
	window.open('https://twitter.com/intent/tweet?source=webclient&text=Estou+usando+o+DescicloApp,+um+aplicativo+@DaDesciclopedia,+o+%C3%BAnico+aprovado+por+Chuck+Norris,+baixe+voc%C3%AA+tamb%C3%A9m%21%21+http://vales.ca/descicloapp', '', 'width=600,height=257')
}

function shareGooglePlus(){
	window.open('https://plus.google.com/share?url=http://desciclopedia.org/wiki/Usu%C3%A1rio:%C3%81s/DescicloApp', '', 'width=600,height=400')
}

window.onload=function(){
	$('hr').css('background-color',localStorage.getItem('cor-favorita'));
	$('#faq').click(function(){  
		window.location="faq.html";
	});
	$('#changelog').click(function() {   
		window.location="changelog.html";
	});
	$('#opcoes').click( function() {  
		window.location="opcoes.html";
	});
	$('#sobre').click(function() { 
		window.location="sobre.html";
	});
	$('#voce').click(function() { voce() });
	$('#servidor').click(function() { servidor() });
	$('#store').click(function() { store() });
	$('#yourbase').click(function() { yourbase() });
	$('#me').click(function() { usuario() });
	$('#descicloapp').click(function() { descicloApp() });
	$('#info').click(function() { descicloApp() });
	$('#opera').click(function() { opera() });
	$('#firefox').click(function() { firefox() });
	$('#versao').html(localStorage.getItem('version').substring(1,localStorage.getItem('version').length - 1));
	$('#usuario').click(function() { usuario() });
	$('#usuario').html('http://' + pagina + '/wiki/Usu&aacute;rio:&Aacute;s');
	$('#mensagem').click(function() { mensagem() });
	$('#johnny').click(function() { johnny() });
	$('#sipho').click(function() { sipho() });
	$('#ounao').click(function() { ounao() });
	$('#dar').click(function() { dar() });
	$('#sharefacebook').click(function() { shareFacebook() });
	$('#sharetwitter').click(function() { shareTwitter() });
	$('#sharegoogleplus').click(function() { shareGooglePlus() });
}