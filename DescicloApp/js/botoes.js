window.onload = function () {
	if (localStorage.getItem('botaopagina') != "false") {
		document.getElementById("pagina").checked = true;
	} else {
		document.getElementById("pagina").checked = false;
	};
	if (localStorage.getItem('botaodiscussao') != "false") {
		document.getElementById("discussao").checked = true;
	} else {
		document.getElementById("discussao").checked = false;
	};
	if (localStorage.getItem('botaocontribuicoes') != "false") {
		document.getElementById("contribuicoes").checked = true;
	} else {
		document.getElementById("contribuicoes").checked = false;
	};
	if (localStorage.getItem('botaovigiadas') != "false") {
		document.getElementById("vigiadas").checked = true;
	} else {
		document.getElementById("vigiadas").checked = false;
	};
	if (localStorage.getItem('botaocarregar') != "false") {
		document.getElementById("carregar").checked = true;
	} else {
		document.getElementById("carregar").checked = false;
	};
	if (localStorage.getItem('botaoaleatorio') != "false") {
		document.getElementById("aleatorio").checked = true;
	} else {
		document.getElementById("aleatorio").checked = false;
	};
	if (localStorage.getItem('botaomensagem') != "false") {
		document.getElementById("mensagem").checked = true;
	} else {
		document.getElementById("mensagem").checked = false;
	};
	if (localStorage.getItem('botaorecentes') != "false") {
		document.getElementById("recentes").checked = true;
	} else {
		document.getElementById("recentes").checked = false;
	};
	if (localStorage.getItem('botaoboteco') != "false") {
		document.getElementById("boteco").checked = true;
	} else {
		document.getElementById("boteco").checked = false;
	};
	if (localStorage.getItem('botaomesa') != "false") {
		document.getElementById("mesa").checked = true;
	} else {
		document.getElementById("mesa").checked = false;
	};
	if (localStorage.getItem('botaoaa') != "false") {
		document.getElementById("aa").checked = true;
	} else {
		document.getElementById("aa").checked = false;
	};
	if (localStorage.getItem('botaodesnoticias') != "false") {
		document.getElementById("desnoticias").checked = true;
	} else {
		document.getElementById("desnoticias").checked = false;
	};
	if (localStorage.getItem('botaodescionario') != "false") {
		document.getElementById("descionario").checked = true;
	} else {
		document.getElementById("descionario").checked = false;
	};
	if (localStorage.getItem('botaodeslivros') != "false") {
		document.getElementById("deslivros").checked = true;
	} else {
		document.getElementById("deslivros").checked = false;
	};
	if (localStorage.getItem('botaodespoesias') != "false") {
		document.getElementById("despoesias").checked = true;
	} else {
		document.getElementById("despoesias").checked = false;
	};
	if (localStorage.getItem('botaodescifras') != "false") {
		document.getElementById("descifras").checked = true;
	} else {
		document.getElementById("descifras").checked = false;
	};
	if (localStorage.getItem('botaodesentrevistas') != "false") {
		document.getElementById("desentrevistas").checked = true;
	} else {
		document.getElementById("desentrevistas").checked = false;
	};
	if (localStorage.getItem('botaodescitacoes') != "false") {
		document.getElementById("descitacoes").checked = true;
	} else {
		document.getElementById("descitacoes").checked = false;
	};
	if (localStorage.getItem('botaodeslistas') != "false") {
		document.getElementById("deslistas").checked = true;
	} else {
		document.getElementById("deslistas").checked = false;
	};
	if (localStorage.getItem('botaofatos') != "false") {
		document.getElementById("fatos").checked = true;
	} else {
		document.getElementById("fatos").checked = false;
	};
	if (localStorage.getItem('botaofacebook') != "false") {
		document.getElementById("facebook").checked = true;
	} else {
		document.getElementById("facebook").checked = false;
	};
	if (localStorage.getItem('botaotwitter') != "false") {
		document.getElementById("twitter").checked = true;
	} else {
		document.getElementById("twitter").checked = false;
	};
	$('hr').css('background-color', localStorage.getItem('cor-favorita'));
	$("#pagina").change(function () {
		localStorage["botaopagina"] = document.getElementById("pagina").checked;
	});
	$("#discussao").change(function () {
		localStorage["botaodiscussao"] = document.getElementById("discussao").checked;
	});
	$("#contribuicoes").change(function () {
		localStorage["botaocontribuicoes"] = document.getElementById("contribuicoes").checked;
	});
	$("#vigiadas").change(function () {
		localStorage["botaovigiadas"] = document.getElementById("vigiadas").checked;
	});
	$("#carregar").change(function () {
		localStorage["botaocarregar"] = document.getElementById("carregar").checked;
	});
	$("#aleatorio").change(function () {
		localStorage["botaoaleatorio"] = document.getElementById("aleatorio").checked;
	});
	$("#mensagem").change(function () {
		localStorage["botaomensagem"] = document.getElementById("mensagem").checked;
	});
	$("#recentes").change(function () {
		localStorage["botaorecentes"] = document.getElementById("recentes").checked;
	});
	$("#boteco").change(function () {
		localStorage["botaoboteco"] = document.getElementById("boteco").checked;
	});
	$("#mesa").change(function () {
		localStorage["botaomesa"] = document.getElementById("mesa").checked;
	});
	$("#aa").change(function () {
		localStorage["botaoaa"] = document.getElementById("aa").checked;
	});
	$("#desnoticias").change(function () {
		localStorage["botaodesnoticias"] = document.getElementById("desnoticias").checked;
	});
	$("#descionario").change(function () {
		localStorage["botaodescionario"] = document.getElementById("descionario").checked;
	});
	$("#deslivros").change(function () {
		localStorage["botaodeslivros"] = document.getElementById("deslivros").checked;
	});
	$("#despoesias").change(function () {
		localStorage["botaodespoesias"] = document.getElementById("despoesias").checked;
	});
	$("#descifras").change(function () {
		localStorage["botaodescifras"] = document.getElementById("descifras").checked;
	});
	$("#desentrevistas").change(function () {
		localStorage["botaodesentrevistas"] = document.getElementById("desentrevistas").checked;
	});
	$("#descitacoes").change(function () {
		localStorage["botaodescitacoes"] = document.getElementById("descitacoes").checked;
	});
	$("#deslistas").change(function () {
		localStorage["botaodeslistas"] = document.getElementById("deslistas").checked;
	});
	$("#fatos").change(function () {
		localStorage["botaofatos"] = document.getElementById("fatos").checked;
	});
	$("#facebook").change(function () {
		localStorage["botaofacebook"] = document.getElementById("facebook").checked;
	});
	$("#twitter").change(function () {
		localStorage["botaotwitter"] = document.getElementById("twitter").checked;
	});
}
