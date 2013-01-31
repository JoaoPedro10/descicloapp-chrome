function salvar() {
  var select = document.getElementById("alternativo");
  var alternativo = select.children[select.selectedIndex].value;
  localStorage["alternativo_favorito"] = alternativo;
  localStorage["hr-color"] = document.getElementById("background-color").value;
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
		$('#amostra').css('background-color',document.getElementById("background-color").value);
		$('#amostra2').css('background-color',document.getElementById("background-color").value);
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
	$('#descicloapp').click(function() { descicloApp() });
	$('#salvar').click(function() { salvar() });
	restaurar();
}