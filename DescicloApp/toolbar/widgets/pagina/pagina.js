window.onload = function(){
	  if(_GET("q") != "{query}") { window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Usu%C3%A1rio:' + _GET("q"), '_self')} else { window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Especial:Minha_p%C3%A1gina', '_self')};
function _GET(name)
{
  var url   = window.location.search.replace("?", "");
  var itens = url.split("&");

  for(n in itens)
  {
    if( itens[n].match(name) )
    {
      return decodeURIComponent(itens[n].replace(name+"=", ""));
    }
  }
  return null;
}
}