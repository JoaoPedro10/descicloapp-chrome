function novaguia() {
	window.open('http://twitter.com/DaDesciclopedia')
}

window.onload = function () {
	$('hr').css('background-color', localStorage.getItem('cor-favorita'));
	$('#voltar').click(function () {
		window.location = "../popup.html";
	});
	$('#novaguia').click(function () {
		novaguia()
	});
}
