(function( $, undefined ) {
	//special click handling to make widget work remove after nav changes in 1.4
	var href,
		ele = "";
	$( document ).on( "click", "a", function( e ) {
		href = $( this ).attr( "href" );
		var hash = $.mobile.path.parseUrl( href );
		if( typeof href !== "undefined" && hash !== "" && href !== href.replace( hash,"" ) && hash.search( "/" ) !== -1 ){
			//remove the hash from the link to allow normal loading of the page.
			var newHref = href.replace( hash,"" );
			$( this ).attr( "href", newHref );
		}
		ele = $( this );
	});
	$( document ).on( "pagebeforechange", function( e, f ){
			f.originalHref = href;
	});
	$( document ).on("pagebeforechange", function( e,f ){
		var hash = $.mobile.path.parseUrl(f.toPage).hash;
		if( typeof hash !== "undefined" && hash.search( "/" ) === -1 && hash !== "" && $( hash ).length > 0 && !$( hash ).hasClass( "ui-page" ) && $(hash).data('role') !== "page" && !$( ".ui-page-active " + hash ).hasClass( "ui-panel" ) && !$( ".ui-page-active " + hash ).hasClass( "ui-popup" )){
			//scroll to the id
			var pos = $( hash ).offset().top;
			$.mobile.silentScroll( pos );
			return false;
		} else if( typeof f.toPage !== "object" && hash !== "" && $.mobile.path.parseUrl( f.originalHref ).hash !== "" && !$( hash ).hasClass( "ui-page" ) && $(hash).attr('data-role') !== "page" && !$( ".ui-page-active " + hash ).hasClass( "ui-panel" ) && !$( ".ui-page-active " + hash ).hasClass( "ui-popup" )){
			$( ele ).attr( href, f.originalHref );
			$.mobile.document.one( "pagechange", function(){
				if( typeof hash !== "undefined" && hash.search( "/" ) === -1 && hash !== "" && $( hash ).length > 0 && !$( hash ).hasClass( "ui-page" ) && $(hash).data('role') !== "page" && !$( ".ui-page-active " + hash ).hasClass( "ui-panel" ) && !$( ".ui-page-active " + hash ).hasClass( "ui-popup" )){
					hash = $.mobile.path.parseUrl(f.originalHref).hash;
					var pos = $( ".ui-page-active " + hash) .offset().top;
					$.mobile.silentScroll( pos );
				}
			} );
		}
	});
	$( document ).on( "mobileinit", function(){
		hash = window.location.hash;
		$.mobile.document.one( "pageshow", function(){
			if( hash !== "" && $(hash).attr('data-role') !== "page" && !$( hash ).hasClass( "ui-page" ) && !$( ".ui-page-active " + hash ).hasClass( "ui-panel" ) && !$( ".ui-page-active " + hash ).hasClass( "ui-popup" ) && !$( hash ).is( "body" ) ){
				var pos = $( ".ui-page-active " + hash ).offset().top;
				setTimeout( function(){
					$.mobile.silentScroll( pos );
				}, 100 );
			}
		});
	});
	//h2 widget
	$( document ).on( "mobileinit", function(){
		$.widget( "mobile.h2linker", $.mobile.widget, {
			options:{
				initSelector: ":jqmData(quicklinks='true')"
			},

			_create:function(){
				var self = this,
					bodyid = "ui-page-top",
					panel = "<div data-role='panel' class='jqm-nav-panel jqm-quicklink-panel' data-position='right' data-display='overlay' data-theme='c'><ul data-role='listview' data-inset='false' data-theme='d' data-divider-theme='d' data-icon='false' class='jqm-list'><li class='jqm-list-header'>Jump to section</li></ul></div>",
					first = true,
					h2dictionary = new Object();
					if(typeof $("body").attr("id") === "undefined"){
						$("body").attr("id",bodyid);
					} else {
						bodyid =  $("body").attr("id");
					}
					this.element.find("h2").each(function(){
						var id, text = $(this).text();
						
						if(typeof $(this).attr("id") === "undefined"){
							id = text.replace(/[^\.a-z0-9:_-]+/i,"");
							$(this).attr( "id", id );
						} else {
							id = $(this).attr("id");
						}

						h2dictionary[id] =  text;
						if(!first){
							$(this).before("<a href='#"+bodyid+"' class='jqm-sections-link ui-link jqm-top-link'>Return to top<span class='ui-icon ui-icon-arrow-u'>&nbsp;</span></a>");
						} else {
							$(this).before("<a href='#'' data-ajax='false' class='jqm-sections-link ui-link jqm-top-link jqm-open-quicklink-panel'>Jump to section<span class='ui-icon ui-icon-bars'>&nbsp;</span></a>");
						}
						first = false;
					});
					this._on(".jqm-open-quicklink-panel", {
						"click": function(){
							$(".ui-page-active .jqm-quicklink-panel").panel("open");
							return false;
						}
					});
					this._on( document, {
						"pagebeforechange": function(){
							this.element.find(".jqm-quicklink-panel").panel("close");
							this.element.find(".jqm-quicklink-panel .ui-btn-active").removeClass("ui-btn-active");
						}
					});
					if( $(h2dictionary).length > 0 ){
						this.element.prepend(panel)
						this.element.find(".jqm-quicklink-panel").panel().find("ul").listview();
					}
					$.each(h2dictionary,function(id,text){
						self.element.find(".jqm-quicklink-panel ul").append("<li><a href='#"+id+"'>"+text+"</a></li>");
					});
					self.element.find(".jqm-quicklink-panel ul").listview("refresh");


			}
		});
	});
	$( document ).bind( "pagecreate create", function( e ) {
		var initselector = $.mobile.h2linker.prototype.options.initSelector;
		if($(e.target).data("quicklinks")){
			$(e.target).h2linker();
		}
	});
})( jQuery );