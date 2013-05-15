function salvar() {
  var select = document.getElementById("alternativo");
  var alternativo = select.children[select.selectedIndex].value;
  localStorage["alternativo_favorito"] = alternativo;
  localStorage["cor-favorita"] = document.getElementById("cor-favorita").value;
  localStorage["botaomais"] = document.getElementById("botaomais").checked;
  localStorage["barrabusca"] = document.getElementById("barrabusca").checked;
  if(document.getElementById("coricone").checked == true) { localStorage["coricone"] = document.getElementById("coricone").value; localStorage["iricone"] = "imagens/avancarwp7.png"; localStorage["editaricone"] = "imagens/novowp7.png"; localStorage["pesquisaricone"] = "imagens/buscawp7.png"; } else { localStorage["coricone"] = document.getElementById("coricone2").value; localStorage["iricone"] = "imagens/avancarwp7b.png"; localStorage["editaricone"] = "imagens/novowp7b.png"; localStorage["pesquisaricone"] = "imagens/buscawp7b.png";};
  if(username.value != "") { localStorage["hifen"] = '&nbsp;-&nbsp'; } else { localStorage["hifen"] = ''};
  localStorage["username"] = document.getElementById("username").value;
  if(document.getElementById("desciclotoolbar").checked == true) { localStorage["pref_tb_is_visible"] = true; } else { localStorage["pref_tb_is_visible"] = false; if(!localStorage.jadesativou){ new Messi('<iframe id="JotFormIFrame" allowtransparency="true" src="http://aloogle.tumblr.com/descicloapp/feedbackdptoolbar" frameborder="0" style="width:100%; height:550px; border:none;" scrolling="no"></iframe>', {title: 'DescicloToolbar'}); localStorage.jadesativou = "true"; };};
  if(document.getElementById("botaofeedback").checked == true) { localStorage["botaofeedback"] = true; } else { localStorage["botaofeedback"] = false; if(!localStorage.feedback){ new Messi('<iframe id="JotFormIFrame" allowtransparency="true" src="http://aloogle.tumblr.com/descicloapp/feedbackbotaodesativado" frameborder="0" style="width:100%; height:550px; border:none;" scrolling="no"></iframe>', {title: 'Feedback'}); localStorage.feedback = "true"; };};
  $('#app-desciclopedia').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Quer ter um atalho/&iacute;cone da Desciclop&eacute;dia na Nova guia que te leva a p&aacute;gina inicial? <a href="http://desciclopedia.org/wiki/Usu%C3%A1rio:%C3%81s/DescicloApp/Chrome/App" target="_blank">Clique aqui</a>!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
  salvarn();
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
      break;
    }
  }
}

function descicloApp(){
	chrome.tabs.create({url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Usu%C3%A1rio:%C3%81s/DescicloApp'})
}

window.onload = function() {
	set_css = function() {
		$('hr').css('background-color',document.getElementById("cor-favorita").value);
	};
	if (Modernizr) {
		$('.pickme').change(function() {
			set_css();
		});
			set_css();
	}
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
	if(localStorage.getItem('pref_tb_is_visible') != "true") { document.getElementById("desciclotoolbar").checked = false; document.getElementById("botaomais").disabled = true; document.getElementById("barrabusca").disabled = true; document.getElementById("botaofeedback").disabled = true; } else { document.getElementById("desciclotoolbar").checked = true; };
	if(localStorage.getItem('botaomais') != "true") { document.getElementById("botaomais").checked = false; } else { document.getElementById("botaomais").checked = true; };
	if(localStorage.getItem('barrabusca') != "true") { document.getElementById("barrabusca").checked = false; } else { document.getElementById("barrabusca").checked = true; };
	if(localStorage.getItem('botaofeedback') != "true") { document.getElementById("botaofeedback").checked = false; } else { document.getElementById("botaofeedback").checked = true; };
	document.getElementById("cor-favorita").value = localStorage.getItem('cor-favorita');
	document.getElementById("username").value = localStorage.getItem('username');
	$('hr').css('background-color',localStorage.getItem('cor-favorita'));
	$('#escolha').click(function() { new Messi('<iframe src="botoes.html" frameborder="0" style="width:100%; height:500px; border:none;" scrolling="no"></iframe>', {buttons: [{id: 0, label: 'Fechar', val: 'X'}]} )});
	$('#desciclotoolbar').click(function() {if(document.getElementById("desciclotoolbar").checked == false) { document.getElementById("botaomais").disabled = true; document.getElementById("barrabusca").disabled = true; document.getElementById("botaofeedback").disabled = true; } else { document.getElementById("botaomais").disabled = false; document.getElementById("barrabusca").disabled = false; document.getElementById("botaofeedback").disabled = false; };})
	$('#descicloapp').click(function() { descicloApp() });
	$('#salvar').click(function() { salvar() });
	restaurar();
}