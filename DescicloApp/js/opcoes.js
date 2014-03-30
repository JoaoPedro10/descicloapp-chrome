function salvar() {
  var select = document.getElementById("alternativo");
  var alternativo = select.children[select.selectedIndex].value;
  if(alternativo != "outro") { localStorage["alternativo_favorito"] = alternativo;
  } else { localStorage["alternativo_favorito"] = document.getElementById("dominio").value; localStorage["napopup"] = document.getElementById("napopup").value; };
  //apenas pro usuario entender o que e o na popup
  if(alternativo == "desciclopedia.org") { localStorage["napopup"] = ".org" }; if(alternativo == "desciclopedia.ws") { localStorage["napopup"] = ".ws" }; if(alternativo == "pudim.info") { localStorage["napopup"] = ".info" }; if(alternativo == "vist.as") { localStorage["napopup"] = ".as" }; if(alternativo == "pesquisa.la") { localStorage["napopup"] = ".la" }; if(alternativo == "desnoticias.org") { localStorage["napopup"] = "desnoticias.org" }; if(alternativo == "sophia.desciclopedia.org") { localStorage["napopup"] = "sophia." }; if(alternativo == "roberto.desciclopedia.org") { localStorage["napopup"] = "roberto." };
  localStorage["cor-favorita"] = document.getElementById("cor-favorita").value;
  localStorage["botaomais"] = document.getElementById("botaomais").checked;
  localStorage["barrabusca"] = document.getElementById("barrabusca").checked;
  localStorage["buscacontexto"] = document.getElementById("buscacontextosim").checked;
  localStorage["descicloguia"] = document.getElementById("descicloguiasim").checked;
  localStorage["barrabuscapopup"] = document.getElementById("barrabuscapopup").checked;
  if(document.getElementById("coricone").checked == true) { localStorage["coricone"] = document.getElementById("coricone").value; localStorage["iricone"] = "imagens/avancarwp7.png"; localStorage["editaricone"] = "imagens/novowp7.png"; localStorage["pesquisaricone"] = "imagens/buscawp7.png"; localStorage["cor2"] = "#000000"; } else { localStorage["coricone"] = document.getElementById("coricone2").value; localStorage["iricone"] = "imagens/avancarwp7b.png"; localStorage["editaricone"] = "imagens/novowp7b.png"; localStorage["pesquisaricone"] = "imagens/buscawp7b.png"; localStorage["cor2"] = "#ffffff"; };
  if(username.value != "") { localStorage["hifen"] = '&nbsp;-&nbsp'; } else { localStorage["hifen"] = ''};
  // se o usuario mudar o username apagar o antigo e deixar so o novo
  if(document.getElementById("username").value != localStorage["username"]) { localStorage.setItem('pages_to_check', '{}') }
  localStorage["username"] = document.getElementById("username").value;
  if(username.value == "") { if(confirm('Para ativar as notifica\u00e7\u00F5es, escreva seu username primeiro')) { document.getElementById("notifmsg").checked = false; } else { document.getElementById("notifmsg").checked = false; } }
  if(document.getElementById("notifmsg").checked == true) { AtivarNotificacoes(); localStorage.setItem('notifmsg', 'true') } else { localStorage.setItem('pages_to_check', '{}'); localStorage.setItem('notifmsg', 'false') };
  if(document.getElementById("username").value == "") { localStorage.setItem('pages_to_check', '{}'); localStorage.setItem('notifmsg', 'false') };
  if(document.getElementById("desciclotoolbar").checked == true) { localStorage["pref_tb_is_visible"] = true; } else { localStorage["pref_tb_is_visible"] = false; };
  if(document.getElementById("botaofeedback").checked == true) { localStorage["botaofeedback"] = true; } else { localStorage["botaofeedback"] = false; if(!localStorage.feedback){ new Messi('<iframe id="JotFormIFrame" allowtransparency="true" src="http://aloogle.tumblr.com/descicloapp/feedbackbotaodesativado" frameborder="0" style="width:100%; height:550px; border:none;" scrolling="no"></iframe>', {title: 'Feedback'}); localStorage.feedback = "true"; };};
  $('#app-desciclopedia').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Quer ter um aplicativo da Desciclop&eacute;dia na Nova guia? <a href="http://desciclopedia.org/wiki/Usu%C3%A1rio:%C3%81s/DescicloApp/Chrome/App" target="_blank">Clique aqui</a>!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
  salvarn();
}

