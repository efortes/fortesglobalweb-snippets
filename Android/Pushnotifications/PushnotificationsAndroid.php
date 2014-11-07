<?php
/**
 * Send notifications to Android devices
 * The server side of Google Cloud Messaging
 *
 * @author Elvin Fortes - FortesGlobalWeb.nl
 */
class PushnotificationsAndroid {
	
	/**
	 * Request content type
	 * @var string
	 */
	protected $contentType = "application/json";
	
	/**
	 * The API key from Google APIs Console
	 * @var string
	 */
	protected $apiKey = null;
	
	/**
	 * Use the data parameter to include into the payload This applies
	 * @var unknown
	 */
	protected $data = array ();
	
	/**
	 * Device egistration id's
	 * @var array
	 */
	protected $registrationIDs = array ();
	
	/**
	 * GCM URL
	 * @var string
	 */
	protected $requestUrl = "https://android.googleapis.com/gcm/send";
	
	/**
	 * Request error
	 * @var multitype
	 */
	protected $error = null;
	
	/**
	 * Add receiver registration ID
	 * @param String $ID
	 */
	public function addRegistrationID($ID) {
		if (in_array ( $ID, $this->registrationIDs )) {
			return;
		}
		$this->registrationIDs [] = $ID;
	}
	
	/**
	 * Send the request
	 * @return boolean|multitype:
	 */
	public function send() {
		
		// Set GCM post variables (Device IDs and push payload)
		$post = array (
			'registration_ids' => $this->registrationIDs,
			'data' => $this->data 
		);
		
		// Set CURL request headers (Authentication and type)
		$headers = array (
			'Authorization: key=' . $this->apiKey,
			'Content-Type: application/json' 
		);
		
		// Initialize curl handle
		$ch = curl_init ();
		curl_setopt ( $ch, CURLOPT_URL, $requestUrl );
		curl_setopt ( $ch, CURLOPT_POST, true );
		curl_setopt ( $ch, CURLOPT_HTTPHEADER, $headers );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt ( $ch, CURLOPT_POSTFIELDS, json_encode ( $post ) );
		
		// Send request
		$result = curl_exec ( $ch );
		
		// ------------------------------
		// Error? Display it!
		// ------------------------------
		
		if (curl_errno ( $ch )) {
			$this->error = curl_error($ch);
			curl_close ($ch);
			return false;
		}
		
		// Close curl handle
		curl_close ( $ch );
		
		/**
		 * Response Example:
		 * { "multicast_id": 216,
		 * "success": 3,
		 * "failure": 3,
		 * "canonical_ids": 1,
		 * "results": [
		 * { "message_id": "1:0408" },
		 * { "error": "Unavailable" },
		 * { "error": "InvalidRegistration" },
		 * { "message_id": "1:1516" },
		 * { "message_id": "1:2342", "registration_id": "32" },
		 * { "error": "NotRegistered"}
		 * ]
		 * }
		 */
		$result = array_merge ( array (
			"multicast_id" => null,
			"success" => 0,
			"failure" => 0,
			"canonical_ids" => null,
			"results" => array () 
		), $result );
		
		return $result;
	}
}