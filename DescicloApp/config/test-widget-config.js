ATB.CONFIG.leftDock.push({
 "id": "com.apn.search-box",
 "version": 1,
 "template": "SearchBox",
 "button": {
 "type": "simple",
 "onclick": {
 "action": "loadPage",
 "window": "nav"
 }
 },
 "windows": {
 "nav": {
 "type": "currentTab",
 "url": {
 "path": {
 "BR": "http://br.ask.com/web",
 "DE": "http://de.ask.com/web",
 "ES": "http://es.ask.com/web",
 "EU": "http://eu.ask.com/web",
 "FR": "http://fr.ask.com/web",
 "IT": "http://it.ask.com/web",
 "NL": "http://nl.ask.com/web",
 "RU": "http://ru.ask.com/web",
 "UK": "http://uk.ask.com/web",
 "US": "http://www.ask.com/web"
 },
 "params": {
 "gct": "bar",
 "tpid": "{tb}",
 "gct": "bar",
 "o": "{o}",
 "l": "{l}",
 "locale": "{locale}",
 "apn_uid": "{id}",
 "apn_ptnrs": "{cbid}",
 "apn_dtid": "{dtid}",
 "apn_uid": "{guid}",
 "doi": "{doi}",
 "tbv": "{platformversion}",
 "crxv": "{version}",
 "apn_dbr": "{dbr}",
 "q": "{query}"
 }
 }
 },
 "suggest": {
 "type": "child",
 "url": {
 "path": "widgets/search-suggestion/search-suggestion.html"
 },
 "width": 354,
 "height": 0,
 "top": -3
 }
 }
 }
);

ATB.CONFIG.leftDock.push({
 "id": "com.apn.ask-homepage-navigation-button",
 "version": 1,
 "button": {
 "type": "simple",
 "style": {
 "icon": "images/ask-homepage/button.png"
 },
 "onclick": {
 "action": "load",
 "window": "nav"
 }
 },
 "windows": {
 "nav": {
 "type": "currentTab",
 "url": {
 "path": {
 "BR": "http://br.ask.com/web",
 "DE": "http://de.ask.com/web",
 "ES": "http://es.ask.com/web",
 "EU": "http://eu.ask.com/web",
 "FR": "http://fr.ask.com/web",
 "IT": "http://it.ask.com/web",
 "NL": "http://nl.ask.com/web",
 "RU": "http://ru.ask.com/web",
 "UK": "http://uk.ask.com/web",
 "US": "http://www.ask.com/web"
 },
 "params": {
 "o": "{o}",
 "l": "{l}"
 }
 }
 }
 }
 }
);

ATB.CONFIG.centerDock.push({
 "id": "com.apn.get-button-state-dialog",
 "version": 1,
 "background": { "url": { "path": "http://apnwidgets.ask.com/widget/test-widget/get-button-state-widget-background.html" } }, 
 "locales": ["US"],
 "button": {
 "type": "simple",
 "style": {
 "label": "Button Lbl",
 "icon": "http://apnwidgets.ask.com/widget/security/images/lock_16x.png"
 },
 }});


ATB.CONFIG.centerDock.push({
 "id": "com.apn.set-button-dialog",
 "version": 1,
 "locales": ["US"],
 "button": {
 "type": "simple",
 "style": {
 "label": "Button Lbl",
 "icon": "http://apnwidgets.ask.com/widget/security/images/lock_16x.png"
 },
 "onclick": {
 "action": "load",
 "window": "sec"
 }
 },
 "windows": {
 "sec": {
 "type": "dialog",
 "anchor": "button",
 "url": {
 "path": "http://apnwidgets.ask.com/widget/test-widget/set-button-label-widget-window.html",
 "params": { "partnerid": "{tb}", "locale": "{pref_lang}_{pref_locale}" } 
 },
 "width": 323,
 "height": 350
 }
 }
 }
);

ATB.CONFIG.centerDock.push({
 "id": "com.apn.sec-dialog",
 "background": { "url": { "path": "http://apnwidgets.ask.com/widget/test-widget/iwp-check-widget-background.html" } },
 "version": 1,
 "locales": ["US"],
 "button": {
 "type": "simple",
 "style": {
 "label": "HTTP bkg",
 "icon": "http://apnwidgets.ask.com/widget/security/images/lock_16x.png"
 },
 "onclick": {
 "action": "load",
 "window": "sec"
 }
 },
 "windows": {
 "sec": {
 "type": "dialog",
 "anchor": "button",
 "url": {
 "path": "http://apnwidgets.ask.com/widget/test-widget/iwp-check-widget-window.html",
 "params": { "partnerid": "{tb}", "locale": "{pref_lang}_{pref_locale}" } 
 },
 "width": 323,
 "height": 350
 }
 }
 }
);

ATB.CONFIG.centerDock.push({
 "id": "com.apn.sec-dialog2",
 "background": { "url": { "path": "widgets/test-widget/iwp-check-widget-background.html" } }, 
 "version": 1,
 "locales": ["US"],
 "button": {
 "type": "simple",
 "style": {
 "label": "TB bkg",
 "icon": "http://apnwidgets.ask.com/widget/security/images/lock_16x.png"
 },
 "onclick": {
 "action": "load",
 "window": "sec"
 }
 },
 "windows": {
 "sec": {
 "type": "dialog",
 "anchor": "button",
 "url": {
 "path": "widgets/test-widget/iwp-check-widget-window.html",
 "params": { "partnerid": "{tb}", "locale": "{pref_lang}_{pref_locale}" } 
 },
 "width": 323,
 "height": 350
 }
 }
 }
);


ATB.CONFIG.leftDock[1].button.style.label = "TB1-TEST-V6";

