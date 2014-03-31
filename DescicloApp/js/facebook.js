function novaguia() {
	window.open('http://facebook.com/Desciclopedia')
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
