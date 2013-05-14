/*
 * default-config.js
 *
 * @fileoverview Contain all the parameters that can affect the behavior of the
 * toolbar
 *
 * @author Thomas Genin <thomas.genin@ask.com>
 * 2011
 */

var ATB = ATB || {};

/**
 * In Mozilla Firefox, our toolbar widgets load in a "sandboxed" XUL browser.  We use
 * "frame scripts" (scripts loaded in a privileged context) to communicate between the
 * privileged toolbar and the sandboxed widgets.  This flag indicates whether we are in
 * a frame script to begin with (as this file is the first frame script loaded).
 * 
 * In Google Chrome and Internet Explorer, this will always be false. 
 */
ATB.USE_CONTENT = (function() {
    var n = (typeof content != "undefined") && content && content.navigator ? content.navigator : navigator;
    var ua = n.userAgent.toLowerCase();
    return ua.indexOf("compatible") < 0 &&
           /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) &&
           typeof sendAsyncMessage == "function";
})();

/**
 * Configuration of the toolbar. These values are need for the logic of the
 * extension. If you want to change them, please edit config/tb-config instead;
 * When you create a new config value, create it here and NOT in tb-config
 *
 * The weird pattern allow the autocompletion to work correctly
 *
 * @namespace
 */
ATB.CONFIG = ATB.CONFIG || {};

/**
 * List of domain that can run custom commands
 * Use window.location.hostname to write the value
 * @default {}
 * @type Object ( map)
 */
ATB.CONFIG.AUTHORIZED_DOMAIN = {
    "10.0.38.28": true,
    "apnwidgets.ask.com": true
};

/**
 * List of domain that shouldn't display the toolbar
 * Use window.location.hostname to write the value
 * @default {}
 * @type Object
 */
ATB.CONFIG.BLACK_LIST_DOMAIN = {};

/**
 * Base domain for the update API call
 * @type String
 */
ATB.CONFIG.UPDATE_API_URL = 'http://asksearch.ask.com/update?client=cr&tb={tb}&cbid={cbid}&v={version}&r={revision}&build={build}&id={guid}&said={saguid}&locale={locale}&dtid={dtid}&crumb={crumb}&apn_dbr={apn_dbr}';


//------------------------------------------------------------------------------
/**
 * Configuration value for the new tab
 * @namespace
 */
ATB.CONFIG.NEW_TAB = {
    /**
     * Number of links display by the "most visited" part of the UI
     * @type Number
     * @default 10
     */
    MOST_VISITED: {
        NB: 10,
        COLUMN: 3,
        LINE: 6
    },

    /**
     * Number of items display in the recently close section of new tab
     * @default 5
     */
    NB_RECENT_CLOSE: 10
};

//------------------------------------------------------------------------------
/**
 * Toolbar config constant
 * @namespace
 */
ATB.CONFIG.TB = {
    /**
     * Duration of the closing animation of the toolbar in MS
     * @type Number
     * @default 500
     */
    ANIM_CLOSE_DURATION: 500,

    /**
     * Height of the toolbar in pixel
     * @type Number
     * @default 30
     */
    HEIGHT: 30,

    /**
     * Size of the icon inside the toolbar in pixel
     * @type Number
     * @default
     */
    REEL_HEIGHT: 26,

    /**
     * Path to images, inside the CRX
     * @type String
     * @default config/skin/images/
     */
    PATH_IMG: 'config/skin/images/',

    /**
     * ID of the extra style tage insert in the page
     * @type String
     * @default style-atb
     */
    STYLE_ID: 'apn-body-style',

    DEFAULT_THEME: 'vanilla'
};

//------------------------------------------------------------------------------
/**
 * Config value for the search component
 * @namespace
 */
