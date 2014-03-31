window.onload = function () {
	if (localStorage.getItem('botaoirpopup') != "false") {
		document.getElementById("irpopup").checked = true;
	} else {
		document.getElementById("irpopup").checked = false;
	};
	if (localStorage.getItem('botaopaginapopup') != "false") {
		document.getElementById("paginapopup").checked = true;
	} else {
		document.getElementById("paginapopup").checked = false;
	};
	if (localStorage.getItem('botaodiscussaopopup') != "false") {
		document.getElementById("discussaopopup").checked = true;
	} else {
		document.getElementById("discussaopopup").checked = false;
	};
	if (localStorage.getItem('botaocontribuicoespopup') != "false") {
		document.getElementById("contribuicoespopup").checked = true;
	} else {
		document.getElementById("contribuicoespopup").checked = false;
	};
	if (localStorage.getItem('botaovigiadaspopup') != "false") {
		document.getElementById("vigiadaspopup").checked = true;
	} else {
		document.getElementById("vigiadaspopup").checked = false;
	};
	if (localStorage.getItem('botaocarregarpopup') != "false") {
		document.getElementById("carregarpopup").checked = true;
	} else {
		document.getElementById("carregarpopup").checked = false;
	};
	if (localStorage.getItem('botaoaleatoriopopup') != "false") {
		document.getElementById("aleatoriopopup").checked = true;
	} else {
		document.getElementById("aleatoriopopup").checked = false;
	};
	if (localStorage.getItem('botaomensagempopup') != "false") {
		document.getElementById("mensagempopup").checked = true;
	} else {
		document.getElementById("mensagempopup").checked = false;
	};
	if (localStorage.getItem('botaomudancasrecentespopup') != "false") {
		document.getElementById("mudancasrecentespopup").checked = true;
	} else {
		document.getElementById("mudancasrecentespopup").checked = false;
	};
	if (localStorage.getItem('botaomaispopup') != "false") {
		document.getElementById("maispopup").checked = true;
	} else {
		document.getElementById("maispopup").checked = false;
	};
	if (localStorage.getItem('botaobotecopopup') != "false") {
		document.getElementById("botecopopup").checked = true;
	} else {
		document.getElementById("botecopopup").checked = false;
	};
	if (localStorage.getItem('botaomesapopup') != "false") {
		document.getElementById("mesapopup").checked = true;
	} else {
		document.getElementById("mesapopup").checked = false;
	};
	if (localStorage.getItem('botaoaapopup') != "false") {
		document.getElementById("aapopup").checked = true;
	} else {
		document.getElementById("aapopup").checked = false;
	};
	if (localStorage.getItem('botaodesnoticiaspopup') != "false") {
		document.getElementById("desnoticiaspopup").checked = true;
	} else {
		document.getElementById("desnoticiaspopup").checked = false;
	};
	if (localStorage.getItem('botaodescionariopopup') != "false") {
		document.getElementById("descionariopopup").checked = true;
	} else {
		document.getElementById("descionariopopup").checked = false;
	};
	if (localStorage.getItem('botaodeslivrospopup') != "false") {
		document.getElementById("deslivrospopup").checked = true;
	} else {
		document.getElementById("deslivrospopup").checked = false;
	};
	if (localStorage.getItem('botaodespoesiaspopup') != "false") {
		document.getElementById("despoesiaspopup").checked = true;
	} else {
		document.getElementById("despoesiaspopup").checked = false;
	};
	if (localStorage.getItem('botaodescifraspopup') != "false") {
		document.getElementById("descifraspopup").checked = true;
	} else {
		document.getElementById("descifraspopup").checked = false;
	};
	if (localStorage.getItem('botaodesentrevistaspopup') != "false") {
		document.getElementById("desentrevistaspopup").checked = true;
	} else {
		document.getElementById("desentrevistaspopup").checked = false;
	};
	if (localStorage.getItem('botaodescitacoespopup') != "false") {
		document.getElementById("descitacoespopup").checked = true;
	} else {
		document.getElementById("descitacoespopup").checked = false;
	};
	if (localStorage.getItem('botaodeslistaspopup') != "false") {
		document.getElementById("deslistaspopup").checked = true;
	} else {
		document.getElementById("deslistaspopup").checked = false;
	};
	if (localStorage.getItem('botaofatospopup') != "false") {
		document.getElementById("fatospopup").checked = true;
	} else {
		document.getElementById("fatospopup").checked = false;
	};
	if (localStorage.getItem('botaofacebookpopup') != "false") {
		document.getElementById("facebookpopup").checked = true;
	} else {
		document.getElementById("facebookpopup").checked = false;
	};
	if (localStorage.getItem('botaotwitterpopup') != "false") {
		document.getElementById("twitterpopup").checked = true;
	} else {
		document.getElementById("twitterpopup").checked = false;
	};
	if (localStorage.getItem('botaodptoolbar') != "false") {
		document.getElementById("dptoolbarpopup").checked = true;
	} else {
		document.getElementById("dptoolbarpopup").checked = false;
	};
	$('hr').css('background-color', localStorage.getItem('cor-favorita'));
	$("#irpopup").change(function () {
		localStorage["botaoirpopup"] = document.getElementById("irpopup").checked;
	});
	$("#paginapopup").change(function () {
		localStorage["botaopaginapopup"] = document.getElementById("paginapopup").checked;
	});
	$("#discussaopopup").change(function () {
		localStorage["botaodiscussaopopup"] = document.getElementById("discussaopopup").checked;
	});
	$("#contribuicoespopup").change(function () {
		localStorage["botaocontribuicoespopup"] = document.getElementById("contribuicoespopup").checked;
	});
	$("#vigiadaspopup").change(function () {
		localStorage["botaovigiadaspopup"] = document.getElementById("vigiadaspopup").checked;
	});
	$("#carregarpopup").change(function () {
		localStorage["botaocarregarpopup"] = document.getElementById("carregarpopup").checked;
	});
	$("#aleatoriopopup").change(function () {
		localStorage["botaoaleatoriopopup"] = document.getElementById("aleatoriopopup").checked;
	});
	$("#mensagempopup").change(function () {
		localStorage["botaomensagempopup"] = document.getElementById("mensagempopup").checked;
	});
	$("#mudancasrecentespopup").change(function () {
		localStorage["botaomudancasrecentespopup"] = document.getElementById("mudancasrecentespopup").checked;
	});
	$("#maispopup").change(function () {
		localStorage["botaomaispopup"] = document.getElementById("maispopup").checked;
	});
	$("#botecopopup").change(function () {
		localStorage["botaobotecopopup"] = document.getElementById("botecopopup").checked;
	});
	$("#mesapopup").change(function () {
		localStorage["botaomesapopup"] = document.getElementById("mesapopup").checked;
	});
	$("#aapopup").change(function () {
		localStorage["botaoaapopup"] = document.getElementById("aapopup").checked;
	});
	$("#desnoticiaspopup").change(function () {
		localStorage["botaodesnoticiaspopup"] = document.getElementById("desnoticiaspopup").checked;
	});
	$("#descionariopopup").change(function () {
		localStorage["botaodescionariopopup"] = document.getElementById("descionariopopup").checked;
	});
	$("#deslivrospopup").change(function () {
		localStorage["botaodeslivrospopup"] = document.getElementById("deslivrospopup").checked;
	});
	$("#despoesiaspopup").change(function () {
		localStorage["botaodespoesiaspopup"] = document.getElementById("despoesiaspopup").checked;
	});
	$("#descifraspopup").change(function () {
		localStorage["botaodescifraspopup"] = document.getElementById("descifraspopup").checked;
	});
	$("#desentrevistaspopup").change(function () {
		localStorage["botaodesentrevistaspopup"] = document.getElementById("desentrevistaspopup").checked;
	});
	$("#descitacoespopup").change(function () {
		localStorage["botaodescitacoespopup"] = document.getElementById("descitacoespopup").checked;
	});
	$("#deslistaspopup").change(function () {
		localStorage["botaodeslistaspopup"] = document.getElementById("deslistaspopup").checked;
	});
	$("#fatospopup").change(function () {
		localStorage["botaofatospopup"] = document.getElementById("fatospopup").checked;
	});
	$("#facebookpopup").change(function () {
		localStorage["botaofacebookpopup"] = document.getElementById("facebookpopup").checked;
	});
	$("#twitterpopup").change(function () {
		localStorage["botaotwitterpopup"] = document.getElementById("twitterpopup").checked;
	});
	$("#dptoolbarpopup").change(function () {
		localStorage["botaodptoolbar"] = document.getElementById("dptoolbarpopup").checked;
	});
}
