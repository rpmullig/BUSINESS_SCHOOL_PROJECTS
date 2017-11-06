/*
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 * 
 * Original file date: 2012-Oct-22
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */

$.widget("sy.customButton", $.mobile.widget, {
    _create: function(){
        //  if there is an icon, add it now
        var icon = this.element.attr('data-icon');
        var iconpos = this.element.attr('data-iconpos');

        var anchorstr = '<a';
         if (icon != null) {
            linkstr = ' data-icon="' + icon +
                      '" data-iconpos="' + iconpos + '"';
            anchorstr += linkstr;
        }
        anchorstr += '>'
        
        var self = this,
        customBtDiv  = this.element.wrap( "<div class='ui-custom-button'>" ),
        pageTheme = this.element.closest('div[data-role="page"]').attr('data-theme'),
        button = ( $( anchorstr, {
                     "href": "#",
                     "role": "button"
                 }) )
                 .text(this.element.attr('value') )
                 .insertBefore( customBtDiv )
                 .buttonMarkup({
                 theme:pageTheme
                 });
       
        //hide button element itself.
        $(this.element[0]).addClass('ui-nojs');
     
     	//  Only look for image if there is no icon
        if (icon === null) {
            var imageEle = this.element.children();
     
            if (imageEle.length > 0) {
                var innerSpan = button.find('.ui-btn-inner');
                if (innerSpan.length > 0) {
                    var height = imageEle[0].height, width = imageEle[0].width;

                    var span = ($("<span>", {
                        "class" : "ui-button-image"
                    }));

                    innerSpan.append(span);

                    var img = $("<img>", {
                        "height" : height ? height:"",
                        "width" : width ? width :"",
                        "class" : "ui-image"
                    });

                    if ( imageEle[0].src && imageEle[0].src.length > 0 ) {
                        img.attr('src', imageEle[0].src );
                    }
                    span.append(img);
                }
            }
        }

        var pos = this.element.attr('label-position');
        var innerLabel = button.find('.ui-btn-text');
		
        if ( innerLabel && innerLabel.length > 0 ) {
            innerLabel.addClass('label-'+ pos);
        }
		
        if ( ( pos == 'center_top' || pos === 'center_bottom' )  ){
            innerLabel.addClass('label-center');
        }
		
        if (pos === 'center_bottom' && span  ) {
            span.insertBefore( button.find('.ui-btn-text'));
        }
        
        var bindingevents = "vclick";
        if ( isIOS()) {
            bindingevents = "click"; //tested on ios simulator, there is no vclick when clicked on the button
        }
        
        button.bind( bindingevents, function() { 
            self.button.addClass( $.mobile.activeBtnClass );
            setTimeout( function() {self.button.removeClass( $.mobile.activeBtnClass );}, 250);
            self.element.click()
        });
       
        self.button = button;
        this.refresh();
    },
    
    refresh: function( data ) 
    {
        // 1. button label changed.
        var txt = this.element.closest('.ui-custom-button').find('span.ui-btn-text');
        if (txt) {
            txt.html(this.element.attr('value'));
        } 
        // 2. button image changed.
        var images = $(this.element[0]).children();
        if (images.length > 0) {
            var btImage = this.element.closest('.ui-custom-button').find('img.ui-image');
            var imageSrc = images[0].getAttribute('src');
            if (imageSrc && imageSrc.length > 0) {
                btImage.attr('src', imageSrc);
            }
        }
    },

    options: {
        theme: null
    }
});
