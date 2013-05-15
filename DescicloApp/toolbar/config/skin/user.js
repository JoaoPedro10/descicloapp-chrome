var icone=localStorage.getItem('coricone');

window.onload = function(){
		$('#toolbar-search-right').css({'background-image':'url(../../../../' + icone + ')', 'background-color':localStorage.getItem('cor-favorita'), 'background-size': '20px', 'background-repeat': 'no-repeat', 'background-position': 'center'});
}