function redefinir() {
	//Apenas para evitar conflitos com as notificacoes no background
	bg.location.reload()
	chrome.notifications.create("redef", { type: "basic", iconUrl: "../icons/icon_64.png", title: "DescicloApp", message: "Tem certeza que quer redefinir as configura\u00e7\u00F5es?", buttons: [{ title: 'Sim', iconUrl: '../imagens/checkmarkicon.png' }, { title: 'N\u00E3o', iconUrl: '../imagens/x.png' }], priority: 0}, function() {});
	chrome.notifications.onButtonClicked.addListener(function(redef, buttonIndex) {
		if (buttonIndex == 0) {
				localStorage.clear();
				if(!localStorage.storagepadrao){
				localStorage["atualizacao57"] = "true";
				localStorage["atualizacao60"] = "true";
				localStorage["page"] = "true";
				localStorage["alternativo_favorito"] = "desciclopedia.org";
				localStorage["napopup"] = ".org";
				localStorage["cor-favorita"] = "#00ffff";
				localStorage["cor2"] = "black";
				localStorage["username"] = "";
				localStorage["buscacontexto"] = "true";
				localStorage["descicloguia"] = "false";
				localStorage["coricone"] = "imagens/buscawp72.png";
				localStorage["iricone"] = "imagens/avancarwp7.png";
				localStorage["editaricone"] = "imagens/novowp7.png";
				localStorage["pesquisaricone"] = "imagens/buscawp7.png";
				localStorage["botaomais"] = "true";
				localStorage["barrabusca"] = "true";
				localStorage["botaofeedback"] = "true";
				localStorage["primeira"] = "true";
				localStorage["pref_tb_is_visible"] = "false";
				localStorage["barrabuscapopup"] = "true";
				localStorage["pref_tb_is_visible"] = "false";
				localStorage["pages_to_check"] = "{}";
				localStorage["check_interval"] = "5000";
				localStorage.storagepadrao = "true";
				}
				window.location.reload()
				chrome.notifications.clear(redef, function(wasCleared) {});
		} else if (buttonIndex == 1) {
			chrome.notifications.clear(redef, function(wasCleared) {});
		}});
	chrome.notifications.onClicked.addListener(function(redef, byUser) {
		chrome.notifications.clear(redef, function(wasCleared) {});
	});
}

function restaurar() {
  var favorito = localStorage["alternativo_favorito"];
  if (!favorito) {
    return;
  }
  var select = document.getElementById("alternativo");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorito) {
      child.selected = "true";
	  $("#outrod").hide();
      break;
    } else { child.selected = "outro"; $("#outrod").show(); }
  }
}

function descicloApp(){
	chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Usu%C3%A1rio:%C3%81s/DescicloApp'})
}

$(function(){
$('#alternativo').change(function() {
	if($(this).find('option:selected').val() == "outro"){
		$("#outrod").show();
	} else {
		$("#outrod").hide(); }
	});
		$('#form_id').submit(function() {
			var othersOption = $('#alternativo').find('option:selected');
			if(othersOption.val() == "outro") {
				othersOption.val($("#outrod").val());
			}
	});
});

var bg = chrome.extension.getBackgroundPage();
function AtivarNotificacoes() {
	bg.addNewPage('Mensagens', 'http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history', 'chrome-extension://pjglehbpmemdjndlpebplmocdkfjolpj/icons/icon_16.png');
}
    
function markPageMonitored() {
	monitor_label = document.getElementById('monitor_page');
	monitor_label.className = 'util_unlinked';
	monitor_label.onclick = function() {};
      
	var temp = monitor_label.firstElementChild;
	monitor_label.innerHTML = '';
	monitor_label.appendChild(temp);
	monitor_label.innerHTML += ' Page Monitored.';
}
		
