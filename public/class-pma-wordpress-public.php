<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://www.pathomation.com
 * @since      2.0.0
 *
 * @package    Pma_Wordpress
 * @subpackage Pma_Wordpress/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Pma_Wordpress
 * @subpackage Pma_Wordpress/public
 * @author     Pathomation <info@pathomation.com>
 */
class Pma_Wordpress_Public
{

    /**
     * The ID of this plugin.
     *
     * @since    2.0.0
     * @access   private
     * @var      string    $plugin_name    The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since    2.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $version;

    /**
     * Initialize the class and set its properties.
     *
     * @since    2.0.0
     * @param      string    $plugin_name       The name of the plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct($plugin_name, $version)
    {

        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since    2.0.0
     */
    public function enqueue_styles()
    {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Pma_Wordpress_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Pma_Wordpress_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/pma-wordpress-public.css', array(), $this->version, 'all');
        wp_enqueue_style($this->plugin_name . "_pmaui", plugin_dir_url(realpath(__DIR__)) . 'includes/pma.ui/pma.ui.css', array(), $this->version, false);
    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since    2.0.0
     */
    public function enqueue_scripts()
    {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Pma_Wordpress_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Pma_Wordpress_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/pma-wordpress-public.js', array('jquery'), $this->version, false);
        
        $diviQuery = sanitize_text_field(get_query_var('et_fb'));
        
        $this->options = get_option('pma-wordpress-connection');
        if ($this->options["method"] == "pmacore") {
            $sessionId = Pathomation\PmaLibs\Core::connect($this->options["pmacore_url"], $this->options['pmacore_username'], $this->options['pmacore_password']);
            $url = $this->options["pmacore_url"];
        }
        if ($this->options["method"] == "mypathomation") {
            $mypathomationCredentials = Pathomation\PmaLibs\MyPathomation::connect($this->options['mypathomation_username'], $this->options['mypathomation_password']);
            $url = $mypathomationCredentials["url"];
            $sessionId = $mypathomationCredentials["sessionId"];
        }

        $dataToBePassed = array(
            'sessionId' => $sessionId,
            'serverUrl' => $url,
            'query' => $diviQuery,
        );

        wp_localize_script($this->plugin_name, 'PmaCoreConfiguration', $dataToBePassed);

        if (!empty($diviQuery)){
            return;
        }

		wp_enqueue_script($this->plugin_name . "_lozad", plugin_dir_url(realpath(__DIR__)) . 'includes/pma.ui/lozad.js', array('jquery'), $this->version, false);
		wp_enqueue_script($this->plugin_name . "_pmaui", plugin_dir_url(realpath(__DIR__)) . 'includes/pma.ui/pma.ui.js', array('jquery'), $this->version, false);
    }

    public function pmaslide_shortcode($atts)
    {
        $a = shortcode_atts(
            array(
                'path' => '',
                'width' => '',
                'height' => '',
                'barcode' => '',
                'filename' => '',
                'overview' => '',
                'adjustments' => '',
                'roi' => '',
                'channels' => '',
                'layer' => '',
                'timeframe' => '',
            ), $atts
        );

        return '<div class="pmaslide viewer" data-path="' . $a['path'] . '" data-barcode="' . $a['barcode'] . '" data-filename="' . $a['filename'] . '" data-overview="' . $a['overview'] . '" data-adjustments="' . $a['adjustments'] . '" data-roi="' . $a['roi'] . '" data-channels="[' . $a['channels'] . ']" data-layer="' . $a['layer'] . '" data-timeframe="' . $a['timeframe'] . '" style="width: ' . ($a['width'] ? $a['width'] . "px" : '100%') . '; height: ' . ($a['height'] ? $a['height'] . "px" : '500px') . ';"></div>';
    }
}