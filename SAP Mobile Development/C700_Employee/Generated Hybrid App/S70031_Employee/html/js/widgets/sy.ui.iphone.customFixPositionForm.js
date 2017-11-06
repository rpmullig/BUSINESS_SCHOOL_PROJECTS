/*
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 * 
 * Original file date: 2012-Oct-22
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */

$.widget("sy.customFixPositioinForm", $.mobile.widget, {
    _create: function(){
    	
    	if ( ! (hwc.isIOS()|| hwc.isWindows()) ){
    		return;
    	}
    	//Clone current element and put it into custom-fix-position section 
    	var self = this, clone = this.element.clone();
        self.fixDiv = $( "<div data-role='custom-fix-position'></div>" )
        self.fixDiv.append( clone );
        
        //Hide original element and add the new cloned element outside of scroll, just above the footer.
        this.element.hide();
        var page  =this.element.closest('div[data-role="page"]');
        if ( page.length > 0 ) {
            var children = page.children();
            for( var i = 0; i < children.length; i++ ) {
                if ( children[i].getAttribute('data-role') === 'footer' && this.options.location === 'bottom') {
                	self.fixDiv.insertBefore( children[i]);
                     break;
                }
            }
         }
    },
   
    remove:function() {
    	if ( ! (hwc.isIOS()|| hwc.isWindows()) ){
    		return;
    	}
        if ( this.element !== null ) {
            this.element.remove();
        }
        if ( this.fixDiv !== null ) {
            this.fixDiv.remove();
        }
    },
    refresh: function( data ) 
    {
         //TODO;
    },
	
	options: {
		theme: null,
		location:'bottom'
	}
});
