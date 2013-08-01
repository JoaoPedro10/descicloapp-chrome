if(localStorage.getItem('descicloguia') != "false") {
	window.onload = function(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Especial:Aleat%C3%B3ria', '_self');
	} } else {
	chrome.tabs.update({url:"chrome-internal://newtab/"});
}