ATB.CONFIG.SEARCH = {
    /**
     * Number of characters allowed to display in seach suggestion input box on text highlight
     * @type Number
     * @default 50
     */
    TEXT_HIGHLIGHT_N_CHARS_ALLOWED: 50,

    /**
     * Number of element the search history suggestion should display
     * @type Number
     * @default 3
     */
    HISTORY_NUMBER: 3,

    /**
     * Number of element we saved for the search history suggestion
     * @type Number
     * @default 5
     */
    HISTORY_STORED: 5,

    /**
     * Default search url with macro
     * @type String
     * @default "http://www.ask.com/web?q={query}&o={cr-o}&l={l}&qsrc={qsrc}"
     */
    SEARCH_URL: "http://www.ask.com/web?o={o}&l={l}&qsrc={qsrc}&q={query}",

    /**
     * Default search url with macro
     * @type String
     * @default "http://www.ask.com/web?q={query}&o={cr-o}&l={l}&qsrc={qsrc}&gct=tab"
     */
    TAB_SEARCH_URL: "http://www.ask.com/web?o={o}&l={l}&qsrc={qsrc}&q={query}&gct=tab",

    /**
     * Number of caracter needs to be written before we trigger the search
     * suggestion
     * @type Number
     * @default 3
     */
    SUGGESTION_TRIGGER: 1,

    /**
     * Number of item are display in the search suggestion if we have the max
     * number of search history item
     * @type Number
     * @default 5
     */
    SUGGESTION_NUMBER: 10,

    /**
     * Number of characters allowed to display in seach suggestion item
     * @type Number
     * @default 25
     */

    SUGGESTION_N_CHARS_ALLOWED: 25,

    /**
     * Default search suggestion url
     * @type String
     * @default http://ss.websearch.ask.com/query?qsrc=2922&li=ff&sstype=prefix
     */
    SUGGESTION_URL: {
        path: {
            "US": "http://ss.websearch.ask.com/query",
            "UK": "http://ss.websearch.uk.ask.com/query",
            "EU": "http://ss.websearch.uk.ask.com/query"
        },
        params: {
            "qsrc":"2922",
            "li":"ff",
            "sstype":"prefix"
        }
    }
};

