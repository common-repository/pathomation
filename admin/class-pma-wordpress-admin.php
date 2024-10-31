<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://www.pathomation.com
 * @since      2.0.0
 *
 * @package    Pma_Wordpress
 * @subpackage Pma_Wordpress/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Pma_Wordpress
 * @subpackage Pma_Wordpress/admin
 * @author     Pathomation <info@pathomation.com>
 */
class Pma_Wordpress_Admin
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
     * @param      string    $plugin_name       The name of this plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct($plugin_name, $version)
    {

        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    /**
     * Register the stylesheets for the admin area.
     *
     * @since    2.0.0
     */
    public function enqueue_styles()
    {
        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/pma-wordpress-admin.css', array(), $this->version, 'all');
        wp_enqueue_style($this->plugin_name . "_pmaui", plugin_dir_url(realpath(__DIR__)) . 'includes/pma.ui/pma.ui.css', array(), $this->version, false);
    }

    /**
     * Register the JavaScript for the admin area.
     *
     * @since    2.0.0
     */
    public function enqueue_scripts()
    {
        wp_enqueue_script('jquery-ui-dialog');
		wp_enqueue_script($this->plugin_name . "_pmaui", plugin_dir_url(realpath(__DIR__)) . 'includes/pma.ui/pma.ui.js', array('jquery'), $this->version, false);
    }

    public function create_page()
    {
        add_menu_page('Pathomation settings', 'Pathomation', 'manage_options', 'pma-wordpress-admin', array($this, 'create_admin_page'), 'none');
        // This page will be under "Settings"
        /*add_options_page(
        'Pathomation settings',
        'Pathomation settings',
        'manage_options',
        'pma-wordpress-admin',
        array( $this, 'create_admin_page' )
        );*/
    }

    public function admin_init()
    {
        register_setting(
            'pma-wordpress', // Option group
            'pma-wordpress-connection', // Option name
            array($this, 'sanitize') // Sanitize
        );

        add_settings_section(
            'pma_setting_section_id', // ID
            'Pathomation\'s connectivity settings', // Title
            array($this, 'print_plugin_section_info'), // Callback
            'pma-wordpress-admin' // Page
        );

        add_settings_field(
            'pma_connection_method',
            '',
            array($this, 'pma_connection_method_callback'),
            'pma-wordpress-admin',
            'pma_setting_section_id'
        );

        add_settings_section(
            'pma_setting_section_mypathomation', // ID
            '', // Title
            array($this, 'print_mypathomation_section_info'), // Callback
            'pma-wordpress-admin' // Page
        );

        add_settings_field(
            'mypathomation_username',
            'My Pathomation Username',
            array($this, 'mypathomation_username_callback'),
            'pma-wordpress-admin',
            'pma_setting_section_mypathomation'
        );

        add_settings_field(
            'mypathomation_username',
            'My Pathomation Username',
            array($this, 'mypathomation_username_callback'),
            'pma-wordpress-admin',
            'pma_setting_section_mypathomation'
        );

        add_settings_field(
            'mypathomation_password',
            'My Pathomation Password',
            array($this, 'mypathomation_password_callback'),
            'pma-wordpress-admin',
            'pma_setting_section_mypathomation'
        );

        add_settings_section(
            'pma_setting_section_pmacore', // ID
            '', // Title
            array($this, 'print_pmacore_section_info'), // Callback
            'pma-wordpress-admin' // Page
        );

        add_settings_field(
            'pmacore_url', // ID
            'PMA.core URL', // Title
            array($this, 'pmacore_url_callback'), // Callback
            'pma-wordpress-admin', // Page
            'pma_setting_section_pmacore' // Section
        );

        add_settings_field(
            'pmacore_username',
            'PMA.core Username',
            array($this, 'pmacore_username_callback'),
            'pma-wordpress-admin',
            'pma_setting_section_pmacore'
        );

        add_settings_field(
            'pmacore_password',
            'PMA.core Password',
            array($this, 'pmacore_password_callback'),
            'pma-wordpress-admin',
            'pma_setting_section_pmacore'
        );
    }

    /**
     * Sanitize each setting field as needed
     *
     * @param array $input Contains all settings fields as array keys
     */
    public function sanitize($input)
    {
        $new_input = array();

        if (isset($input['method'])) {
            $new_input['method'] = sanitize_text_field($input['method']);
        } else {
            return 0;
        }

        if (isset($input['pmacore_url'])) {
            if ($new_input['method'] == "pmacore") {
                $tmp_url = sanitize_text_field($input['pmacore_url']);
                $new_input['pmacore_url'] = substr($tmp_url, -1) === "/" ? $tmp_url : $tmp_url . "/";
            } else {
                $new_input['pmacore_url'] = "";
            }
        } else {
            return 0;
        }

        if (isset($input['pmacore_username'])) {
            if ($new_input['method'] == "pmacore") {
                $new_input['pmacore_username'] = sanitize_text_field($input['pmacore_username']);
            } else {
                $new_input['pmacore_username'] = "";
            }
        } else {
            return 0;
        }

        if (isset($input['pmacore_password'])) {
            if ($new_input['method'] == "pmacore") {
                $new_input['pmacore_password'] = sanitize_text_field($input['pmacore_password']);
            } else {
                $new_input['pmacore_password'] = "";
            }
        } else {
            return 0;
        }

        if (isset($input['mypathomation_username'])) {
            if ($new_input['method'] == "mypathomation") {
                $new_input['mypathomation_username'] = sanitize_text_field($input['mypathomation_username']);
            } else {
                $new_input['mypathomation_username'] = "";
            }
        } else {
            return 0;
        }

        if (isset($input['mypathomation_password'])) {
            if ($new_input['method'] == "mypathomation") {
                $new_input['mypathomation_password'] = sanitize_text_field($input['mypathomation_password']);
            } else {
                $new_input['mypathomation_password'] = "";
            }
        } else {
            return 0;
        }

        return $new_input;
    }

    /**
     * Print the Section text
     */
    public function print_plugin_section_info()
    {
        printf(
            '<p>Choose preferred connection method.</p>
			<div id="radios">
			<input id="mypathomation_radio" type="radio" name="radioBtn" value="mypathomation" %s>
			<label class="mypathomation_label" for="mypathomation_radio">My Pathomation</label>
			<input id="pmacore_radio" type="radio" name="radioBtn" value="pmacore" %s>
			<label class="pmacore_label" for="pmacore_radio">PMA.core</label>
			<div id="connection_selection_bg"></div>
			</div>',
            isset($this->options['method']) && $this->options['method'] != "pmacore" ? 'checked' : '',
            !isset($this->options['method']) || $this->options['method'] == "pmacore" ? 'checked' : ''
        );
    }

    /**
     * Print the Section text
     */
    public function print_mypathomation_section_info()
    {
        printf('<div id="mypathomation_section">
		<h3>My Pathomation credentials</h3>
		<p>This plugin requires My Pathomation credentials. Enter them below.</p><p>Don\'t have a My Pathomation account yet? <a href="https://my.pathomation.com/register/" target="_blank">Click here to get started.</a></p>
		');
    }

    /**
     * Print the Section text
     */
    public function print_pmacore_section_info()
    {
        printf('</div>
		<div id="pmacore_section" class="hidden">
		<h3>PMA.core credentials</h3>
		<p>Use this dialog to interface with a dedicated on-premise PMA.core intallation, rather than our universal <a href="https://my.pathomation.com/" target="_blank">My Pathomation platform.</a></p>
		');
    }

    /**
     * Get the settings option array and print one of its values
     */
    public function pma_connection_method_callback()
    {
        printf(
            '<input type="hidden" id="connection_method" name="pma-wordpress-connection[method]" value="%s" />',
            isset($this->options['method']) ? esc_attr($this->options['method']) : 'pmacore'
        );
    }

    public function pmacore_url_callback()
    {
        if (isset($this->options['pmacore_url'])) {
            $url = esc_attr($this->options['pmacore_url']);
        } else {
            if (isset($this->options['url'])) {
                $url = esc_attr($this->options['url']);
            } else {
                $url = '';
            }
        };
        printf(
            '<input type="text" id="pmacore_url" class="regular-text code" name="pma-wordpress-connection[pmacore_url]" value="%s" />
        <p class="description" id="url-description">The url of a PMA.core instance to connect to</p>',
            $url
        );
    }

    public function pmacore_username_callback()
    {
        if (isset($this->options['pmacore_username'])) {
            $username = esc_attr($this->options['pmacore_username']);
        } else {
            if (isset($this->options['username'])) {
                $username = esc_attr($this->options['username']);
            } else {
                $username = '';
            }
        };
        printf(
            '<input type="text" id="pmacore_username" class="regular-text code" name="pma-wordpress-connection[pmacore_username]" value="%s" />
        <p class="description" id="url-description">The username to connect to PMA.core</p>',
            $username
        );
    }

    public function pmacore_password_callback()
    {
        if (isset($this->options['pmacore_password'])) {
            $password = esc_attr($this->options['pmacore_password']);
        } else {
            if (isset($this->options['password'])) {
                $password = esc_attr($this->options['password']);
            } else {
                $password = '';
            }
        };
        printf(
            '<input type="password" id="pmacore_password" class="regular-text code" name="pma-wordpress-connection[pmacore_password]" value="%s" />
        <p class="description" id="url-description">The password of the specified user</p>',
            $password
        );
    }

    public function mypathomation_username_callback()
    {
        printf(
            '<input type="text" id="mypathomation_username" class="regular-text code" name="pma-wordpress-connection[mypathomation_username]" value="%s" />
        <p class="description" id="url-description">The username to connect to My Pathomation</p>',
            isset($this->options['mypathomation_username']) ? esc_attr($this->options['mypathomation_username']) : ''
        );
    }

    public function mypathomation_password_callback()
    {
        printf(
            '<input type="password" id="mypathomation_password" class="regular-text code" name="pma-wordpress-connection[mypathomation_password]" value="%s" />
        <p class="description" id="url-description">The password to connect to My Pathomation</p>',
            isset($this->options['mypathomation_password']) ? esc_attr($this->options['mypathomation_password']) : ''
        );
    }

    /**
     * Options page callback
     */
    public function create_admin_page()
    {
        // Set class property
        $this->options = get_option('pma-wordpress-connection');
?>
        <div class="wrap">
            <h2><?php echo esc_html(get_admin_page_title()); ?></h2>
            <form method="post" action="options.php">
                <p>Whole slide imaging allows high-resolution image capture of microscopic objects. This results in large data packages, that are hard to manipulate and convert. With Pathomation technology, you can embed these in your content when and where you want it, without any hassle.</p>
                <?php
                settings_fields('pma-wordpress');
                do_settings_sections('pma-wordpress-admin');
                ?>
        </div>
        <p>
            <input type="submit" name="submit" id="submit" class="button button-primary pma" value="Save Changes">
            <input id="testButton" name="testSettings" type="button" value="Test settings" class="button button-secondary" />
            <span class="spinner" style="position: fixed"></span>
        </p>
        <div id="connectionInfo"></div>
        <div id="versionInfo">Version <?php echo esc_attr(PMA_WORDPRESS_VERSION); ?></div>
        </form>
        </div>
<?php
    }

    public function include_media_button_js_file()
    {
        wp_enqueue_script('media_button', plugin_dir_url(__FILE__) . 'js/pma-wordpress-mediabutton.js', array('jquery'), $this->version, false);
        wp_enqueue_script('pathomation-slide', plugins_url('js/pma-wordpress.js', __FILE__), array('wp-blocks', 'wp-components', 'wp-element', 'wp-editor', 'jquery'), $this->version, false);

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
            'ajax_url' => admin_url('admin-ajax.php')
        );

        wp_localize_script('media_button', 'PmaCoreConfiguration', $dataToBePassed);
        $dataToBePassed = array(
            'ajax_url' => admin_url('admin-ajax.php')
        );
        wp_localize_script('pathomation-slide', 'PmaSettings', $dataToBePassed);
    }

    public function include_admin_button_js_file()
    {
        wp_enqueue_script('admin_button', plugin_dir_url(__FILE__) . 'js/pma-wordpress-admin.js', array('jquery'), $this->version, false);
        $dataToBePassed = array(
            'ajax_url' => admin_url('admin-ajax.php')
        );
        wp_localize_script('admin_button', 'PmaSettings', $dataToBePassed);
    }

    public function test_connection()
    {
        $result = array();

        $connection_method = sanitize_text_field($_POST['connection']);
        if (empty($connection_method)) {
            array_push($result, "Unspecified connection method");
        } else {
            if ($connection_method !== "mypathomation" && $connection_method !== "pmacore") {
                array_push($result, "Unrecognized connection method");
            }
        }

        $url = esc_url_raw($_POST['url']);
        if (empty($url) && $connection_method === "pmacore") {
            array_push($result, "Url is empty");
        }

        $username = sanitize_text_field($_POST['username']);
        if (empty($username)) {
            array_push($result, "Username is empty");
        }

        $password = sanitize_text_field($_POST['password']);
        if (empty($password)) {
            array_push($result, "Password is empty");
        }

        if (sizeof($result) == 0) {
            if ($connection_method === "mypathomation") {
                $mypathomationCredentials = Pathomation\PmaLibs\MyPathomation::connect($username, $password);
                $sessionId = $mypathomationCredentials["sessionId"];
            }
            if ($connection_method === "pmacore") {
                $sessionId = Pathomation\PmaLibs\Core::connect($url, $username, $password);
            }
            $response = array();
            if ($sessionId != null) {
                $response["status"] = 'success';
                $response["statusText"] = 'Connection was succesful';
            } else {
                array_push($result, "Check credentials and try again");
                $response["status"] = 'error';
                $response["statusText"] = 'Connection was not succesful';
            }
        } else {
            $response["status"] = 'error';
            $response["statusText"] = 'Please fill all fields';
        }

        $response["result"] = $result;
        header('Content-Type: application/json');
        echo json_encode($response);
        die();
    }

    public function thumbnail_upload()
    {
        $url = esc_url_raw($_POST['img']);
        $filename = sanitize_file_name($_POST['filename']);
        $uploaddir = wp_upload_dir();
        $uploadfile = $uploaddir['path'] . '/' . $filename;
        $uploadfile = wp_normalize_path($uploadfile);

        $options = [
            'timeout'     => 60,
            'redirection' => 5,
            'blocking'    => true,
            'httpversion' => '1.1',
            'sslverify'   => false,
        ];

        $response = wp_remote_get($url, $options);
        $contents = $response["body"];

        $savefile = fopen($uploadfile, 'w');
        fwrite($savefile, $contents);
        fclose($savefile);
        $filepath = $uploaddir['url'] . '/' . $filename;
        echo esc_url_raw($filepath);
        die();
    }

    public function dialog_selector()
    {
        require_once plugin_dir_path(__FILE__) . 'partials/pma-wordpress-admin-display.php';
    }
}
