    var GLOBAL_TIMEOUT_ID = null;
    var RELIABLE_CHECKPOINT = 'http://www.google.com/';
    var RESCHEDULE_WAIT = 15 * 60 * 1000;
  
    // CRC Calculator - Taken from http://noteslog.com/post/crc32-for-javascript/ as per the MIT license.
    (function() { 
        var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";     
     
        crc32 = function(str) { 
            var crc = 0; 
            var n = 0; // A number between 0 and 255.
            var x = 0; // A hex number.
     
            crc = crc ^ (-1); 
            for( var i = 0, iTop = str.length; i < iTop; i++ ) { 
                n = ( crc ^ str.charCodeAt( i ) ) & 0xFF; 
                x = "0x" + table.substr( n * 9, 8 ); 
                crc = ( crc >>> 8 ) ^ x; 
            } 
            return crc ^ (-1); 
        }; 
    })();
  
    // Helpers to store and access objects in local storage.
    Storage.prototype.setObject = function(key, value) {
      this.setItem(key, JSON.stringify(value));
    }
    Storage.prototype.getObject = function(key) {
      var value = this.getItem(key);
      if (value == null) {
        return null;
      } else {
        return JSON.parse(value);
      }
    }

    // Helper to get extension version.
    chrome.extension.getVersion = function() { 
      if (!chrome.extension.version_) { 
        var xhr = new XMLHttpRequest(); 
        xhr.open('GET', chrome.extension.getURL('manifest.json'), false); 
        xhr.onreadystatechange = function() { 
          if (this.readyState == 4) { 
            var manifest = JSON.parse(this.responseText); 
            chrome.extension.version_ = manifest.version; 
          } 
        }; 
        xhr.send(); 
      } 
      return chrome.extension.version_; 
    };

    // Helper to send an AJAX request.
    function sendAjaxRequest(url, callback, method) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          callback(xhr);
          clearTimeout(xhr.timeoutId);
          //console.log('Clearing Timeout: ' + url);
        }
      }
      xhr.open(method || 'GET', url, true);
      xhr.send();
      xhr.timeoutId = setTimeout(function() {
        xhr.abort();
        //console.log('Aborting: ' + url);
      }, 30000);
    }
	
function notify() {
if(!localStorage.novamensagem){
	localStorage.setItem('novamensagem', 'true');
	noti = chrome.notifications.create("novamsg", { type: "basic", iconUrl: "icons/icon_mensagem.png", title: "DescicloApp", message: "Voc\u00ea tem novas mensagens!!", buttons: [{ title: 'Ir a minha p\u00E1gina de discuss\u00E3o', iconUrl: 'imagens/enviarmensagem.png' }], priority: 2}, function creationCallback() {});
	chrome.notifications.onButtonClicked.addListener(notificationBtnClick);
function notificationBtnClick(novamsg, iBtn) {
	markPageVisited('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history');
	chrome.tabs.create({ url: 'http://' + localStorage.getItem('alternativo_favorito') + '/wiki/Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username')});
	chrome.notifications.clear(novamsg, function(wasCleared) {});
	localStorage.removeItem('novamensagem');
	chrome.extension.getBackgroundPage().location.reload(); 
}
	chrome.notifications.onClicked.addListener(function(novamsg) {
	markPageVisited('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history');
	chrome.notifications.clear(novamsg, function(wasCleared) {});
	localStorage.removeItem('novamensagem'); chrome.extension.getBackgroundPage().location.reload(); });
	chrome.notifications.onClosed.addListener(function(novamsg, ByUser) {
	markPageVisited('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history');
	localStorage.removeItem('novamensagem');
	chrome.extension.getBackgroundPage().location.reload(); 
	});
	noti.show();
} }

