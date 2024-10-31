<?php

namespace Pathomation\PmaLibs;

/**
Class that wraps around My Pathomation api
 */
class MyPathomation
{
    # internal module helper variables and functions
    public static $_pma_mypathomationAPIURL = "https://myapi.pathomation.com/";
    private static $_pma_mypathomationGrantType = "password";
    private static $_pma_mypathomationClientId = 3;
    private static $_pma_mypathomationClientSecret = "R99MeLPjsId2BpLwlboSeOb1phMqAWi92MuIl4f3";
    private static $_pma_mypathomationScope = "*";

    /**
	Attempt to connect to My Pathomation; success results in a SessionID
     */
    public static function connect($mypathomationUsername = "", $mypathomationPassword = "")
    {
        $url = PMA::_pma_join(self::$_pma_mypathomationAPIURL, "oauth/token");

        $body = [
            'grant_type'  => self::$_pma_mypathomationGrantType,
            'client_id' => self::$_pma_mypathomationClientId,
            'client_secret' => self::$_pma_mypathomationClientSecret,
            'username' => $mypathomationUsername,
            'password' => $mypathomationPassword,
            'scope' => self::$_pma_mypathomationScope,
        ];

        $body = wp_json_encode($body);

        $options = [
            'body'        => $body,
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

        $contents = wp_remote_post($url, $options);

        if (is_wp_error($contents)) {
            return null;
        }

        $json = json_decode($contents["body"], true);

        if ($contents["response"]["code"] != "200") {
            return $json;
        }

        $access_token = $json["token_type"] . " " . $json["access_token"];
        $mypathomationCredentials = self::getCredentials($access_token);
        return $mypathomationCredentials;
    }

    private static function getCredentials($mypathomationToken = "")
    {
        $url = PMA::_pma_join(self::$_pma_mypathomationAPIURL, "api/v1/authenticate?caller=", esc_url_raw("Plugin Wordpress"));

        $options = [
            'headers'     => [
                'Authorization' => $mypathomationToken,
                'Accept' => 'application/json'
            ],
            'timeout'     => 60,
            'redirection' => 5,
            'blocking'    => true,
            'httpversion' => '1.1',
            'sslverify'   => false,
        ];

        $contents = wp_remote_get($url, $options);
        if (is_wp_error($contents)) {
            return null;
        }
        $json = json_decode($contents["body"], true);
        if ($contents["response"]["code"] != "200") {
            return $json;
        }
        $sessionID = $json["session_id"];
        $mypathomationCoreUrl = $json["selected_nodes"][0]["Uri"] . "/";
        Core::$_pma_sessions[$sessionID] = $mypathomationCoreUrl;

        return array("sessionId" => $sessionID, "url" => $mypathomationCoreUrl);
    }
}
