function recentes(){
	chrome.tabs.create({url: 'http://' + document.getElementById('alternativo').value + '/wiki/Special:Recentchanges/250'}) }
}

window.onload = function(){
	document.getElementById('recentes').onclick=recentes;
}