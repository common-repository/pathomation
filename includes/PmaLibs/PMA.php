<?php

/**
The file contains classes that wrap around various components of Pathomation's software platform for digital microscopy
More information about Pathomation's free software offering can be found at http://free.pathomation.com
Commercial applications and tools can be found at http://www.pathomation.com
 */

namespace Pathomation\PmaLibs;

/**
Helper class. Developers should never access this class directly (but may recognize some helper functions they wrote themselves once upon a time)
 */
class PMA
{
    /** returns the current version of the library (2.0.0.38) */
    const version = "2.0.0.38";

    /** Internal use only */
    public static function ends_with($wholestring, $suffix)
    {
        return substr($wholestring, -strlen($suffix)) == $suffix ? true : false;
    }

    /** Internal use only */
    public static function starts_with($wholestring, $prefix)
    {
        return substr($wholestring, 0, strlen($prefix)) == $prefix ? true : false;
    }

    /** Internal use only */
    public static function _pma_join($dir1, $dir2)
    {
        $dir1 = str_replace("\\", "/", $dir1);
        $dir2 = str_replace("\\", "/", $dir2);
        if (self::ends_with($dir1, "/")) {
            $dir1 = substr($dir1, 0, strlen($dir1) - 1);
        }
        if (self::starts_with($dir2, "/")) {
            $dir2 = substr($dir2, 1);
        }
        return join("/", array($dir1, $dir2));
    }

    /** Internal use only */
    public static function _pma_q($arg)
    {
        if ($arg == null) {
            return "";
        } else {
            return urlencode($arg);
        }
    }

    /** Internal use only */
    public static function _pma_send_post_request($url, $jsonData)
    {
        $jsonDataEncoded = wp_json_encode($jsonData);

        $options = [
            'body'        => $jsonDataEncoded,
            'headers'     => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json'
            ],
            'timeout'     => 60,
            'redirection' => 5,
            'blocking'    => true,
            'httpversion' => '1.1',
            'sslverify'   => false,
            'data_format' => 'body',
        ];

        $response = wp_remote_post($url, $options);

        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();
            trigger_error('HTTP Api Error:' . $error_message);
        }

        return json_decode($response["body"], true);
    }
}