$(function(){
	$('.corfavorita').change(function() {
		$('hr').css('background-color',document.getElementById("cor-favorita").value);
		$('#salvar').css('background-color',document.getElementById("cor-favorita").value);
	});
	$('.coriconep').change(function() {
		$('#salvar').css('color','black');
	});
	$('.coriconeb').change(function() {
		$('#salvar').css('color','white');
	});
	$('.contextoaviso').change(function() {
		  $('#contextoavisot').html('<b>NOTA:</b> Essa mudan&ccedil;a s&oacute; ter&aacute; efeito ap&oacute;s voc&ecirc; reiniciar o Google Chrome');
	});
	$('#faq').click(function(){  
		window.location="faq.html";
	});
	$('#changelog').click(function() {   
		window.location="changelog.html";
	});
	$('#opcoes').click(function() {  
		window.location="opcoes.html";
	});
	$('#sobre').click(function() { 
		window.location="sobre.html";
	});
	if(localStorage.getItem('coricone') != "imagens/buscawp72b.png") { document.getElementById("coricone").checked = true; } else { document.getElementById("coricone2").checked = true; };
	if(localStorage.getItem('buscacontexto') != "false") { document.getElementById("buscacontextosim").checked = true; } else { document.getElementById("buscacontextonao").checked = true; };
	if(localStorage.getItem('descicloguia') != "false") { document.getElementById("descicloguiasim").checked = true; } else { document.getElementById("descicloguianao").checked = true; };
	if(localStorage.getItem('pref_tb_is_visible') != "true") { document.getElementById("desciclotoolbar").checked = false; document.getElementById("botaomais").disabled = true; document.getElementById("barrabusca").disabled = true; document.getElementById("botaofeedback").disabled = true; } else { document.getElementById("desciclotoolbar").checked = true; };
	if(localStorage.getItem('notifmsg') != "true") { document.getElementById("notifmsg").checked = false; } else { document.getElementById("notifmsg").checked = true; };
	if(localStorage.getItem('botaomais') != "true") { document.getElementById("botaomais").checked = false; } else { document.getElementById("botaomais").checked = true; };
	if(localStorage.getItem('barrabusca') != "true") { document.getElementById("barrabusca").checked = false; } else { document.getElementById("barrabusca").checked = true; };
	if(localStorage.getItem('botaofeedback') != "true") { document.getElementById("botaofeedback").checked = false; } else { document.getElementById("botaofeedback").checked = true; };
	if(localStorage.getItem('barrabuscapopup') != "true") { document.getElementById("barrabuscapopup").checked = false; } else { document.getElementById("barrabuscapopup").checked = true; };
	document.getElementById("cor-favorita").value = localStorage.getItem('cor-favorita');
	document.getElementById("dominio").value = localStorage.getItem('alternativo_favorito');
	document.getElementById("napopup").value = localStorage.getItem('napopup');
	document.getElementById("username").value = localStorage.getItem('username');
	$('hr').css('background-color',localStorage.getItem('cor-favorita'));
	$('#salvar').css('background-color',localStorage.getItem('cor-favorita'));
	$('#salvar').css('color',localStorage.getItem('cor2'));
	$('#escolhapopup').click(function() { new Messi('<iframe src="botoespopup.html" frameborder="0" style="width:100%; height:515px; border:none;" scrolling="no"></iframe>', {buttons: [{id: 0, label: 'Fechar', val: 'X'}]} )});
	$('#escolha').click(function() { new Messi('<iframe src="botoes.html" frameborder="0" style="width:100%; height:515px; border:none;" scrolling="no"></iframe>', {buttons: [{id: 0, label: 'Fechar', val: 'X'}]} )});
	$('#desciclotoolbar').click(function() {if(document.getElementById("desciclotoolbar").checked == false) { document.getElementById("botaomais").disabled = true; document.getElementById("barrabusca").disabled = true; document.getElementById("botaofeedback").disabled = true; } else { document.getElementById("botaomais").disabled = false; document.getElementById("barrabusca").disabled = false; document.getElementById("botaofeedback").disabled = false; };})
	$('#descicloapp').click(function() { descicloApp() });
	$('#redefinir').click(function() { redefinir() });
	$('#salvar').click(function() { salvar() });
	restaurar();
});