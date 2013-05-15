window.onload = function(){
	  if(_GET("q") != "{query}") { window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Descita%C3%A7%C3%B5es:' + _GET("q"), '_self')} else { window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Descita%C3%A7%C3%B5es:P%C3%A1gina_principal', '_self')};
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