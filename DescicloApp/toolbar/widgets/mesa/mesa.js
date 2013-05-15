window.onload = function(){
	  if(_GET("q") != "{query}") { window.open('http://' + localStorage.getItem('alternativo_favorito') + '/index.php?action=edit&preload=Predefini%C3%A7%C3%A3o%3AForumheader%2FOfftopic&title=Forum%3A' + _GET("q") + '&create=Adicionar+novo+t%C3%B3pico', '_self')} else { window.open('http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Forum:Mesa_de_Truco', '_self')};
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