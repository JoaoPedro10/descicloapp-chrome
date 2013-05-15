window.onload = function(){
	  if(_GET("q") != "{query}") { window.open('http://' + localStorage.getItem('alternativo_favorito') + '/index.php?action=edit&preload=Predefini%C3%A7%C3%A3o%3ANova+descifra&title=Descifras%3A' + _GET("q") + '&create=Criar+p%C3%A1gina', '_self')} else { window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Descifras:P%C3%A1gina_principal', '_self')};
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