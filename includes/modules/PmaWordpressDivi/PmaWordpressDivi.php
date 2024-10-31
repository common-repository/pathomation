<?php

class SIMP_PmaWordpressDivi extends ET_Builder_Module {

	public $slug       = 'simp_pathomation_slide';
	public $vb_support = 'on';

	public function init() {
		$this->name = esc_html__( 'Pathomation Slide', 'pma-wordpress' );
        $this->icon_path =  plugin_dir_path( __FILE__ ) . 'icon.svg';
	}

	public function get_fields() {
		return array(
			'heading'     => array(
				'label'           => esc_html__( 'Heading', 'pma-wordpress' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Input your desired heading here.', 'pma-wordpress' ),
				'toggle_slug'     => 'main_content',
			),
			'slide'     => array(
				'label'           => esc_html__( 'Slide', 'pma-wordpress' ),
				'type'            => 'pmawp_slide_selector',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Select slide to show.', 'pma-wordpress' ),
				'toggle_slug'     => 'slide_options',
			),
			'viewport_options'     => array(
				'label'           => "",
				'type'            => 'multiple_checkboxes',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Select viewport options.', 'pma-wordpress' ),
                'toggle_slug' => 'viewport_options',
                'options' => array(
                  'showBarcode'  => esc_html__( 'Show barcode', 'pma-wordpress'),
                  'showFilename' => esc_html__( 'Show filename', 'pma-wordpress'),
                  'showOverview'  => esc_html__( 'Show overview', 'pma-wordpress'),
                  'showImageAdjustmentsControl' => esc_html__( 'Show image adjustments control', 'pma-wordpress'),
                ),
                'sub_toggle'  => 'viewportOptions',
			),
			'viewport_width'     => array(
				'label'           => esc_html__( 'Viewport width (in px)', 'pma-wordpress' ),
				'type'            => 'range',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Select viewport width in px.', 'pma-wordpress' ),
                'toggle_slug' => 'viewport_options',
                'sub_toggle'  => 'viewportDimensions',
                'range_settings' => array(
                    'min' => '0',
                    'max' => '1500',
                    'step' => '1',
                ),
                'validate_unit' => true,
			),
			'viewport_height'     => array(
				'label'           => esc_html__( 'Viewport height (in px)', 'pma-wordpress' ),
				'type'            => 'range',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Select viewport height in px.', 'pma-wordpress' ),
                'toggle_slug' => 'viewport_options',
                'sub_toggle'  => 'viewportDimensions',
                'range_settings' => array(
                    'min' => '0',
                    'max' => '1500',
                    'step' => '1',
                ),
                'validate_unit' => true,
			),
			'viewport_roi'     => array(
				'label'           => "",
				'type'            => 'pmawp_viewport_roi',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Select viewport region of interest.', 'pma-wordpress' ),
                'toggle_slug' => 'viewport_options',
                'sub_toggle'  => 'viewportRoi',
			),
		);
	}

    public function get_settings_modal_toggles() {
        return array(
          'advanced' => array(
            'toggles' => array(
              'slide_options' => array(
                'priority' => 20,
                'title' => 'Slide',
              ),
              'viewport_options' => array(
                'priority' => 24,
                'title' => 'Viewport',
                'sub_toggles' => array(
                    'viewportOptions' => array(
                      'name' => 'Viewport options',
                    ),
                    'viewportDimensions' => array(
                      'name' => 'Viewport dimensions',
                    ),
                    'viewportRoi' => array(
                      'name' => 'Viewport roi',
                    ),
                  ),
                  'tabbed_subtoggles' => true,
              ),
            ),
          ),
        );
      }

	public function render( $unprocessed_props, $content = null, $render_slug ) {
        $options = explode("|", esc_html( $this->props['viewport_options'] ));
        $barcode = count($options) == 4 ? $options[0] == "on" : false;
        $filename = count($options) == 4 ? $options[1] == "on" : false;
        $overview = count($options) == 4 ? $options[2] == "on" : false;
        $adjustments = count($options) == 4 ? $options[3] == "on" : false;
        $width = ($this->props['viewport_width'] != "" && $this->props['viewport_width'] != "0") ? $this->props['viewport_width'] : "100%";
        $height = ($this->props['viewport_height'] != "" && $this->props['viewport_height'] != "0") ? $this->props['viewport_height'] . 'px' : "500px";
        $roiOptions = json_decode(html_entity_decode($this->props['viewport_roi']), true);
        $roi = $roiOptions["roi"];
        $geometry = $roiOptions["geometry"];
        $channels = $roiOptions["channels"];
        $layer = $roiOptions["layer"];
        $timeFrame = $roiOptions["timeFrame"];

        return sprintf(
			'<h1 class="simp-simple-header-heading">%1$s</h1>
            <div class="pmaslide viewer" data-path="%2$s" data-barcode="%3$s" data-filename="%4$s" data-overview="%5$s" data-adjustments="%6$s" data-roi="%9$s" data-channels="%10$s" data-timeframe="%11$s" data-layer="%12$s" style="width: %7$s; height: %8$s"></div>',
			esc_html( $this->props['heading'] ),
			esc_html( $this->props['slide'] ),
            var_export($barcode, true),
            var_export($filename, true),
            var_export($overview, true),
            var_export($adjustments, true),
            $width,
            $height,
            $roi,
            json_encode($channels),
            $timeFrame,
            $layer
		);
	}
}

new SIMP_PmaWordpressDivi;
