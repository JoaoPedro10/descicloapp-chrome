function salvar() {
  var select = document.getElementById("alternativo");
  var alternativo = select.children[select.selectedIndex].value;
  localStorage["alternativo_favorito"] = alternativo;
  localStorage["hr-color"] = document.getElementById("hr-color").value;
  if(username.value != "") { localStorage["hifen"] = '&nbsp;-&nbsp'; } else { localStorage["hifen"] = ''};
  localStorage["username"] = document.getElementById("username").value;
  $('#app-desciclopedia').html('Quer ter um atalho/&iacute;cone da Desciclop&eacute;dia na Nova guia que te leva a p&aacute;gina inicial? <a href="http://desciclopedia.org/wiki/Usu%C3%A1rio:%C3%81s/DescicloApp/Chrome/App" target="_blank">Clique aqui</a>!!');
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
		$('#amostra').css('background-color',document.getElementById("hr-color").value);
		$('#amostra2').css('background-color',document.getElementById("hr-color").value);
		$('#amostra3').css('background-color',document.getElementById("hr-color").value);
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
	document.getElementById("hr-color").value = localStorage.getItem('hr-color');
	document.getElementById("username").value = localStorage.getItem('username');
	$('#descicloapp').click(function() { descicloApp() });
	$('#salvar').click(function() { salvar() });
	restaurar();
}
