function boteco(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Forum:Boteco');
}

function aa(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Forum:Alco%C3%B3licos_An%C3%B4nimos');
}

function truco(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Forum:Mesa_de_Truco');
}

function desnoticias(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Desnot%C3%ADcias:P%C3%A1gina_principal');
}

function descionario(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Descion%C3%A1rio:P%C3%A1gina_principal');
}

function deslivros(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Deslivros:P%C3%A1gina_principal');
}

function despoesias(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Despoesias:P%C3%A1gina_principal');
}

function descifras(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Descifras:P%C3%A1gina_principal');
}

function desentrevistas(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Desentrevistas:P%C3%A1gina_principal');
}

function descitacoes(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Descita%C3%A7%C3%B5es:P%C3%A1gina_principal');
}

function deslistas(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Deslistas:P%C3%A1gina_principal');
}

function fatos(){
		window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Fatos:P%C3%A1gina_principal');
}

window.onload = function(){
		document.getElementById('truco').onclick=truco;
		document.getElementById('boteco').onclick=boteco;
		document.getElementById('aa').onclick=aa;
		document.getElementById('desnoticias').onclick=desnoticias;
		document.getElementById('descionario').onclick=descionario;
		document.getElementById('deslivros').onclick=deslivros;
		document.getElementById('despoesias').onclick=despoesias;
		document.getElementById('descifras').onclick=descifras;
		document.getElementById('desentrevistas').onclick=desentrevistas;
		document.getElementById('descitacoes').onclick=descitacoes;
		document.getElementById('deslistas').onclick=deslistas;
		document.getElementById('fatos').onclick=fatos;
}