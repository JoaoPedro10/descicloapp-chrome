var ATB = {};
ATB.localStorage = new ATB_LocalStorage();
if(ATB.localStorage.get("pref_new_tab_on") == true) {
    chrome.tabs.update({url:"/config/skin/new-tab-page.html"});
} else {
    chrome.tabs.update({url:"chrome-internal://newtab/"});
}