// pra notificacao no icone desaparecer se o usuario entrar em algum dominio da Desciclopedia
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.url && tab.url.indexOf('http://desciclopedia.org')  > -1){
    markPageVisited('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history');
} });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.url && tab.url.indexOf('http://desciclopedia.ws')  > -1){
    markPageVisited('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history');
} });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.url && tab.url.indexOf('http://pudim.info')  > -1){
    markPageVisited('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history');
} });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.url && tab.url.indexOf('http://vist.as')  > -1){
    markPageVisited('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history');
} });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.url && tab.url.indexOf('http://pesquisa.la')  > -1){
    markPageVisited('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history');
} });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.url && tab.url.indexOf('http://desnoticias.org')  > -1){
    markPageVisited('http://pesquisa.la/index.php?title=Usu%C3%A1rio_Discuss%C3%A3o:' + localStorage.getItem('username') + '&action=history');
} });
	
    // Main checking and accessing code.
    // TODO(max99x): rearrange all these functions and comment on them.
    function getUpdatedPages() {
      var pages = localStorage.getObject('pages_to_check') || [];
      var updated_pages = [];
      
      for (var i in pages) {
        if (pages[i].updated) {
          updated_pages.push(pages[i]); 
        }
      }
      
      return updated_pages;
    }

    function addNewPage(name, url, icon) {
      url = url.split('#')[0];
    
      var pages = localStorage.getObject('pages_to_check');
      pages[url] = { url: url,
                     name: name,
                     icon: icon,
                     cache: null,
                     html: null,
                     last_html: null,
                     regex: null,
                     updated: false };
      localStorage.setObject('pages_to_check', pages);
      
      initializePage(pages, url, function() {
        localStorage.setObject('pages_to_check', pages);
      });
    }

    function markPageVisited(url) {
      var pages = localStorage.getObject('pages_to_check');
      pages[url].updated = false;
      localStorage.setObject('pages_to_check', pages);
      updateBadge();
    }

    function removePage(url) {
      var pages = localStorage.getObject('pages_to_check');
      delete pages[url];
      localStorage.setObject('pages_to_check', pages);
      updateBadge();
    }

    function checkUpdates(callback) {
      // Check if network is up.
      sendAjaxRequest(RELIABLE_CHECKPOINT, function(xhr) {
        if (xhr.status == 200) {
          actualCheckUpdates(callback);
        } else {
          //console.log('Network down. Rescheduling.');
          setTimeout(checkUpdates, RESCHEDULE_WAIT);
          callback();
        }
      }, 'HEAD');
    }
    
    function actualCheckUpdates(callback) {
      var pages = localStorage.getObject('pages_to_check');
      var pages_remaining = 0;
      
      callback = callback || function() {};
      
      function completePageCheck() {
        pages_remaining--;
        //console.log('Pages remaining: ' + pages_remaining);
        if (pages_remaining == 0) {
          //console.log('Saving...');
          localStorage.setObject('pages_to_check', pages);
          updateBadge();
          callback();
        }
      }
    
      var checking = false;
      for (var i in pages) {
        pages_remaining++;
        if (pages[i].cache == null && !pages[i].updated) {
          initializePage(pages, i, completePageCheck);
        } else {
          checkPage(pages, i, completePageCheck);
        }
        checking = true;
      }
      
      if (!checking) {
        callback();
        updateBadge();
      }
      
      localStorage.setObject('last_check', (new Date()).getTime());
      updateCheckInterval(localStorage.getObject('check_interval'));
      //console.log('Checked at ' + new Date() + '.');
    }
    
    function checkPage(pages_list, url, callback) {
      sendAjaxRequest(url, function(xhr) {
        //console.log(pages_list);
        if (xhr.status == 200) {
          checksum = hash(xhr.responseText || '', pages_list[url].regex);
          //console.log(checksum + ' vs ' + pages_list[url].cache + ' -> ' + url);
          if (pages_list[url].cache != checksum) {
            pages_list[url].updated = true;
            //console.log('Setting cache from checkPage to ' + checksum);
            pages_list[url].cache = checksum;
            //console.log('Setting HTML from checkPage.');
            pages_list[url].last_html = pages_list[url].html;
            pages_list[url].html = xhr.responseText || '';
            //console.log('Updated!');
          }
          callback();
        }
      });
    }
    
    function initializePage(pages_list, url, callback) {
      sendAjaxRequest(url, function(xhr) {
        //console.log('Initializing ' + url);
        //console.log('Setting HTML from initializePage.');
        pages_list[url].html = xhr.responseText || '';
        pages_list[url].last_html = pages_list[url].html;
        //console.log('Setting cache from initializePage to ' + hash(xhr.responseText || '', pages_list[url].regex));
        pages_list[url].cache = hash(xhr.responseText || '', pages_list[url].regex);
        callback();
      });
    }
    
    function findAndFormatRegexMatches(html, regex) {
      custom_regex = new RegExp(regex, 'g');
      results = [];
      
      while (res = custom_regex.exec(html, custom_regex.lastIndex)) {
        if (res.length == 1) {
          results.push('"' + res[0] + '"');
        } else {
          results.push('"' + res.slice(1).join('", "') + '"');
        }
      }
      
      return results.join('\n');
    }
    
    function hash(html, custom_regex) {
      if (custom_regex) {
        custom_regex = new RegExp(custom_regex, 'g');
        buffer = '';
        
        while (res = custom_regex.exec(html, custom_regex.lastIndex)) {
          if (res.length == 1) {
            buffer += res[0];
          } else {
            for (i = 1; i < res.length; i++) {
              buffer += res[i];
            }
          }
        }
        
        html = buffer;
        //console.log(custom_regex);
        //console.log('\t' + html);
      } else {
        html = html.toLowerCase();
        html = html.replace(/<(script|style|object|embed|applet)[^>]*>[^]*?<\/\1>/g, '');
        html = html.replace(/[^]*<body[^>]*>/, '');
        html = html.replace(/([^]*)<\/body[^>]*>[^>]*/, '$1');
        html = html.replace(/<img[^>]*src=['"](.+?)['"][^>]*>/g, '$1');
        html = html.replace(/<[^>]*>/g, '');
        html = html.replace(/\d+(st|nd|rd|th)\b/g, '');
        html = html.replace(/[\x00-\x40\x5B-\x60\x7B-\xBF]/g, '');
      }
      
      var checksum = crc32(html);
      
      return checksum;
    }
    
    function updateBadge() {
      var pages = localStorage.getObject('pages_to_check');
      var updated_count = 0;
      
      for (var i in pages) {
        if (pages[i].updated) {
          updated_count++;
        }
      }
      
      chrome.browserAction.setBadgeBackgroundColor({ color: localStorage.getItem('cor-favorita') });
      updated_count = (updated_count == 0) ? '' : updated_count.toString();
      icon = (updated_count == 0) ? 'browser_icon.png' : 'browser_icon_active.png';
      chrome.browserAction.setBadgeText({ text: updated_count });
	  chrome.browserAction.getBadgeText({}, function(result) {
		if(result == "1") { chrome.browserAction.setTitle({title: 'DescicloApp: Ei ' + localStorage.getItem('username') + ', voc\u00ea tem novas mensagens'}); notify(); } else { chrome.browserAction.setTitle({title: 'Desciclop\u00E9dia'}); }
	  });
	}
    
    function updateCheckInterval(new_interval) {
      localStorage.setObject('check_interval', new_interval);
      clearTimeout(GLOBAL_TIMEOUT_ID);
      GLOBAL_TIMEOUT_ID = setTimeout(checkUpdates, new_interval);
    }
    
    function getInterval() {
      return localStorage.getObject('check_interval');
    }
    
    function getAllPages() {
      return localStorage.getObject('pages_to_check');
    }
    
    function getLastCheckTime() {
      return localStorage.getObject('last_check');
    }
    
    function updatePageRegex(url, regex) {
      var pages = localStorage.getObject('pages_to_check');
      
      pages[url].regex = regex;
      
      localStorage.setObject('pages_to_check', pages);
    }
    
    function isPageMonitored(url) {
      var pages = localStorage.getObject('pages_to_check');
      
      return Boolean(pages[url]);
    }
    
    // Initialization.
    localStorage.setObject('pages_to_check', localStorage.getObject('pages_to_check') || {});
    
    // If new version is loaded, mark all pages uninitialized.
    var saved_version = localStorage.getObject('version');
    var current_version = chrome.extension.getVersion();
    if (saved_version) {
      saved_version = saved_version.split('.')[0] + '.' + saved_version.split('.')[1];
      current_version = chrome.extension.getVersion();
      current_version = current_version.split('.')[0] + '.' + current_version.split('.')[1];
    }
    if (saved_version != current_version) {
      var pages = localStorage.getObject('pages_to_check');
      for (var i in pages) {
        //console.log('Setting cache from global scope to null.');
        pages[i].cache = null;
        pages[i].updated = false;
        //console.log('Setting HTML from global scope.');
        pages[i].last_html = pages[i].html;
        pages[i].html = null;
      }
      //console.log(pages);
      localStorage.setObject('pages_to_check', pages);
      checkUpdates();
      localStorage.setObject('version', current_version);
    } else {
      // Start checking on schedule.
      var last_check = localStorage.getObject('last_check');
      var interval = localStorage.getObject('check_interval');
      if ((new Date()).getTime() - last_check >= interval) {
        checkUpdates();
      }
    }
    updateCheckInterval(interval || (60 * 1000));
    
    updateBadge();