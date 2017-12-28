/**
 * Tooltip manager
 * @author Elvin Fortes- FortesGlobalWeb.nl
 */
var TooltipManager = (function() {
	var self = this;
	var isLoaded = false;

	/**
	 * Data object. Get filled after loading
	 */
	var data = {};

	/**
	 * Init tooltips
	 * @param JQ Object $el - Main dom element
	 */
	this.initTooltip = function($el, options) {
		var settings = $.extend({}, {
			tooltipSelector: ".tooltipster",
			maxWidth: 272,
			contentAsHTML: false,
			position: 'bottom-right',
			offsetX: 6,
			contentAsHTML: true
		}, options);

		loadTooltips(function() {
			$el.find(settings.tooltipSelector).each(function() {
				var $tipEl$ = $(this);
				var title = $tipEl$.attr("title");
				var dataName = $tipEl$.attr("data-name");
				var dataCat = $tipEl$.attr("data-category");

				var content = "";
				if (title) {
					if (title.length > 0) {
						content = title;
						return;
					}
				}
				if (content.length < 1) {
					content = self.get(dataName, dataCat);
				}
				content = "<div>" + content + "</div>";

				// We need to make the tooltips work item by item as we
				// need to set the $(content)
				$tipEl$.tooltipster({
					maxWidth: settings.maxWidth,
					position: settings.position,
					contentAsHTML: settings.contentAsHTML,
					content: $(content),
					offsetX: settings.offsetX
				});
			});
		});
	};

	/**
	 * Load tooltips
	 * @param Function successCallback - Success callback after loading
	 */
	var loadTooltips = function(successCallback) {
		if (isLoaded) {
			successCallback();
			return;
		}
		var defaultTooltip = "Nog niet beschikbaar";
		
		// For now lets keep the data local. TODO This should be loaded trough an ajax request (JSON file for example)
		data = {
    		"general": {
    			"Test": "Test tooltip",
    			"Test2": "Tweede test tooltip",
    		}
		};
		isLoaded = true;
		successCallback();
	};

	/**
	 * Get tooltip text by name and category
	 * @param String name
	 * @param String category
	 */
	this.get = function(name, category) {
		if (!name || !category) {
			return "";
		}
		if (data[category]) {
			if (data[category][name]) {
				return data[category][name];
			}
		}
		return "{" + name + "}(Cat: " + category + ")";
	};

	return self;
})();