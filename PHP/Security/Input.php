<?php
/**
 * User input XSS filtering
 * @author Elvin Fortes
 */
 trait Trait_Input {
    
    /**
     * Gets HTTP POST parameters with xss filtering
     * @param string / array $key
     * @param string $default
     * @param string $xssFilter
     * @return Ambigous <unknown, string>
     */
    public function query($key = null, $default = null, $xssFilter = true) {
        $data = $_GET;      
        return $this->_parse($data, $key, $default, $xssFilter);
    }
    
    /**
     * Gets HTTP POST parameters with xss filtering
     * @param string / array $key
     * @param string $default
     * @param string $xssFilter
     * @return Ambigous <unknown, string>
     */
    public function post($key = null, $default = null, $xssFilter = true) {
        $data = $_POST;      
        return $this->_parse($data, $key, $default, $xssFilter);
    }
    
    /**
	 * Gets the HTTP body of the request with xss filtering
     * @param string / array $key
     * @param string $default
     * @param boolean $xssFilter
     * @return string / array 
     */
    public function getRequestBody($key = null, $default = null, $xssFilter = true) {	
    	//TODO get the body request
    	$data = array();
        $data = json_decode($data, true);
        return $this->_parse($data, $key, $default, $xssFilter);
    }
    
    /**
     * Clean with XSS filtering
     * @param string / array $key
     */
    protected function clean($key) {
        return $this->_parse($key);
    }

    /**
	 * Gets or sets the HTTP body of the request with xss filtering
     * @param string / array $key
     * @param string $default
     * @param boolean $xssFilter
     * @return string / array 
     */
    protected function _parse($data, $key = null, $default = null, $xssFilter = true) {
        $returnData = null;
        if (!is_null($default)) 
        {            
            $default = HTML::chars($default);
        }
        
        //if not xss check
        if (!$xssFilter)
        {
            //Check if key is set
            if (!is_null($key))
            {
                if (isset($data[$key]))
                {
                    return $data[$key];
                }
                return $default; 
            }
            return $data;
        }
        
        //If key is set return the value
        if (!is_null($key))
        {
            if (isset($data[$key]))
            {
                return $this->_parse($data[$key], null, $default, $xssFilter);
            }
            return $default;          
        }
        
        //If array parse child arrays
        if (is_array($data) || is_object($data))
        {
            foreach ($data as $k => $s)
            {
                $data[$k] = $this->_parse($s, null, $default, $xssFilter);
            }
        }
        else
        {
            $data = HTML::chars($data);         
        }
        
        return $data;    
    } 

    /**
     * Convert special characters to HTML entities. All untrusted content
     * should be passed through this method to prevent XSS injections.
     *
     * @param   string  $value          string to convert
     * @param   boolean $double_encode  encode existing entities
     * @return  string
     */
    public static function chars($value, $double_encode = TRUE, $charset = "utf-8") {
    	return htmlspecialchars( (string) $value, ENT_QUOTES, Kohana::$charset, $double_encode);
    }    
}