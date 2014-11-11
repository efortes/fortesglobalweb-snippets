/**
 * Load language
 * @author Elvin Fortes - FortesGlobalWeb.nl
 */
Ext.define('App.Lang', {
	alternateClassName : [ 'Lang' ],
	singleton : true,
	requires : [ 'Ext.Ajax' ],

	defaultLang : 'en_EN',	
	cache : false,// TODO add cache support...not workingg jet
	isLoaded : false,
	
	/**
	 * Check if the language is selected by an user
	 */
	langSelectedByUser : (function() {
		if (!localStorage.langSelectedByUser) {
			return false;
		}
		return true;
	})(),

	/**
	 * Select a language
	 * @param String language key
	 */
	setLangSelectedByUser : function(lang) {
		localStorage.langSelectedByUser = lang;
	},

	/**
	 * Get the default language
	 */
	currentLang : (function() {
		if (typeof (Storage) !== "undefined") {
			if (!Ext.isEmpty(localStorage.currentLang) && localStorage.currentLang !== 'undefined') {
				return localStorage.currentLang;
			}
		}
		if (typeof (Lang) == 'undefined') {
			return 'en_EN';
		}
		return Lang.defaultLang;
	})(),

	/**
	 * Init
	 */
	constructor : function() {
		this.load();
	},

	/**
	 * Set the current language
	 * @param String lang - language key
	 * @param Function callback - success callback
	 * @param boolean skiprefresh - Refresh application
	 */
	setLang : function(lang, callback, skiprefresh) {
		if (!lang || lang == "undefined") {
			return;
		}
		
		this.currentLang = lang;
		
		if (!skiprefresh) {
			window.location.href = window.location.href;
			return;
		}
		
		localStorage.currentLang = lang;
		this.load(callback);
	},

	/**
	 * Load language
	 * @param Function callbackFunc - Successcallback
	 */
	load : function(callbackFunc) {
		var me = this;
		var requestedLang = me.currentLang;
		
		if (!requestedLang || requestedLang == "undefined") {
			return;
		}
		
		if (typeof (Storage) !== "undefined") {
			if (!Ext.isEmpty(localStorage.currentLang)) {
				requestedLang = localStorage.currentLang;
			}
		}
		
		//Load the language
		var doLoad = function() {
			var url = (window.location.origin + window.location.pathname).toString().replace('index.html', '') + 'lang/' + requestedLang + '.json';
			
			Ext.Ajax.request({
				url : url,
				methode : 'POST',
				async : false,
				success : function(response, opts) {
					var obj = Ext.decode(response.responseText);
					if (obj.lang) {
						me.data = obj.lang; // Always set the data for browsers
						// that dont support localstorage
						me.isLoaded = true;
						if (typeof (Storage) !== "undefined") {
							localStorage.Lang = Ext.encode(obj.lang);
							localStorage.currentLang = requestedLang;

							$('html').attr('lang', localStorage.currentLang.substring(0, 2));

							localStorage.LangLastUpdated = new Date();
						}
					}				
					
					//Translate
					if (Lang) {							
						for(var i = 0; i < Ext.Date.monthNames.length; i++) {
							Ext.Date.monthNames[i] = Lang.get(Ext.Date.monthNames[i],  'month');
						}
					}
					
					if (callbackFunc) {
						callbackFunc();
					}
				},
				failure : function(response, opts) {
					Ext.Msg.alert('Error', response.status);
				}
			});
		};
	},

	/**
	 * Get language by key. You can also include a prefix 
	 * @param String  key
	 * @param String  prefix
	 * @returns String
	 */
	get : function(key, prefix) {
		if (!prefix || prefix === undefined) {
			prefix = '';
		}
		if (Ext.isArray(this.data) || Ext.isObject(this.data)) {
			if (this.data[prefix]) {
				if (this.data[prefix][key]) {
					return this.data[prefix][key];
				}
			} else {
				if (this.data[key]) {
					if (Ext.isString(this.data[key])) {
						return this.data[key];
					}
				}
			}
		}
		return '%' + key + '%';
	},

	/**
	 * Get date day language
	 * 
	 * @param number
	 * @param format
	 * @returns
	 */
	getDayByWeekNumber : function(number, format) {
		var dayName = Lang.get('Error', 'general');
		switch (number) {
		case 0:
			dayName = this.get('Sunday', 'weekdays');
			break;
		case 1:
			dayName = this.get('Monday', 'weekdays');
			break;
		case 2:
			dayName = this.get('Tuesday', 'weekdays');
			break;
		case 3:
			dayName = this.get('Wednesday', 'weekdays');
			break;
		case 4:
			dayName = this.get('Thursday', 'weekdays');
			break;
		case 5:
			dayName = this.get('Friday', 'weekdays');
			break;
		case 6:
			dayName = this.get('Saturday', 'weekdays');
			break;
		}
		if (format == 'lowercase') {
			return dayName.toLowerCase();
		}
		return dayName;
	},

	/**
	 * Get date month language
	 * 
	 * @param number
	 * @param format
	 * @returns
	 */
	getMonthByMonthNumber : function(number, format) {
		var month = Lang.get('Error', 'general');
		switch (number) {
		case 0:
			month = this.get('January', 'month');
			break;
		case 1:
			month = this.get('February', 'month');
			break;
		case 2:
			month = this.get('March', 'month');
			break;
		case 3:
			month = this.get('April', 'month');
			break;
		case 4:
			month = this.get('May', 'month');
			break;
		case 5:
			month = this.get('June', 'month');
			break;
		case 6:
			month = this.get('July', 'month');
			break;
		case 7:
			month = this.get('August', 'month');
			break;
		case 8:
			month = this.get('September', 'month');
			break;
		case 9:
			month = this.get('October', 'month');
			break;
		case 10:
			month = this.get('November', 'month');
			break;
		case 11:
			month = this.get('December', 'month');
			break;
		}
		if (format == 'lowercase') {
			return month.toLowerCase();
		}
		return month;
	}
});