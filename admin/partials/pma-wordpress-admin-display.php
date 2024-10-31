<?php

/**
* Provide a admin area view for the plugin
*
* This file is used to markup the admin-facing aspects of the plugin.
*
* @link       http://www.pathomation.com
* @since      2.0.0
*
* @package    Pma_Wordpress
* @subpackage Pma_Wordpress/admin/partials
*/
?>
  <div id="pmaslidedialog">
    <div class="pmaslidetree"></div>
    <div class="pmaslide-viewer"></div>
    <div class="pmaslide-sidebar">
      <div class="attachment-details" style="display:none">
        <h2>Slide Details			<span class="settings-save-status"></h2>
        <div class="attachment-info">
          <div class="thumbnail thumbnail-image">
            <img src="#" alt="">
          </div>
          <div class="details">
            <div class="filename"></div>
            <div class="uploaded"></div>
            <div class="file-size"></div>
            <div class="dimensions"></div>
            <div class="compat-meta"></div>
          </div>
        </div>
      </div>
      <div class="options">
        <h2>Slide embedding properties</h2>
          <div class="embedding-properties">
            <fieldset>
                <legend><h4>Viewport display</h4></legend>
                <label for="showBarcode">Show barcode</label>
                <input type="checkbox" id="showBarcode" name="showBarcode" />
                <label for="showFilename">Show filename</label>
                <input type="checkbox" id="showFilename" name="showFilename" />
                </br>
                <label for="showOverview">Show overview</label>
                <input type="checkbox" id="showOverview" name="showOverview" />
                <label for="showImageAdjustmentsControl">Show image adjustments control</label>
                <input type="checkbox" id="showImageAdjustmentsControl" name="showImageAdjustmentsControl" />
            </fieldset>
            <fieldset>
                <legend><h4>Viewport dimensions</h4></legend>
                <label for="viewportWidth">Width (in px)</label>
                <input type="number" id="viewportWidth" name="viewportWidth" min="0" style="width: 5em;" />
                <label for="viewportHeight">Height (in px)</label>
                <input type="number" id="viewportHeight" name="viewportHeight" min="0" style="width: 5em;" />
            </fieldset>
            <fieldset>
                <input type="hidden" id="viewportRoi" name="viewportRoi" />
                <input type="hidden" id="viewportRoiGeometry" name="viewportRoiGeometry" />
                <input type="hidden" id="viewportChannels" name="viewportChannels" />
                <input type="hidden" id="viewportLayer" name="viewportLayer" />
                <input type="hidden" id="viewportTimeframe" name="viewportTimeframe" />
            </fieldset>
          </div>
      </div>
    </div>

    <div class="media-frame-toolbar">
      <div class="media-toolbar">
        <div class="media-toolbar-primary search-form">
            <button id="pmaslidedialog-set-roi-btn" type="button" class="button media-button button-secondary button-large media-button-set-roi">Set viewport state</button>
            <button id="pmaslidedialog-remove-roi-btn" type="button" class="button media-button button-secondary button-large media-button-remove-roi" style="display:none">Remove ROI</button>
            <button id="pmaslidedialog-roi-btn" type="button" class="button media-button button-secondary button-large media-button-roi">Select ROI</button>
            <button id="pmaslidedialog-btn" type="button" class="button media-button button-primary button-large media-button-insert">Insert into post</button>
        </div>
      </div>

    </div>

    <!-- <div tabindex="0" class="media-modal wp-core-ui">
<button type="button" class="media-modal-close"><span class="media-modal-icon"><span
class="screen-reader-text">Close media panel</span></span></button>
<div class="media-modal-content">
<div class="media-frame mode-select wp-core-ui" id="__pmaslidedialog-0">
<div class="media-frame-title">
<h1>Add Media<span class="dashicons dashicons-arrow-down"></span></h1>
</div>
<div class="media-frame-router">
<div class="media-router"><a href="#" class="media-menu-item">Upload Files</a><a href="#"
class="media-menu-item active">Media Library</a></div>
</div>
<div class="media-frame-content">
<div class="media-sidebar">
<div class="media-uploader-status" style="display: none;">
<h2>Uploading</h2>
<button type="button" class="button-link upload-dismiss-errors"><span class="screen-reader-text">Dismiss
Errors</span></button>
<div class="media-progress-bar">
<div></div>
</div>
<div class="upload-details">
<span class="upload-count">
<span class="upload-index"></span> / <span class="upload-total"></span>
</span>
<span class="upload-detail-separator">–</span>
<span class="upload-filename"></span>
</div>
<div class="upload-errors"></div>
</div>
</div>
</div>
<div class="media-frame-toolbar">
<div class="media-toolbar">
<div class="media-toolbar-secondary">
<div class="media-selection empty">
<div class="selection-info">
<span class="count">0 selected</span>
<button type="button" class="button-link edit-selection">Edit Selection</button>
<button type="button" class="button-link clear-selection">Clear</button>
</div>
<div class="selection-view">
<ul tabindex="-1" class="attachments" id="__attachments-view-74"></ul>
</div>
</div>
</div>
<div class="media-toolbar-primary search-form"><button type="button"
class="button media-button button-primary button-large media-button-insert" disabled="disabled">Insert
into post</button></div>
</div>
</div>
</div>
</div>
<div class="media-modal-backdrop"></div>
</div> -->
  </div>