(function($) {
  
  // ================================================================
  // pettingzoo behaviors
  // ================================================================

  var pettingzoo = { // namespace setup

    config : {

      // Settings
      // -> global vars go here
      // --------------------------------------------------------------- 
      carousel: ".carousel", // class of carousel elements
      tabs: "nav.local.tabs",
      accordion: ".accordion-header"
    },

    // Setup
    // ---------------------------------------------------------------
    init : function(config) {
      $.extend(pettingzoo.config, config);

      // fall back to .animate() frame animation is CSS transitions are not supported
      // -> for transit.js
      if (!$.support.transition) {
        $.fn.transition = $.fn.animate;
      }

      // if SVG isn't supported, swap out SVGs for corresponding PNGs
      if (!Modernizr.svg) {
        $(".logo img").attr("src", "assets/images/logo-pettingzoo.png");
      }

      // set up enquire.js stuff
      pettingzoo.registerBreakpoints();
      pettingzoo.tabs.init(pettingzoo.config.accordion); // set up accordion version of tabs (mobile/default)

      // set up hero carousel
      $(pettingzoo.config.carousel).flexslider({
        selector: "ul > li",
        allowOneSlide: false,
        namespace: "carousel-",
        directionNav: false
      });
    },

    // Methods
    // ------------------------------------------------------------------

    // --- Enquire.js breakpoints --------------------------------------
    registerBreakpoints : function() {

      // iPad screens and up: > 768px
      // ---------------------------------------------------------------------
      enquire.register("only screen and (min-width: 48em)", {

        deferSetup : true,

        setup : function() {
          pettingzoo.tabs.init(pettingzoo.config.tabs);
        },

        match : function() {
          console.log("match");
          // pettingzoo.tabs.kill(pettingzoo.config.accordion);
          pettingzoo.tabs.multiple = false;
          pettingzoo.tabs.reset(pettingzoo.config.tabs);
          // pettingzoo.tabs.init(pettingzoo.config.tabs);
        },

        unmatch : function() {
          console.log("unmatch");
          // pettingzoo.tabs.kill(pettingzoo.config.tabs);
          pettingzoo.tabs.multiple = true;
          // pettingzoo.tabs.init(pettingzoo.config.accordion);
        }
      });
    },

    // --- Local navigation (tabs & accordion) --------------------------------------
    tabs : {

      // settings
      // ----------------------------------------------------------------------------------
      active : "active", // the class of the active (current) tab
      open: "is-open", // the class of the content currently displayed
      multiple: true, // can multiple tabs be open? (for accordion state)

      // methods
      // ----------------------------------------------------------------------------------

      init : function(el) {
        // ----- Local nav (tabs) -------------------------------------------------------------
        //  -> http://www.jacklmoore.com/notes/jquery-tabs/


        $(el).each(function(){
          // For each set of tabs, we want to keep track of
          // which tab is active and it's associated content
          var $active, $content, $links = $(this).find('a');

          // If the location.hash matches one of the links, use that as the active tab.
          // If no match is found, use the first link as the initial active tab.
          $active = $links.filter("." + pettingzoo.tabs.active);
          $content = $($active.attr('href'));

          // console.log("active tab: " + $active);

          // if multiple active tabs are not allowed...
          if (pettingzoo.tabs.multiple != true) {
            // Hide the remaining content
            $links.not($active).each(function () {
              $($(this).attr('href')).removeClass(pettingzoo.tabs.open);
            });
          }

          // Bind the click event handler
          $(this).on('click', 'a', function(e){

            console.log("multiple: " + pettingzoo.tabs.multiple);

            // if multiple active tabs are not allowed...
            if (pettingzoo.tabs.multiple != true) {
              // Make the old tab inactive.
              $active.removeClass(pettingzoo.tabs.active);
              $content.removeClass(pettingzoo.tabs.open);

              // Update the variables with the new link and content
              $active = $(this);
              $content = $($(this).attr('href'));

              // Make the tab active.
              $active.addClass(pettingzoo.tabs.active);
              $content.addClass(pettingzoo.tabs.open);
            } else {
              // Update the variables with the new link and content
              $active = $(this);
              $content = $($(this).attr('href'));

              // Make the tab active.
              $active.toggleClass(pettingzoo.tabs.active);
              $content.toggleClass(pettingzoo.tabs.open);
            }

            // Prevent the anchor's default click action
            e.preventDefault();
          });
        });
      },

      kill : function(el) {
        $(el).each(function() {
          $(this).find('a').each(function() {
            $(this).removeClass(pettingzoo.tabs.active);
            $($(this).attr('href')).removeClass(pettingzoo.tabs.open);
          });
        });
      },

      reset : function(el) {
        var $link = $(el).find('a').first();
        $link.addClass(pettingzoo.tabs.active);
        $($link.attr('href')).addClass(pettingzoo.tabs.open);
      }
    }
    
  };

  
  $(window).load(function() {
    pettingzoo.init();
  });
})(jQuery);
