/*global bc:true */
/*jshint indent:2, browser: true, white: false, undef:false*/

/**
 * @class A blog view can render a list of items in a table-like view which the user can scroll through.
 * When the user taps on a blog item, the screen transitions to a detail view for the selected item.
 *
 * @constructor
 * @param options An object of the possible options for this view.  The only option available 
 * is the element that this view should load into.  By default, this will be the <code>body</code> tag.
 * @param ignore
 * @return A new blogview
 */
var blogview = ( function( $, undefined) {
  var _defaults,
      _currentArticleIndex,
      _settings,
      _self;
  
  _defaults = {
    "element": "body"
  };
  
  /**
   * @private
   */
  function blogview( options ) {

    _self = this;
    
    _settings = $.extend( {}, _defaults, options );
    
    _self.element = $( _settings.element );
    
    if( bc.context.initialized ) {
      _self.initialize();
    } else {
      $( bc ).one( "init", function() {
        _self.initialize();
      });
    }
    
    setTimeout( function() {
      
    }, 1000 );
  }
  
  /**
   * The initialize function is called if the <code>bc.core</code> has already been initialized 
   * or after the <code>init</code> function fires.
   */
  blogview.prototype.initialize = function() {
    var context = { 
          "showBackToMoreSection": bc.context.moreNavigationView 
        , "title": bc.core.getSetting( "titleOfPage" )  
        }

    if( !context.title ) {
      console.warn( "To set the title for this page you need to expose and set a setting for this view of 'titleOfPage' in the manifest.json file." );
      context.title = "";
    }
    
    _self.element.append( Mark.up( bc.templates["page-container-tmpl"], context ) );
    
    _self.detailsPage = $( ".blog-entry-detail" );

    bc.ui.init();
    
    /*Note that this should be unique to your app, which is why we prefix with viewID.*/
    _self.render( bc.core.cache( bc.viewID + "_blog_data" ) );
    
    /** The current data available for this view.*/
    bc.core.getData( "blog" 
                   , $.proxy( function( data ) {
                       this.render( data );
                     }, this )
                   , handleNoData );
      
    /** Tell the container that this view will support rotating in all directions */
    bc.device.setAutoRotateDirections( ['all'] );   
    
    bc.core.applyStyles();
    
    /** 
     * Finally, add in our event listeners so that we can react to user input.  Done after the call to render to ensure our
     * HTML elements exist.
     */      
    _self.registerEventListeners();
  }
  
  /**
   * Called if there is an error getting data. In the Studio, we show the spinner.
   */
  function handleNoData( error ) {
    //If we are in preview mode then show the spinner, otherwise do nothing
    if( bc.core.current_mode === bc.core.mode.PREVIEW ) {
      $( ".scroller .list-container" ).html( "" );
      $( ".scroller" ).append( Mark.up( bc.templates["error-msg-tmpl"], error ) );
      $( ".scroller .spinner" ).remove();
    }
  }

  /**
   * Responsible for the initial rendering of the page.  The loading page is shown immediately
   * so that the user has some feedback that something is happening.
   */
  blogview.prototype.render = function( data ) {
    if( !data || data === this.data || ( !data && bc.utils.numberOfProperties( _self.data ) === 0 ) ) {
     //no need to redraw the UI, so we should simply return
     return;
    }
    $( ".scroller .spinner" ).remove();
    $( ".scroller .error-message" ).remove();
    _self.data = data;
    bc.core.cache( bc.viewID + "_blog_data", data );
    $( ".page.blog .list-container" ).html( Mark.up( bc.templates["list-items-tmpl"], { "items": data } ) );
    bc.ui.refreshScrollers();
  };
  
  /**
   * Called when the user taps on a list item and navigates to the detail page
   * to see full information about a particular list entry.
   *
   * @param index The index of the list item that detail page is being built for.
   */
  blogview.prototype.buildDetailPage = function( index ) {
   var html = this.resizeBrightcovePlayers( Mark.up( bc.templates["detail-page-tmpl"], this.data[index] ) )
     , $html = $( html );
       
   $html.find( "a" ).addClass( "desc-c" );
   
   _self.detailsPage.find( ".list-container" ).html( html[0] );

   $( ".blog-entry-detail .header > h1" ).html( this.data[index].title );
   
   bc.ui.forwardPage( _self.detailsPage );
   
   this.currentArticleIndex = index;
   
   if( bc.metrics !== undefined ) {
     bc.metrics.startContentSession( this.data[this.currentArticleIndex].title, this.data[this.currentArticleIndex].title );
   }
  };
  
  /**
   * Resizes the Brightcove players, while maintaining the aspect ratio.
   * @param html The HTML snippet that contains the Brightcove Player.
   */
  blogview.prototype.resizeBrightcovePlayers= function( html ) {
    var $html = $( html ),
        $BrightcovePlayer = $html.find( ".BrightcoveExperience" ),
        width = $BrightcovePlayer.find( "[name='width']" ).attr( "value" ),
        height = $BrightcovePlayer.find( "[name='height']" ).attr( "value" ),
        newWidth,
        newHeight;
      
    newWidth = bc.ui.width() * 0.9;
    newHeight = ( newWidth * height ) / width;
    $BrightcovePlayer.find( "[name='width']" ).attr( "value", newWidth );
    $BrightcovePlayer.find( "[name='height']" ).attr( "value", newHeight );
    
    return $html;
  };

  /**
   * Register all event listeners for the blogview. The following events are
   * registered for with the associated handler.
   */
  blogview.prototype.registerEventListeners = function() {         
    $( bc ).bind( "newconfigurations", function( evt, info ) {
      _self.handleNewConfigurationInfo( info );
      } 
    );

    $( "body" ).delegate( ".blog-entry", "tap", function(evt) {
     _self.handleListEntryTap( evt );
    });

    $( "body" ).delegate( ".back-button", "tap", function() {
      _self.handleBackButtonTap();
    });
    
    $( bc ).bind( "viewfocus", function( evt ) {
      _self.handleViewFocus( evt );
    });
    
    $( bc ).bind( "viewblur", function( evt ) {
      _self.handleViewBlur( evt );
    });
  };
  
  /** Event handlers **/
  
  
  /** 
   * Handles the user tapping on the back button when in the detail page. This calls
   * into the {@link bc.ui#backPage} function to pop the detail view off the stack and
   * transition back to the list view.
   *
   * @param evt The event associated with the user tapping.
   */
  blogview.prototype.handleBackButtonTap = function( evt ) {
    bc.ui.backPage();
    bc.metrics.endContentSession( this.data[this.currentArticleIndex].title );
    this.currentArticleIndex = undefined;
  };
  
  /**
   * Handles the user tapping on a list item in the list view.
   * Call the {@link blogview#buildDetailPage} to transition
   * and render the detail page.
   */
  blogview.prototype.handleListEntryTap = function( evt ) {
    this.buildDetailPage( $(evt.currentTarget).data( "bc-entry-id" ) );    
  };
  
  /**
   * Handles new data becoming available to the view.  When new data comes in,
   * the view renders itself again with the new data.
   */
  blogview.prototype.handleNewConfigurationInfo = function( info ) {
    if ( info.status !== "error" && info.styles.isNew ) {
       bc.core.applyStyles( info.styles.values );
    }    
  };
  
  /**
   * Called when the "view" gains focus.
   * @param evt The event object that was fired with this event.
   */
  blogview.prototype.handleViewFocus = function( evt ) {
    if( this.currentArticleIndex !== undefined && bc.metrics !== undefined ) {
      bc.metrics.startContentSession( this.data[this.currentArticleIndex].title, this.data[this.currentArticleIndex].title );
    }
  };
  
  /**
   * Called when this "view" loses focus.  This occurs when the user switches to a different "view".
   * @param evt The event object that was fired with this event.
   */
  blogview.prototype.handleViewBlur = function( evt ) {
    //If we have a article viewing event then we need to kill it.
    if( this.currentArticleIndex !== undefined && bc.metrics ) {
      bc.metrics.endContentSession( this.data[this.currentArticleIndex].title );
    }
  };
  
  return blogview;  
})( bc.lib.jQuery );

/*************************
 * Pipes
 ************************/
 Mark.pipes.formatDate = function ( aDate ) {
   var date = new Date( aDate );
   if( date.toString() === "Invalid Date" ) {
     bc.utils.warn( "Invalid Date passed to blogview" );
     return "";
   } else {
     return date.toLocaleDateString();
   }
 };