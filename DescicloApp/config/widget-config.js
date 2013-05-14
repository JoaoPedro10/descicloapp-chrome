ATB.CONFIG.leftDock.push({ "id": "com.apn.desciclo", "version": 1, "minplatformversion": "2.0.0", "maxplatformversion": "2.0.0", "button": { "type": "simple", "style": { "icon": "widgets/desciclopedia/desciclopedia.png", "title": "Desciclop\u00E9dia" }, "onclick": { "action": "load", "window": "nav" } }, "windows": { "nav": { "type": "currentTab", "url": { "path": "widgets/desciclopedia/desciclopedia.html", } } } }); ATB.CONFIG.leftDock.push({ "id": "com.apn.search-box", "version": 1, "button": { "template": "SearchBox" }, "windows": { "nav": { "type": "currentTab", "url": { "path": "widgets/desciclobusca/desciclobusca.html", "params": { "q": "{query}" } } } } });

ATB.CONFIG.centerDock.push({ "id": "com.apn.pagina", "version": "1", "minplatformversion": "2.0.0", "maxplatformversion": "2.0.0", "button": { "type": "simple", "style": { "icon": "widgets/pagina/pagina.png", "title": "Minha p\u00E1gina" }, "onclick": { "action": "loadPage", "window": "nav" } }, "windows": { "nav": { "type": "currentTab", "url": { "path": "widgets/pagina/pagina.html", "params": { "q": "{query}" } } } } });

ATB.CONFIG.centerDock.push({ "id": "com.apn.discussao", "version": "1", "minplatformversion": "2.0.0", "maxplatformversion": "2.0.0", "button": { "type": "simple", "style": { "icon": "widgets/discussao/discussao.png", "title": "Minha discuss\u00E3o" }, "onclick": { "action": "loadPage", "window": "nav" } }, "windows": { "nav": { "type": "currentTab", "url": { "path": "widgets/discussao/discussao.html", "params": { "q": "{query}" } } } } });

ATB.CONFIG.centerDock.push({ "id": "com.apn.contribuicoes", "version": "1", "minplatformversion": "2.0.0", "maxplatformversion": "2.0.0", "button": { "type": "simple", "style": { "icon": "widgets/contribuicoes/contribuicoes.png", "title": "Minhas contribui\u00E7\u00f5es" }, "onclick": { "action": "loadPage", "window": "nav" } }, "windows": { "nav": { "type": "currentTab", "url": { "path": "widgets/contribuicoes/contribuicoes.html", "params": { "q": "{query}" } } } } });

ATB.CONFIG.centerDock.push({ "id": "com.apn.vigiadas", "version": "1", "button": { "type": "simple", "style": { "icon": "widgets/vigiadas/vigiadas.png", "title": "P\u00E1gina vigiadas" }, "onclick": { "action": "loadPage", "window": "nav" } }, "windows": { "nav": { "type": "currentTab", "url": { "path": "widgets/vigiadas/vigiadas.html" } } } });

ATB.CONFIG.centerDock.push({ "id": "com.apn.carregar", "version": "1", "minplatformversion": "2.0.0", "maxplatformversion": "2.0.0", "button": { "type": "simple", "style": { "icon": "widgets/carregar/carregar.png", "title": "Carregar arquivo" }, "onclick": { "action": "loadPage", "window": "nav" } }, "windows": { "nav": { "type": "currentTab", "url": { "path":  "widgets/carregar/carregar.html" } } } });ATB.CONFIG.centerDock.push({ "id": "com.apn.mensagem", "version": "1", "minplatformversion": "2.0.0", "maxplatformversion": "2.0.0", "button": { "type": "simple", "style": { "icon": "widgets/mensagem/mensagem.png", "title": "Enviar mensagem" }, "onclick": { "action": "load", "window": "widget" } }, "windows": { "widget": { "type": "dialog", "url": { "path": "widgets/mensagem/mensagem.html", }, "width": 320, "height": 250 } } }); 
ATB.CONFIG.centerDock.push({ "id": "com.apn.recentes", "version": "1", "minplatformversion": "2.0.0", "maxplatformversion": "2.0.0", "button": { "type": "simple", "style": { "icon": "widgets/recentes/recentes.png", "title": "Mudan\u00E7as recentes" }, "onclick": { "action": "load", "window": "widget" } }, "windows": { "widget": { "type": "dialog", "url": { "path": "widgets/recentes/recentes.html", }, "width": 600, "height": 600 } } });
ATB.CONFIG.rightDock.push({ "id": "com.apn.facebook", "version": "1", "minplatformversion": "2.0.0", "maxplatformversion": "2.0.0", "button": { "type": "simple", "style": { "icon": "widgets/facebook/facebook.png", "title": "Facebook" }, "onclick": { "action": "loadPage", "window": "nav" } }, "windows": { "nav": { "type": "newTab", "url": { "path": "http://facebook.com/Desciclopedia" } } } }); ATB.CONFIG.rightDock.push({ "id": "com.apn.options", "version": "1", "minplatformversion": "2.0.0", "maxplatformversion": "2.0.0", "button": { "type": "simple", "style": { "icon": "widgets/twitter/twitter.png", "title": "Twitter" }, "onclick": { "action": "loadPage", "window": "nav" } }, "windows": { "nav": { "type": "newTab", "url": { "path": "http://twitter.com/DaDesciclopedia" } } } }); 
ATB.CONFIG.rightDock.push({ "id": "com.apn.options", "version": "1", "minplatformversion": "2.0.0", "maxplatformversion": "2.0.0", "button": { "type": "simple", "style": { "icon": "widgets/options/options.png", "title": "Op\u00E7\u00f5es" }, "onclick": { "action": "loadPage", "window": "nav" } }, "windows": { "nav": { "type": "newTab", "url": { "path": "../paginas/opcoes.html" } } } });
