<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://www.pathomation.com
 * @since             2.0.0
 * @package           Pma_Wordpress
 *
 * @wordpress-plugin
 * Plugin Name:       Pathomation
 * Plugin URI:        https://www.pathomation.com/plugins/wordpress/
 * Description:       Whole slide imaging allows high-resolution image capture of microscopic objects. This results in large data packages, that are hard to manipulate and convert. With Pathomation technology, you can embed these in your content when and where you want it, without any hassle.
 * Version:           2.5.1
 * Author:            Pathomation
 * Author URI:        http://www.pathomation.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       pma-wordpress
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 2.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'PMA_WORDPRESS_VERSION', '2.5.1' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-pma-wordpress-activator.php
 */
function activate_pma_wordpress() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-pma-wordpress-activator.php';
	Pma_Wordpress_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-pma-wordpress-deactivator.php
 */
function deactivate_pma_wordpress() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-pma-wordpress-deactivator.php';
	Pma_Wordpress_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_pma_wordpress' );
register_deactivation_hook( __FILE__, 'deactivate_pma_wordpress' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-pma-wordpress.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    2.0.0
 */
function run_pma_wordpress() {

	$plugin = new Pma_Wordpress();
	$plugin->run();

    if ( ! function_exists( 'pmawp_initialize_extension' ) ){
        /**
         * Creates the extension's main class instance.
         *
         * @since 1.0.0
         */
        function pmawp_initialize_extension() {
            require_once plugin_dir_path( __FILE__ ) . 'includes/PmaWordpressDivi.php';
        }
        function register_query_param() { 
            global $wp; 
            $wp->add_query_var('et_fb'); 
        }
        
        add_action('init','register_query_param');
        add_action( 'divi_extensions_init', 'pmawp_initialize_extension' );
    }

}

run_pma_wordpress();