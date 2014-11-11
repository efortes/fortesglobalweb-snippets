<?php

/**
 * Get Openweather map data
 * @author        Elvin Fortes - FortesGlobalWeb.nl
 */
class OpenWeather extends Master
{

	/**
	 * Get weather data
	 *
	 * @param array $options
	 *
	 * @return array weather data
	 */
	protected function getWeather(array $options = array())
	{
		$options = array_merge(array(
			"apiUrl"       => "http://api.openweathermap.org/data/2.5/forecast/daily",
			"city"         => "",
			"address"      => "",
			"landCode"     => "nl",
			"lang"         => "nl",
			"apiKey"       => "{YOUR_API_KEY}",
			"forecastDays" => 14,
			"timestamp"    => "",
		), $options);

		// GET Parameters to Send
		$params = array(
			'q'     => $options['address'].",".$options['city'].','.$options['landCode'],
			'lang'  => $options['lang'],
			'cnt'   => $options['forecastDays'],
			'APPID' => $options['apiKey']
		);

		//Update URL to container Query String of Paramaters
		$options['apiUrl'] .= '?'.http_build_query($params);

		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_URL            => $options['apiUrl']
		));
		$result = curl_exec($curl);
		if(!$result)
		{
			//throwException(500, curl_error($ch));
			return false;
		}
		curl_close($curl);

		//Decode json
		$result = json_decode($result);;
		//Transform date to midnight
		$dayTimestampToCheck = mktime(0, 0, 0, date("n", $options['timestamp']), date("j", $options['timestamp']), date("Y", $options['timestamp']));

		$weatherData = array(
			"temperature"       => null,
			"weatherDescripion" => null,
			"city"              => null,
			"country"           => null,
			"timestamp"         => null,
			"dateText"          => null,
		);

		if(!isset($result->list))
		{
			return false;
		}

		//Loop trough the list to get the correct day
		foreach($result->list as $index => $val)
		{
			$listItem  = $result->list[$index];
			$timestamp = $listItem->dt; //Always based on date and 0:00 hours

			//Make sure the date is set to midnight
			$weatherTimestampToCheck = mktime(0, 0, 0, date("n", $timestamp), date("j", $timestamp), date("Y", $timestamp));

			//if the dates are not the same we need to go to the next item
			if($dayTimestampToCheck != $weatherTimestampToCheck)
			{
				continue;
			}

			//Get the temperature
			$temperatureItem = $listItem->temp;
			$temperature     = 0;
			if(is_object($temperatureItem) && property_exists($temperatureItem, "day"))
			{
				$temperature = $temperatureItem->day;
			}

			//Fill weather data
			$weatherData['temperature']       = round($temperature - 273.15); //Temperature, Kelvin (subtract 273.15 to convert to Celsius);
			$weatherData['weatherDescripion'] = $listItem->weather[0]->description;
			$weatherData['city']              = $result->city->name;
			$weatherData['country']           = $result->city->country;
			$weatherData['timestamp']         = $timestamp;
			$weatherData['icon']              = $listItem->weather[0]->icon;
			$weatherData['dateText']          = date("d-m-Y", $timestamp);
			break;
		}

		return $weatherData;
	}
}
