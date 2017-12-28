/**
 * Class / functions for google images
 * @author Elvin Fortes - FortesGlobalweb.nl
 */
function GoogleMapsSimpleImage (googleKey) {	
	
	/**
	 * Get the google maps image by address
	 * @param String address
	 * @param Object options TODO implement options
	 */
	this.getStaticMapImageUrl = function(address, options) {
		return "https://maps.googleapis.com/maps/api/staticmap?key=" + googleKey + "&center=" + encodeURIComponent(address) + "&zoom=15&size=338x170&maptype=roadmap&markers=color:red|" + encodeURIComponent(address);
	};
	
	/**
	 * Get the google street image by address
	 * @param String address
	 * @param Object options TODO: implement
	 */
	this.getStreetViewImageUrl = function(address) {
		return "https://maps.googleapis.com/maps/api/streetview?key=" + googleKey + "&location=" + encodeURIComponent(address) + "&size=338x170&fov=90&heading=235&pitch=10";
	};
	
	//return class reference
	return this;
};