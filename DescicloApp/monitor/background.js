var RELIABLE_CHECKPOINT = "http://www.google.com/", DEFAULT_CHECK_INTERVAL = 108E5, RESCHEDULE_DELAY = 9E5, MINIMUM_CHECK_SPACING = 1E3, EPSILON = 500, WATCHDOG_INTERVAL = 9E5, WATCHDOG_TOLERANCE = 12E4;
(function () {
	var a = 0,
	b = null,
	d = !1,
	e = [];
	triggerDesktopNotification = function () {
		if (getSetting(SETTINGS.notifications_enabled) && !(0 < chrome.extension.getViews({
					type : "popup"
				}).length)) {
			var a = getSetting(SETTINGS.notifications_timeout) || 3E4;
			if (chrome.notifications && chrome.notifications.create)
				getAllUpdatedPages(function (a) {
					if (0 != a.length) {
						var c = '',
						c = {
							type : "basic",
							iconUrl : "icons/icon_mensagem.png",
							title : "DescicloApp",
							message : "Voc\u00ea tem novas mensagens!!",
							buttons : [{
									title : 'Ir a minha p\u00E1gina de discuss\u00E3o',
									iconUrl : 'imagens/enviarmensagem.png'
								}
							],
							priority : 2
						};
						e = a;
						chrome.notifications.create("", c, function (a) {
							b = a; setTimeout(function() {chrome.notifications.clear(a, function(wasCleared) {}) },30000);
						})
					}
				}), d || (chrome.notifications.onButtonClicked.addListener(function (a,
							b) {
						var c = e[b];
						chrome.tabs.create({
							url : 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username')
						});
						BG.setPageSettings(c.url, {
							updated : !1
						}, function () {
							updateBadge();
							takeSnapshot(c.url, scheduleCheck);
							triggerDesktopNotification()
						})
					}), d = !0);
		}
	};

	chrome.notifications.onClicked.addListener(function (a) {
		BG.setPageSettings('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history&printable=yes', {
			updated : !1
		}, function () {
			updateBadge();
			takeSnapshot('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history&printable=yes', scheduleCheck);
			triggerDesktopNotification()
		})
	});
	updateBadge = function () {
		getAllUpdatedPages(function (c) {
			c = c.length;
			chrome.browserAction.setBadgeBackgroundColor({
				color : localStorage.getItem('cor-favorita')
			});
			chrome.browserAction.setBadgeText({
				text : c ? String(c) : ""
			});
			c > a && (triggerDesktopNotification());
			a = c
				chrome.browserAction.getBadgeText({}, function (result) {
					if (result == "1") {
						chrome.browserAction.setTitle({
							title : 'DescicloApp: Ei ' + localStorage.getItem('username') + ', voc\u00ea tem novas mensagens'
						})
					} else {
						chrome.browserAction.setTitle({
							title : 'Desciclop\u00E9dia'
						});
					}
				});
		})
	}
})();
(function () {
	var a = 0,
	b = 0;
	actualCheck = function (a, b, c) {
		getAllPages(function (f) {
			function l(a) {
				(c || $.noop)(a);
				h++;
				console.assert(h <= g.length);
				h == g.length && (updateBadge(), scheduleCheck(), (b || $.noop)())
			}
			var k = Date.now(),
			g = a ? f : $.grep(f, function (a) {
					var b = a.check_interval || getSetting(SETTINGS.check_interval);
					return a.last_check + b - EPSILON <= k
				}),
			h = 0;
			g.length ? $.each(g, function (a, b) {
				checkPage(b.url, l)
			}) : (updateBadge(), scheduleCheck(), (b || $.noop)())
		})
	};
	applySchedule = function (d) {
		b = Date.now() + d;
		clearTimeout(a);
		a = setTimeout(check,
				d)
	};
	scheduleCheck = function () {
		var a = Date.now();
		getAllPages(function (b) {
			0 != b.length && (b = $.map(b, function (b) {
						if (b.updated || !b.last_check)
							return a;
						var e = b.check_interval || getSetting(SETTINGS.check_interval);
						return b.last_check + e - a
					}), b = Math.min.apply(Math, b), b < MINIMUM_CHECK_SPACING ? b = MINIMUM_CHECK_SPACING : b == a && (b = DEFAULT_CHECK_INTERVAL), applySchedule(b))
		})
	};
	check = function (a, b, c) {
		$.ajax({
			type : "HEAD",
			url : RELIABLE_CHECKPOINT,
			complete : function (f) {
				f && 200 <= f.status && 300 > f.status ? actualCheck(a, b, c) : (applySchedule(RESCHEDULE_DELAY),
					(b || null)())
			}
		})
	};
	watchdog = function () {
		Date.now() - b > WATCHDOG_TOLERANCE && (console.log("WARNING: Watchdog recovered a lost timeout."), scheduleCheck())
	}
})();
(function () {
	var a = null;
	getExtensionVersion = function () {
		if (!a) {
			var b = $.ajax({
					url : "manifest.json",
					async : !1
				}).responseText;
			if (b = JSON.parse(b || "null"))
				a = b.version
		}
		return a
	}
})();
function insertPages(a, b) {
	for (var d = a.length, e = 0; e < a.length; e++)
		addPage(a[e], function () {
			0 == --d && (b || $.noop)()
		})
}
function importVersionOnePages(a) {
	var b = [];
	$.each(getSetting("pages_to_check") || {}, function (a, e) {
		b.push({
			url : a,
			name : e.name,
			mode : e.regex ? "regex" : "text",
			regex : e.regex || null
		})
	});
	insertPages(b, a)
}
function importVersionTwoPages(a) {
	var b = getSetting("pages"),
	d = [],
	e;
	for (e in b) {
		var c = b[e];
		d.push({
			url : c,
			name : getSetting(c + " name"),
			mode : getSetting(c + " mode"),
			regex : getSetting(c + " regex"),
			selector : getSetting(c + " selector"),
			check_interval : getSetting(c + " timeout"),
			html : getSetting(c + " html"),
			crc : getSetting(c + " crc"),
			updated : getSetting(c + " updated"),
			last_check : getSetting(c + " last_check"),
			last_changed : getSetting(c + " last_changed")
		})
	}
	insertPages(d, a)
}
function bringUpToDate(a, b) {
	initializeStorage(function () {
		function d() {
			setSetting(SETTINGS.version, getExtensionVersion());
			(b || $.noop)()
		}
		3.1 > a;
		1 > a ? (setSetting(SETTINGS.check_interval, DEFAULT_CHECK_INTERVAL), setSetting(SETTINGS.notifications_enabled, !1), setSetting(SETTINGS.notifications_timeout, 3E4), setSetting(SETTINGS.sort_by,
				"date added"), setSetting(SETTINGS.view_all_action, "original"), d()) : 2 > a ? (setSetting(SETTINGS.view_all_action, "original"), delSetting("last_check"), importVersionOnePages(d)) : 3 > a ? (setSetting(SETTINGS.check_interval, getSetting("timeout") || DEFAULT_CHECK_INTERVAL), setSetting(SETTINGS.view_all_action, "original"), delSetting("timeout"), importVersionTwoPages(d)) : d()
	})
};