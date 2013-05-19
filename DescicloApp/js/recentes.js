function novaguia(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Special:Recentchanges/250')
}

window.onload = function(){
	$('hr').css('background-color',localStorage.getItem('cor-favorita'));
	$('#voltar').click(function(){  
		window.location="../popup.html";
	});
	$('#novaguia').click(function() { novaguia() });
}