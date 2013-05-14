ATB.CONFIG.BLACK_LIST_DOMAIN = { "touch.facebook.com": true,
                                 "nvmodules.netvibes.com": true,
                                 "www.gamefools.com": true,
                                 "sp.ask.com": true,
                                 "apnwidgets.ask.com": true
                               };
//TODO: Change this, to read from a file rather than a string
ATB.CONFIG.SEARCHPLUGIN = '<?xml version="1.0" encoding="utf-8"?><OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:ff="http://www.mozilla.org/2006/browser/search/"><ShortName>Ask Search</ShortName><Description>Ask Search</Description><Image height="16" width="16" type="image/icon">http://www.ask.com/favicon.ico</Image><ff:SearchForm>http://www.ask.com/?o={o}&amp;l={l}</ff:SearchForm><Url type="application/x-suggestions+json" template="http://ss.websearch.ask.com/query?qsrc={qsrc}&amp;li=ff&amp;sstype=prefix&amp;q={searchTerms}"/><Url type="text/html" template="http://asksearch.ask.com/redirect?client={client}&amp;src=crm&amp;tb={tb}&amp;o={o}&amp;locale={locale}&amp;apn_uid={guid}&amp;apn_ptnrs={cbid}&amp;apn_dtid={dtid}&amp;apn_dbr={dbr}&amp;itbv={itbv}&amp;doi={doi}&amp;q={searchTerms}&amp;{psv}"/></OpenSearchDescription>';
ATB.CONFIG.REBUTTAL_FLAG = "";

// Additional languages and locales can be added to a partner/track specific config.json
// The variables must be comma separated lists (strings)
ATB.CONFIG.SUPPORTED_LANGUAGES = ATB.CONFIG.SUPPORTED_LANGUAGES.concat("".replace(" ", "").split(","));
ATB.CONFIG.SUPPORTED_LOCALES = ATB.CONFIG.SUPPORTED_LOCALES.concat("".replace(" ", "").split(","));