ATB.CONFIG.TAB_SEARCH_URL = {
    path: {
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
    params: {
        "gct": "bar",
        "tpid": "{tb}",
        "o": "{o}",
        "l": "{l}",
        "locale": "{locale}",
        "apn_ptnrs": "{cbid}",
        "apn_dtid": "{dtid}",
        "apn_uid": "{guid}",
        "doi": "{doi}",
        "tbv": "{platformversion}",
        "crxv": "{version}",
        "apn_dbr": "{dbr}",
        "q": "{query}"
    }
};



ATB.CONFIG.KEYWORD_URL = {
    path: "http://asksearch.ask.com/redirect?{psv}",
    params: { client: "{client}",
              src: "kw",
              tb: "{tb}",
              o: "{o}",
              locale: "{locale}",
              apn_ptnrs: "{cbid}",
              apn_uid: "{guid}",
              apn_dtid: "{dtid}",
              doi: "{doi}",
              itbv: "{itbv}",
              apn_dbr: "{dbr}",
              q: ""
            }

};

ATB.CONFIG.DNS_URL = {
    path: "http://asksearch.ask.com/redirect?{psv}",
    params: { client: "{client}",
              src: "kw",
              tb: "{tb}",
              o: "{o}",
              locale: "{locale}",
              apn_ptnrs: "{cbid}",
              apn_dtid: "{dtid}",
              apn_uid: "{guid}",
              doi: "{doi}",
              itbv: "{itbv}",
              apn_dbr: "{dbr}",
              q: ""
            }

};

ATB.CONFIG.DAILY_PHONE_HOME_URL = {
    path: "http://phn.apnanalytics.com/tr.gif?",
    params: { client: "{client}",
              anxa: "APNToolbar",
              anxv: "{platformversion}",
              anxe: "PhoneHome",
              anxt: "{guid}",
              anxtv: "{platformversion}",
              anxr: (new Date().getTime()),
              tpid: "{tb}",
              crxv: "{version}",
              apn_dbr: "{dbr}",
              o: "{o}"
            }

};

//------------------------------------------------------------------------------
/**
 * Configuratin layer for Widgets
 * @namespace
 */
ATB.CONFIG.WIDGET = {
    /**
     * Name of the css class hosting widgets
     * @type String
     * @default atb-widget
     */
    CLASS: 'atb-widget',

    /**
     * Extra css properties to add to the widget container
     * @type Object
     * @TODO remove this
     */
    CONTAINER_CSS: {
        position: 'fixed',
        'background-color': 'white'
    },

    /**
     * ID of the iframe hosting the widget
     * @type String
     * @default atb-v6-widget-iframe
     */
    IFRAME_ID: 'atb-v6-widget-iframe',

    /**
     * Margin on the right of the screen to position the widget in case of an
     * overflow
     * @type Number
     * @default 10
     * @TODO search if can't move that to CSS with CSS3 maths feature
     */
    MARGIN_RIGHT: 10,

    /**
     * margin with the toolbar
     * @type Number
     * @default 5
     * @deprecated
     * @todo make it static in the css
     */
    MARGIN_TOP: 1,

    /**
     * Time use by the opening animation
     * @type Number
     * @default 500
     */
    OPEN_ANIMATION_DURATION: 500,

    /**
     * Kind of jquery animation use to open the widget
     * @type String
     * @default swing
     */
    OPEN_ANIMATION_TYPE: 'swing',

    /**
     * offsets popup widgets away from the mouse cursor when they open
     * overflow
     * @type Number
     * @default 10
     */
    POPUP_OFFSET: 10,

    /**
     * Time use by the opening animation
     * @type Number
     * @default 500
     */
    RESIZE_ANIMATION_DURATION: 500,

    /**
     * Kind of jquery animation use to open the widget
     * @type String
     * @default swing
     */
    RESIZE_ANIMATION_TYPE: 'swing'
};
//------------------------------------------------------------------------------

/**
 * Store the config informations for each widget of the toolbar.
 * Must be defined in tb-config
 * @type Object
 * @default {}
 */
ATB.CONFIG.leftDock = ATB.CONFIG.leftDock || [];
ATB.CONFIG.centerDock = ATB.CONFIG.centerDock || [];
ATB.CONFIG.rightDock = ATB.CONFIG.rightDock || [];
ATB.CONFIG.widgetsByID = ATB.CONFIG.widgetsByID || { };

ATB.CONFIG.LANGMAP = {abk:"ab",aar:"aa",afr:"af",aka:"ak",fat:"ak",twi:"ak",sqi:"sq",aae:"sq",aat:"sq",aln:"sq",als:"sq",amh:"am",ara:"ar",aao:"ar",abh:"ar",abv:"ar",acm:"ar",acq:"ar",acw:"ar",acx:"ar",acy:"ar",adf:"ar",aeb:"ar",aec:"ar",afb:"ar",ajp:"ar",apc:"ar",apd:"ar",arb:"ar",arq:"ar",ars:"ar",ary:"ar",arz:"ar",auz:"ar",avl:"ar",ayh:"ar",ayl:"ar",ayn:"ar",ayp:"ar",bbz:"ar",pga:"ar",shu:"ar",ssh:"ar",arg:"an",hye:"hy",asm:"as",ava:"av",ave:"ae",aym:"ay",ayr:"ay",ayc:"ay",aze:"az",azj:"az",azb:"az",bam:"bm",bak:"ba",eus:"eu",bel:"be",ben:"bn",bho:"bh",mag:"bh",mai:"bh",bis:"bi",bos:"bs",bre:"br",bul:"bg",mya:"my",cat:"ca",cha:"ch",che:"ce",nya:"ny",zho:"zh",cdo:"zh",cjy:"zh",cmn:"zh",cpx:"zh",czh:"zh",czo:"zh",gan:"zh",hak:"zh",hsm:"zh",mnp:"zh",nan:"zh",wuu:"zh",yue:"zh",chv:"cv",cor:"kw",cos:"co",cre:"cr",crm:"cr",crl:"cr",crk:"cr",crj:"cr",csw:"cr",cwd:"cr",hrv:"hr",ces:"cs",dan:"da",div:"dv",nld:"nl",dzo:"dz",eng:"en",epo:"eo",est:"et",ekk:"et",vro:"et",ewe:"ee",fao:"fo",fij:"fj",fin:"fi",fra:"fr",ful:"ff",fub:"ff",fui:"ff",fue:"ff",fuq:"ff",ffm:"ff",fuv:"ff",fuc:"ff",fuf:"ff",fuh:"ff",glg:"gl",kat:"ka",deu:"de",ell:"el",grn:"gn",nhd:"gn",gui:"gn",gun:"gn",gug:"gn",gnw:"gn",guj:"gu",hat:"ht",hau:"ha",heb:"he",her:"hz",hin:"hi",hmo:"ho",hun:"hu",ina:"ia",ind:"id",ile:"ie",gle:"ga",ibo:"ig",ipk:"ik",esi:"ik",esk:"ik",ido:"io",isl:"is",ita:"it",iku:"iu",ike:"iu",ikt:"iu",jpn:"ja",jav:"jv",kal:"kl",kan:"kn",kau:"kr",knc:"kr",kby:"kr",krt:"kr",kas:"ks",kaz:"kk",khm:"km",kik:"ki",kin:"rw",kir:"ky",kom:"kv",koi:"kv",kpv:"kv",kon:"kg",kng:"kg",ldi:"kg",kwy:"kg",kor:"ko",kur:"ku",ckb:"ku",kmr:"ku",sdh:"ku",kua:"kj",lat:"la",ltz:"lb",lug:"lg",lim:"li",lin:"ln",lao:"lo",lit:"lt",lub:"lu",lav:"lv",glv:"gv",mkd:"mk",mlg:"mg",xmv:"mg",bhr:"mg",msh:"mg",bmm:"mg",plt:"mg",skg:"mg",bjq:"mg",bzc:"mg",tkg:"mg",tdx:"mg",txy:"mg",xmw:"mg",msa:"ms",btj:"ms",bve:"ms",bvu:"ms",coa:"ms",jax:"ms",meo:"ms",mqg:"ms",mly:"ms",xmm:"ms",max:"ms",mfa:"ms",msi:"ms",vkt:"ms",mal:"ml",mlt:"mt",mri:"mi",mar:"mr",mah:"mh",mon:"mn",khk:"mn",mvf:"mn",nau:"na",nav:"nv",nob:"nb",nde:"nd",nep:"ne",ndo:"ng",nno:"nn",iii:"ii",nbl:"nr",oci:"oc",oji:"oj",ciw:"oj",ocb:"oj",ojc:"oj",ojg:"oj",ojs:"oj",ojw:"oj",otw:"oj",chu:"cu",orm:"om",gax:"om",hae:"om",orc:"om",gaz:"om",ori:"or",oss:"os",pan:"pa",pli:"pi",fas:"fa",prs:"fa",pes:"fa",pol:"pl",pus:"ps",pst:"ps",pbu:"ps",pbt:"ps",por:"pt",que:"qu",qva:"qu",qxu:"qu",quy:"qu",qvc:"qu",qvl:"qu",qud:"qu",qxr:"qu",quk:"qu",cqu:"qu",qug:"qu",qxc:"qu",qxa:"qu",qwc:"qu",qwa:"qu",quz:"qu",qve:"qu",qub:"qu",qvh:"qu",qwh:"qu",qvw:"qu",qvi:"qu",qxw:"qu",quf:"qu",qvj:"qu",qvm:"qu",qvo:"qu",qul:"qu",qvn:"qu",qxn:"qu",qvz:"qu",qvp:"qu",qxh:"qu",qxp:"qu",qxl:"qu",qvx:"qu",qxt:"qu",qus:"qu",qws:"qu",quh:"qu",qxo:"qu",qup:"qu",quw:"qu",qur:"qu",qux:"qu",roh:"rm",run:"rn",ron:"ro",rus:"ru",san:"sa",srd:"sc",sro:"sc",sdn:"sc",src:"sc",sdc:"sc",snd:"sd",sme:"se",smo:"sm",sag:"sg",srp:"sr",gla:"gd",sna:"sn",sin:"si",slk:"sk",slv:"sl",som:"so",sot:"st",spa:"es",sun:"su",sun:"su",swa:"sw",swc:"sw",swh:"sw",ssw:"ss",swe:"sv",tam:"ta",tel:"te",tgk:"tg",tha:"th",tir:"ti",bod:"bo",tuk:"tk",tgl:"tl",tsn:"tn",ton:"to",tur:"tr",tso:"ts",tat:"tt",twi:"tw",tah:"ty",uig:"ug",ukr:"uk",urd:"ur",uzb:"uz",uzn:"uz",uzs:"uz",ven:"ve",vie:"vi",vol:"vo",wln:"wa",cym:"cy",wol:"wo",fry:"fy",xho:"xh",yid:"yi",ydd:"yi",yih:"yi",yor:"yo",zha:"za",zch:"za",zhd:"za",zeh:"za",zgb:"za",zgn:"za",zln:"za",zlj:"za",zlq:"za",zgm:"za",zhn:"za",zqe:"za",zyg:"za",zyb:"za",zyn:"za",zyj:"za",zzj:"za",zul:"zu"};
ATB.CONFIG.SUPPORTED_LANGUAGES = ["en", "de", "es", "fr", "it", "nl", "pt", "ru"];
ATB.CONFIG.SUPPORTED_LOCALES = ["US", "BR", "DE", "ES", "EU", "FR", "IT", "NL", "RU", "UK"];
