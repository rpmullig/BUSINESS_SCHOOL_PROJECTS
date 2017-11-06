/*
 * Sybase Hybrid App version 2.2
 * 
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 * 
 * Original file date: 2012-Oct-24
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */
 
/**
 * @namespace The namespace for the Hybrid Web Container javascript
 */
hwc = (typeof hwc === "undefined" || !hwc) ? {} : hwc;		// SUP 'namespace'

$.widget("mobile.sylistview", $.extend({},$.mobile.listview.prototype, (function(orig) { return {
    _create:function() {
    	this.Used_Paddings = 10 +35 + 2 + 20 ;//left and right paddings for a list 30 + 35px, and 2px border and 20 px for icon
       //	this.widgetEventPrefix="sylistview";
       if (this.options.hasFilterBar === "true") {
           //  we need filter bar before the header
           this.options.createHeaderLater = "true"		//  we need filter bar before the header
       }

       if ( this.options.showViewHeader && ! this.options.createHeaderLater ) {
           this._createHeader();
       }
       
       var self = this;
       
       //  These options can't be combined.  Force bubble count off.   
       if (this.options.isDivideratBegin === "true") {
           this.options.useBubbleCount = "false";
       }
           
       var filterOptions = "";
       if (this.options.hasFilterBar === "true") {
           filterOptions += ' data-filter="true"';
           if (this.options.filterBarText != "") {
               filterOptions += ' data-filter-placeholder="' + this.options.filterBarText + '"';
           }
           var pageTheme = this.element.closest('div[data-role="page"]').attr('data-theme');
           filterOptions += ' data-filter-theme="' + pageTheme + '" ';
        }
       
       this.element.listview = $('<ul class="listview"' + filterOptions + 'id="listview_' + this.element.attr('id') + '" data-role="' +
           this.getDataRole() + '" data-inset="' + this.options.inset + '" >');
       this.element.append( this.element.listview );
 
       $(window).bind("throttledresize",function(){
           self.orientationChanged();
       });

       this._listviewCreate();
    },

    _listviewCreate:function() {
        var t = this,
        listviewClasses = "";

        listviewClasses += t.options.inset ? " ui-listview-inset ui-corner-all ui-shadow " : "";
        listviewClasses += t.element.jqmData( "mini" ) || t.options.mini === true ? " ui-mini" : ""; 
        
        // create listview markup 
        t.element.addClass(function( i, orig ) { 
            return orig + " ui-listview " + listviewClasses; 
        }); 
        
        t.refresh( true ); 
    },
    
    orientationChanged:function() {
        if ( (this.element.listview.height() > 0 ) ) {
            if (isAndroid()) {
                this.updateOnVisible(this.element.closest('div[data-role="page"]').attr('id') , true );
            }

            this.orientation = window.orientation;
            var fields =$.mobile.activePage.find(".lv_line_field" );
            var j;
            for ( j=0;j < fields.length; j++ ) {
                var fw = $( fields[j]).attr('field_width');
                var lineW =   window.innerWidth - this.Used_Paddings;
                var ww=  parseInt(lineW) * parseInt(fw) /100;
                $( fields[j]).css('width',ww  );
            }
        }
    },
      
    updateUIFromWorkFlowMessage:function( params ) {
        if ( this.options.showViewHeader && this.options.createHeaderLater ) {
            this._createHeader();
        }

        var id = this.element[0].getAttribute('id');
        var data  = params[0].getData( id );
        
        if (!data) {
            data = new MessageValue();
            data.setType("LIST");
            data.setKey(id);
            data.setValue(new Array(0));
            params[0].add(id, data);
        }
  
        var dataValue = data.value;
        var wrapData = this.element[0].getAttribute('wrap_data');
        wrapData = wrapData != null && wrapData === "true"; 

        var fields = this.options.fields;
        var lines = this.options.lines;
        var cellstr = "";
    
        this.element.listview[0].innerHTML = "";
        var pixelRatio2 = "";

        if ( window.devicePixelRatio && window.devicePixelRatio >= 2 ) {
            pixelRatio2 =" ui-icon-arrow-r-pixelratio-2";
        }

        var numValues = dataValue.length;
        var pageTheme = this.element.closest('div[data-role="page"]').attr('data-theme');
        var hasCustomCreateListviewLineContentFunction = (typeof(customCreateListviewLineContent) === 'function');

        //******************************************************************************************
        //*   Loop through every row creating <li> items
        //******************************************************************************************
        for (var valuesIdx = 0; valuesIdx < numValues; valuesIdx++) { //for each values in a list
            var listValues = dataValue[valuesIdx];
            if (listValues.getState() === "delete") {
                continue;
            }
                  
            var test =valuesIdx/2 -  Math.round(valuesIdx/2 );
            var setAltClr =  test < 0  && this.options. alternateColor.length > 0;
            var alterClr =  this.element.attr('screen') + "_defaultColor ";  
            if (setAltClr ) {
                alterClr = this.element.attr('screen') + "_alternateColor ";
            }
            
            var beginStr = '<li class="'+ alterClr + this.options.liNormalClasses + ' ui-btn-up-' + pageTheme + '" id="'+ valuesIdx + '">';
            beginStr += '<div class="ui-btn-inner">';
            beginStr += '<div class="ui-btn-text">';
            
            beginStr += '<a href="" class="' + this.options.aClasses + '" id="' + listValues.getFullKey() + '">';
         
            //******************************************************************************************
            //*   Now create multiple lines for the various fields in the row
            //******************************************************************************************
            cellstr += this._createLines( beginStr, data, valuesIdx, false, wrapData, hasCustomCreateListviewLineContentFunction, pageTheme );
             
            if ( this.options.onItemSelected !== null ) { // we don't use link for Blackberry, since it reloads the page.
                cellstr += '</a><span class="' + this.options.spanClasses + pixelRatio2 + '"></span></div></div></li>';
            }
            else {
            	cellstr += '</a></div></div></li>';
            }
        }

        //  ******************************************************************************
        //  If divider is at the end of group, we need to generate an ending divider now.
        //  ******************************************************************************
        if ((this.options.isDivideratBegin === "false") && (this.options.useDividers === "true") && (this.options.dividerCode != "2"))
        {
            var dividerLine = "";
            if (this.options.usePageTheme === "true")
                dividerLine = '<li class="ui-li ui-li-divider ui-bar-' + pageTheme + '">';  
            else
                dividerLine = '<li class="ui-li ui-li-divider ui-bar-b">';

            var countLine = '<span class="sy-li-count ui-btn-up-c ui-btn-corner-all">';
            this.options.divCount++;

            //  generate a divider
            if (this.options.divValue != "sy.ui.iphone.listview.js") 
            {
               var divider = dividerLine + this.options.divValue;
               if (this.options.useBubbleCount === "true")
               {
                   divider += countLine;
                   divider += this.options.divCount;
                   divider += '</span></li>'; 
                   this.options.divCount = 0; 
               }
               else
                   divider += '</li>';
                   
               cellstr += divider; 
               this.options.divValue = "sy.ui.iphone.listview.js";		//  indicates the value hasn't been set
            }
        }

        if (numValues === 0 && this.options.onEmptyList) {
            cellstr += '<li role="option" class="' + this.options.liEmptyClasses + ' ui-btn-up-' + pageTheme + '">';
            cellstr += '<div class="ui-btn-inner">';
            cellstr += '<div class="ui-btn-text">';
            cellstr += '<div class="lv_line">';

            var value  =this.options.onEmptyList;

            var lineWidth = screen.width -40; //20 for arrow and 20 for margins
            var w = parseInt( lineWidth );
            var style = ' float: left; width:' + w + 'px;' + 'font-style:normal;font-weight:normal';
            var s = '<div class="lv_line_field" style="'+ style +'">'+ value+'</div>';

            cellstr += s;
            cellstr += '</div>'; //end of line;
            cellstr += '<span class="' + this.options.spanClasses + pixelRatio2 + '"></span></div></div></li>';
        }
       
       	this.element.listview.append(cellstr);

        if ( this.options.isFirstControl ) {
            this.element.listview.addClass("listviewfirst");

            if ( this.options.hasFilterBar  === 'true') {
                this.element.listview.addClass("showFilter");
            }
        }
    	
        //  Make sure we refresh the style for inset, do this after filter
        this.refresh(false);

        // <-- jira #NA12-2745
        var requestedScreen = "";
        if ( params.length > 1 ) {
            requestedScreen = params[1];
            var currentScreen = hwc.getCurrentScreen();
            if ( requestedScreen === currentScreen ) {
                $('div[data-role="content"]',$.mobile.activePage[0] ).scrollview('refresh');
            }
        }
        // --->

        if (numValues > 0 || !this.options.onEmptyList) {
            var self = this;
            if (isWindows()) {
                this.element.bind('click', function() {
                    var anchor = event.target;
                    if ( anchor.tagName == 'SPAN' ){ //we are clicked on icon
                        anchor = anchor.previousSibling;
                    }

                    while (anchor.nodeType != 1 || anchor.tagName !== 'A') {
                        anchor = anchor.parentNode;
                    }
                    var li = anchor.parentElement.parentElement.parentElement;
                    $(li).addClass('ui-btn-down-' + pageTheme);
                    if ( self.options.onItemSelected != null) {
                       self.options.onItemSelected( anchor );
                    }
                    $(li).removeClass('ui-btn-down-' + pageTheme);
                });
            }
            else {
                var that = this;
                this.element.bind('touchstart',  function() {
                    that.isTouchMove = false;
                });

                this.element.bind('touchmove',  function() {
                    that.isTouchMove = true;
                });

                var eventToHandle = '';
                if (isAndroid() || isIOS()) {
                   eventToHandle = 'touchend';
                }
                else if (isBlackBerry()) {
                    if (isBlackBerry7()) {  //BlackBerry 7 both touchend and click were being fired when a listview row was touched on a touch screen or via a mouse click in a simulator
                        eventToHandle = 'click';
                    }
                    else {
                        eventToHandle = 'touchend click';  //BB devices using trackpad require click event.  Touchscreen requires touchend.
                    }
                }
                

                this.element.bind(eventToHandle,  function( event) {
                    if ( that.isTouchMove ) {
                        return;
                    }

                    //Find the anchor
                    var anchor  = event.target;

                    if ( anchor.tagName == 'SPAN' ){ //we are clicked on icon
                       anchor = anchor.previousSibling;
                    }
	                
                    while (anchor.nodeType != 1 || anchor.tagName !== 'A') {
                        anchor = anchor.parentNode;
                    }
                  
                   if ( isBlackBerry5()) //It seems Blackberry 5 doesn't parentElement, 
                   {
                		$(anchor.parentNode.parentNode.parentNode).addClass("ui-btn-down-" + pageTheme);
                   }else {
                        $(anchor.parentElement.parentElement.parentElement).addClass("ui-btn-down-" + pageTheme);
                   }
                   if ( self.options.onItemSelected != null ) {
                        if ( isAndroid()) {  
                            setTimeout( function(){self.options.onItemSelected( anchor   );  }, 50)
                        }
                        else {
                            self.options.onItemSelected(anchor  );
                        }
                    } 
                });
            }
        }
     },
    
    _createLines:function(beginStr, data, valuesIdx, isForHeader, wrapData, hasCustomCreateListviewLineContentFunction, pageTheme ) {
        var lines = this.options.lines;
        var isLocaleDisplay = this.options.isLocalizedDisplay;
        var cellstr = "";
        var listValues =  null;
                       
        if (data != null) {
            listValues = data.value[valuesIdx];
        }
        
        var test = valuesIdx/2 - Math.round(valuesIdx/2 );
        var setAltClr = test < 0 && this.options.reversedColor.length > 0;
        var addStyle = "";
        if (setAltClr) {
            //  Need special case of text color
            addStyle = ' style="' + ' color: ' + this.options.reversedColor + '"';
        }

        var numLines = lines.length;
        
        //  Loop thru each cell line
        for (var l = 0; l < numLines; l++ ) {

            //  ***********************************************
            //  Determine if we should generate a Divider line
            //  ***********************************************
            var numFields = lines[l].length;
            if ((this.options.useDividers === "true") && (!isForHeader) && (l == 0))     //  Only do a divider on the 1st line
            {
                var dividerLine = "";
                if (this.options.usePageTheme === "true")
                    dividerLine = '<li class="ui-li ui-li-divider ui-bar-' + pageTheme + '">';  
                else
                    dividerLine = '<li class="ui-li ui-li-divider ui-bar-b">';

                var countLine = '<span class="sy-li-count ui-btn-up-c ui-btn-corner-all">';

                //  ***********************************
                //  If Bubble count, set up a counter
                //  ***********************************
                if ((this.options.useBubbleCount === "true") && (this.options.divValue != "sy.ui.iphone.listview.js"))
                    this.options.divCount++;

                if (this.options.dividerCode === "2")
                {
                    //  ***************************************
                    //  Custom.js code is provided by the user
                    //  ***************************************
                    var fieldValue = { displayValue: "" };
                    if (customShouldGenerateListViewDivider (lines[l], listValues, fieldValue)) 
                    {
                        //  generate a divider
                        var divider = dividerLine + fieldValue.displayValue;
                        if (this.options.useBubbleCount === "true")
                        {
                            divider += countLine;
                            divider += this.options.divCount;
                            divider += '</span></li>'; 
                            this.options.divCount = 0; 
                        }
                        else
                            divider += '</li>';

                        cellstr += divider; 
                     }
                }

                else if (this.options.dividerCode === "3")
                {
                    //  ***************************************
                    //  Use the specified field as the divider
                    //  ***************************************

                    //  The field can be in any line, so we need to look 
                    //  for the field by looping thru the lines and fields
                    var found = 0;
                    for (var l2 = 0; l2 < numLines; l2++ ) 
                    {
                        var fldnums = lines[l2].length;
                        for (var f2 = 0; f2 < fldnums; f2++ ) 
                        {
                            var field = lines[l2][f2];
                            //  Found the field to be used for the divider 
                            if (field.id == this.options.dividerField) 
                            {
                                var fieldData = (listValues) ? listValues.getData(field.id) : listValues;
                                if (fieldData == null) continue;
                                
                                found = 1;
                                var divComp = fieldData.value;
                                var comp1 = divComp;
                                var value1 = this.options.divValue;
                                if (this.options.caseSensitiveDividers === "true") 
                                {
                                    comp1 = divComp.toLowerCase();
                                    value1 = this.options.divValue.toLowerCase();
                                }
                                if ((this.options.isDivideratBegin === "false") && (this.options.divValue == "sy.ui.iphone.listview.js"))
                                {
                                    // First time through
                                    this.options.divValue = divComp;
                                }
                                else if (comp1 != value1) 
                                {
                                    //  generate a Divider
                                    var displayField = divComp;
                                    if (this.options.isDivideratBegin === "false") 
                                    {
                                        //  If display divider at group end, then use the divValue field
                                        displayField = this.options.divValue;
                                        divEnd = divComp;    //  Save the value for the last line
                                    }
                                    var divider = dividerLine + displayField;
                                    if (this.options.useBubbleCount === "true")
                                    {
                                        divider += countLine;
                                        divider += this.options.divCount;
                                        divider += '</span></li>'; 
                                        this.options.divCount = 0; 
                                    }
                                    else
                                        divider += '</li>';
                                        
                                    this.options.divValue = divComp;
                                    cellstr += divider; 
                                }
                                else 
                                {
                                    this.options.divValue = divComp;
                                }
                                break;
                            }
                        }
                        if (found == 1)
                            break;
                    }
                }
                
                else
                {
                    //  ***************************************
                    //  Use the default, first letter of first field
                    //  ***************************************
                    if (numFields > 0) 
                    {
                        var field = lines[l][0];    // Look at the first field
                        var fieldData = (listValues) ? listValues.getData(field.id) : listValues;
                        var divComp = fieldData.value.substring( 0,1 );
                        var comp1 = divComp;
                        var value1 = this.options.divValue;
                        if (this.options.caseSensitiveDividers === "true") 
                        {
                            comp1 = divComp.toLowerCase();
                            value1 = this.options.divValue.toLowerCase();
                        }
                        if ((this.options.isDivideratBegin === "false") && (this.options.divValue == "sy.ui.iphone.listview.js"))
                        {
                            // First time through
                            this.options.divValue = divComp;
                        }
                        else if (comp1 != value1) 
                        {
                            //  generate a divider
                           var displayField = divComp;
                           if (this.options.isDivideratBegin === "false") 
                            {
                                //  If display divider at group end, then use the divValue field
                                displayField = this.options.divValue;
                                divEnd = divComp;    //  Save the value for the last line
                            }
                            var divider = dividerLine + displayField;                            
                            if (this.options.useBubbleCount === "true")
                            {
                                divider += countLine;
                                divider += this.options.divCount;
                                divider += '</span></li>'; 
                                this.options.divCount = 0; 
                            }
                            else
                                divider += '</li>';
                            this.options.divValue = divComp;
                            cellstr += divider; 
                          }
                        else 
                        {
                            this.options.divValue = divComp;
                        }
                    }
                }
            } //  end of Divider logic

            if ((!isForHeader) && (l == 0)) {
                if (beginStr != null) {
                    cellstr += beginStr;          //  Now add beginning code, after all dividers are added for previous row
                    if (listValues != null) {
                        cellstr += '<div class="lv_lines" ' + addStyle + 'id="' + listValues.getFullKey() + '">';
                    }
                    else {
                        cellstr += '<div class="lv_lines" ' + addStyle + '>';
                    }
                    beginStr = "";
                }
            }

            cellstr += '<div class="lv_line">';

            // Allow the user to override how this line of the listview will be constructed
            if(hasCustomCreateListviewLineContentFunction) {
                var lineContent = customCreateListviewLineContent(this, valuesIdx, l, lines[l], data, isForHeader, wrapData);
                if (lineContent) {
                    cellstr += lineContent;
                    cellstr += '</div>'; //end of line
                    continue;
                }
            }

            // If the user hasn't overridden it, proceed normally
            //  Loop thru each field
            for (var f = 0; f < numFields; f++ ) {
                var field = lines[l][f];
                var fieldData = (listValues) ? listValues.getData(field.id) : listValues;
                var value = field.name;
                if ( fieldData && fieldData.value ) {
                    value  = fieldData.value;

                    if (field.dataType === "DATE") {
                        var aDate = undefined;
                        var strIdx = value.indexOf("T");
                        if (strIdx !== -1) {
                            aDate = new Date(hwc.parseDateTime(null, value.substr(0, strIdx)));
                        }
                        else {
                            aDate = new Date(hwc.parseDateTime(null, value));
                        }
                        if (isLocaleDisplay === "true") {
                            value = hwc.getLocaleDateString(aDate);
                        }
                        else {
                            value = hwc.getISODateString(aDate);
                        }
                    } 

                    else if (field.dataType === "TIME") {
                        var aTime = undefined;
                        var strIdx = value.indexOf("T");
                        if (strIdx !== -1) {
                            aTime = new Date(hwc.parseTime(value.substr(strIdx+1)));
                        }
                        else {
                            aTime = new Date(hwc.parseTime(value));
                        }
                        if (isLocaleDisplay === "true") {
                            value = hwc.getLocaleTimeString(aTime);
                        }
                        else {
                            value = hwc.getISOTimeString(aTime);
                        }
                    }

                    else if (field.dataType === "DATETIME") {
                        var aDateTime = new Date(hwc.parseDateTime(null, value));
                        aDateTime = hwc.convertUtcToLocalTime(aDateTime);
                        if (isLocaleDisplay === "true") {
                            value = hwc.getLocaleDateTimeString(aDateTime);
                        }
                        else {
                            value = hwc.getISODateTimeString(aDateTime);
                        }
                    }

                    else if (field.dataType === "IMAGE" && field.static) {
                        value ='<img data-role="none" src="' + fieldData.value +'" height="' + field.height + '"/>';
                    }

                    else if ( field.dataType === "IMAGE" && !field.static) {
                        value ='<img data-role="none" src="data:image/jpeg;base64,' + fieldData.value +'" height="' + field.height + '"/>';
                    }

                    if (value === '') {
                        // Empty value.  Use a filler to maintain row height for the value.
                        value = '<p></p>';
                    }
                    else {
                        if (wrapData) {
                            // User has HTML tags that they want treated as text
                            // in the list, not markup.  Replace all &, <, and >
                            // and wrap in PRE and CODE tags.
                            value = value.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                            value = "<PRE><CODE>" + value + "</CODE></PRE>";
                        }
                    }

                } else if (!isForHeader) {
                    // No data for the field.id, use a filler
                    value = '<p></p>';
                }
                
                var lineWidth = window.innerWidth - this.Used_Paddings;
                var w = parseInt( lineWidth * field.width/100);
                var font = "normal";
                if (data != null) { 
                    font = field.font;
                }
                var style = ' float: left; width:' + w + 'px;' + 'font-style:' + font +';font-weight:normal';

                if (field.font == "bold") {
                    style = style.replace('font-weight:normal', 'font-weight:bold');
                } 

                if (field.dataType === 'IMAGE' && !isForHeader) {
                    var style = ' float: left; width:' + w + 'px; height:' + field.height +'px';
                }

                //  ***********************************************
                //  Determine if we want line numbers
                //  ***********************************************
                var sclass = "lv_line_field";
                if ((this.options.numbered === "true") && (!isForHeader) && f == 0 && (l == 0))
                {
                    sclass = "lv_linefield_numbered";
                }
                var s = '<div class="' + sclass + '" field_width="' + field.width + '" style="' + style + '">' + value + '</div>';
                cellstr += s;
            }
            cellstr += '</div>'; //end of line;
          
        }

        cellstr += '</div>'; //end of lines 
        return cellstr;
    },

    _createHeader:function() {
        var parents = this.element.parents();
        var hasCustomCreateListviewLineContentFunction = (typeof(customCreateListviewLineContent) === 'function');
       
        var page = null;
        for ( var i = 0; i < parents.length; i++) {
            var node = parents.get(i);
            if ($(node).attr('data-role') == 'page') {
	                page = node;
                break;
            }
        }
      
       // var children = page.children; BB5 doesn't like page.children.
        var children =page.childNodes;
        var pageTheme = this.element.closest( 'div[data-role="page"]').attr('data-theme');
       
        var listheader = $('<div class="ui-bar-'+ pageTheme + ' listview_header "  data-role="listview_header">');
        var header = null;
        if (page != null) {
            for (var i = 0; i < children.length; i++) {
                if ($(children[i]).attr('data-role') == 'header') {
                    header = children[i];
                    break;
                } 
            }
        }

        //  If inset style, then round the corners of the header DIV
        if (this.options.inset === "true") {
            listheader.add( listheader.find( ".ui-btn-inner" )
                .not( ".ui-li-link-alt span:first-child" ) )
                .addClass( "ui-corner-top" )
                .end()
                .find( ".ui-li-link-alt, .ui-li-link-alt span:first-child" )
                .addClass( "ui-corner-tr" )
                .end()
                .find( ".ui-li-thumb" )
                .not(".ui-li-icon")
                .addClass( "ui-corner-tl" );
               
             listheader.add( listheader.find( ".ui-btn-inner" ) )
                .find( ".ui-li-link-alt" )
                .addClass( "ui-corner-br" )
                .end()
                .find( ".ui-li-thumb" )
                .not(".ui-li-icon")
                .addClass( "ui-corner-bl" );
        }
        
        if (this.options.createHeaderLater) {
            // The listview is not the first control on the screen, we need to create header stick on top of listview.
            listheader.insertBefore(this.element.listview);
            listheader.css('marginLeft',   "0px");
            listheader.css('marginRight',  "0px");
            listheader.css('marginTop',    "0px");
            listheader.css('marginBottom', "-5px");
            listheader.append(this._createLines(null, null, null, true, undefined, hasCustomCreateListviewLineContentFunction, pageTheme));
            this.options.createHeaderLater = false;
        } 
        else { 
            // create on the top of the screen since the listview is the first control on the screen or only control on the screen.
            if (header != null && this.options.showViewHeader) {
                $(header).after(listheader);
                listheader.append(this._createLines(null, null, null, true, undefined, hasCustomCreateListviewLineContentFunction, pageTheme));
            }
        }
     },
  
     getDataRole:function () {
         return "sylistview";
     },

     _removeCorners: function( li, which ) {
         var top = "ui-corner-top ui-corner-tr ui-corner-tl",
             bot = "ui-corner-bottom ui-corner-br ui-corner-bl";

         li = li.add( li.find( ".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb" ) );
         if ( which === "top" ) {
             li.removeClass( top );
         } else if ( which === "bottom" ) {
             li.removeClass( bot );
         } else {
             li.removeClass( top + " " + bot );
         }
     },

     _refreshCorners: function( create ) {
         var $li,
             $visibleli,
             $topli,
             $bottomli;
     
         if ( this.options.inset === "true") 
         {
             $li = this.element.children( "li" );
             if ($li.length === 0) {		//  The method of finding children may be different depending on device platform
                 $li = this.element.children().find('li');
             }

             // at create time the li are not visible yet so we need to rely on .ui-screen-hidden
             $visibleli = create?$li.not( ".ui-screen-hidden" ):$li.filter( ":visible" );
     
             if (this.options.showViewHeader) {
                 this._removeCorners($li, "bottom");
             }
             else {
                 this._removeCorners($li);
             }     
             
             if (!this.options.showViewHeader) {		
                 // Select the first visible li element
                 $topli = $visibleli.first().addClass( "ui-corner-top" );
     
                 $topli.add( $topli.find( ".ui-btn-inner" )
                     .not( ".ui-li-link-alt span:first-child" ) )
                     .addClass( "ui-corner-top" )
                     .end()
                     .find( ".ui-li-link-alt, .ui-li-link-alt span:first-child" )
                     .addClass( "ui-corner-tr" )
                     .end()
                     .find( ".ui-li-thumb" )
                     .not(".ui-li-icon")
                     .addClass( "ui-corner-tl" );
             }
             
             // Select the last visible li element
             $bottomli = $visibleli.last()
                 .addClass( "ui-corner-bottom" );
     
             $bottomli.add( $bottomli.find( ".ui-btn-inner" ) )
                 .find( ".ui-li-link-alt" )
                 .addClass( "ui-corner-br" )
                 .end()
                 .find( ".ui-li-thumb" )
                 .not(".ui-li-icon")
                 .addClass( "ui-corner-bl" );
         }
         if ( !create ) {
            this.element.trigger( "updatelayout" );
         }

    },
     	
    refresh: function( create ) {
        var o = this.options,
           $list = this.element,
        self = this;

        if ( !o.theme ) {
            o.theme = $.mobile.getInheritedTheme( this.element, "c" );
        }
		
        this._refreshCorners( create );

        if (create) {
            if (this.options.hasFilterBar === "true") {
                this.refreshFilter();
             }
        }
    },
	
    refreshFilter: function() {
        var listview = this;
        var list = $(listview.element[0].children[1] );
        var wrapper = $( "<form>", {
            "class": "ui-listview-filter ui-bar-" + listview.options.filterTheme,
            "role": "search"
        }),
        search = $( "<input>", {
            placeholder: listview.options.filterBarText
        })
        .attr( "data-" + $.mobile.ns + "type", "search" )
        .jqmData( "lastval", "" )
        .bind( "keyup change", function() {
	
        var $this = $(this),
            val = this.value.toLowerCase(),
            listItems = null,
            lastval = $this.jqmData( "lastval" ) + "",
            childItems = false,
            itemtext = "",
            item;
	
        // Change val as lastval for next execution
        $this.jqmData( "lastval" , val );
        if ( val.length < lastval.length || val.indexOf(lastval) !== 0 ) {
            // Removed chars or pasted something totally different, check all items
            listItems = list.children();
        } else {
            // Only chars added, not removed, only use visible subset
            listItems = list.children( ":not(.ui-screen-hidden)" );
        }
	
        if ( val ) {
            // This handles hiding regular rows without the text we search for
            // and any list dividers without regular rows shown under it
	
        for ( var i = listItems.length - 1; i >= 0; i-- ) {
            item = $( listItems[ i ] );
            itemtext = item.jqmData( "filtertext" ) || item.text();
	
            if ( item.is( "li:jqmData(role=list-divider)" ) ) {
                item.toggleClass( "ui-filter-hidequeue" , !childItems );
	
                // New bucket!
                childItems = false;
	
            } else if ( listview.options.filterCallback( itemtext, val ) ) {
                //mark to be hidden
                item.toggleClass( "ui-filter-hidequeue" , true );
            } else {
                // There's a shown item in the bucket
                childItems = true;
            }
        }
	
        // Show items, not marked to be hidden
        listItems
            .filter( ":not(.ui-filter-hidequeue)" )
            .toggleClass( "ui-screen-hidden", false );
	
        // Hide items, marked to be hidden
        listItems
            .filter( ".ui-filter-hidequeue" )
            .toggleClass( "ui-screen-hidden", true )
            .toggleClass( "ui-filter-hidequeue", false );
	
        } else {
            //filtervalue is empty => show all
        listItems.toggleClass( "ui-screen-hidden", false );
        }
            listview._refreshCorners();
        })
            .appendTo( wrapper )
            .textinput();
	
        if ( listview.options.inset ) {
            wrapper.addClass( "ui-listview-filter-inset" );
        }
        wrapper.bind( "submit", function() {
            return false;
        }).insertBefore( list );
    }, 
	
options : {
    lines : null,
    data:[],
    showViewHeader:false,
    onEmptyList:"",
    alternateColor:"",
    reversedColor:"",
    onItemSelected:null,
    inset:"false",
    isLocalizedDisplay:"false",
    useDividers:"false",
    dividerCode:"1",
    caseSensitiveDividers:"false",
    dividerField: null,
    numbered:"false",
    useBubbleCount:"false",
    isDivideratBegin:"true",
    usePageTheme:"false",
    hasFilterBar:"false",
    filterBarText:"",
    createHeaderLater:"false",
    divValue:"sy.ui.iphone.listview.js",		//  indicates the value hasn't been set
    divCount:0,
    divEnd:"",
    liNormalClasses : "ui-btn disable_hover ui-btn-icon-right ui-li",
    liEmptyClasses : "ui-btn ui-btn-icon-right ui-li",
    aClasses : "listviewLines ui-link-inherit",
    spanClasses : "ui-icon ui-icon-arrow-r",
    isFirstControl:true
    }
};  /* end of return */
})($.mobile.listview.prototype[ "_create", "refresh","_removeCorners","_refreshCorners"])));
(function( $, undefined ) {

    $.mobile.sylistview.prototype.options.filter = false;
    $.mobile.sylistview.prototype.options.filterPlaceholder = "Filter items...";
    $.mobile.sylistview.prototype.options.filterTheme = "c";
    $.mobile.sylistview.prototype.options.filterCallback = function( text, searchValue ){
        return text.toLowerCase().indexOf( searchValue ) === -1;
    };
})( jQuery );

