package nl.fortesglobalweb.scanmedia;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;
import android.net.Uri;

/**
 * Phonrgap plugin
 * After adding images to the android device the gallery is not always refreshing the gallery view
 * Use this class to refresh the gallery 
 * 
 * @author Elvin Fortes - FortesGlobalWeb.nl
 */
public class ScanMedia extends CordovaPlugin {

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if (!action.equals("mediaScanner")) {
			return false;
		}
		try {
			String absolutePath = args.getString(0);
			if (absolutePath.startsWith("data:image")) {
				absolutePath = absolutePath.substring(absolutePath.indexOf(',') + 1);
			}

			return this.mediaScanner(absolutePath, callbackContext);
		} catch (JSONException e) {
			e.printStackTrace();
			callbackContext.error(e.getMessage());
			return false;
		} catch (InterruptedException e) {
			e.printStackTrace();
			callbackContext.error(e.getMessage());
			return false;
		}
	}

	/**
	 * Scan the media for new files
	 * @param String absolutePath
	 * @param CallbackContext callbackContext
	 */
	private boolean mediaScanner(String absolutePath, CallbackContext callbackContext) throws InterruptedException,	JSONException {
		Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
		Uri contentUri = Uri.parse(absolutePath.toString());
		mediaScanIntent.setData(contentUri);
		
		this.cordova.getActivity().sendBroadcast(mediaScanIntent);
		return true;
	}
}