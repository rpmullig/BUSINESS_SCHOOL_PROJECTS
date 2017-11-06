/*
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 * 
 * Original file date: 2012-Oct-22
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */
  
  /* this function used by Blackberry and Android for setting the right height for background */   
  function  setPageHeight( jqmActivePage ) {
      var contentH = jqmActivePage.find( "[data-role='content']").height() + 32;
      var screenH = screen.height;
      if ( contentH < screenH ) {
          jqmActivePage.css('height',screenH +'px');
      }else {
          jqmActivePage.css('height',contentH +'px');
      }
  }           
  
  
  /* CR#662931-1   */
  //No longer in use,the event throttledresize triggered by JQM seems worked fine for rotation.
  function onFrameResize() {
  //   if (logLevel >= 4) { logToWorkflow("in onFrameResize window.innerWidth="+ window.innerWidth + " window.innerHeight="+ window.innerHeight, "DEBUG", false); }
     
   //  if ( isAndroid()){  /* CR	676492-2 */
   //    setTimeout( function(){
   //     	 for( var idx =0; idx < UIFrameResizeHandlers.length; idx++ ) {
   //             var listener = UIFrameResizeHandlers[ idx];
   //             listener.call( this );
  //           }
  //       }, 250);
         
//     }else {
 //        for( var idx =0; idx < UIFrameResizeHandlers.length; idx++ ) {
  //          var listener = UIFrameResizeHandlers[ idx];
 //           listener.call( this );
 //        }
//     }
  }  
 
  
  function getNativeEvent(event)
  {
  	while (event && typeof event.originalEvent !== "undefined") {
  		event = event.originalEvent;
  	}
  	return event;
  }
  
  function createVirtualEvent(event, eventType)
  {
  	var t = event.type;
  	event = $.Event(event);
  	event.type = eventType;
  	
  	var oe = event.originalEvent;
  	var props = $.event.props;
  	
  	// copy original event properties over to the new event
  	// this would happen if we could call $.event.fix instead of $.Event
  	// but we don't have a way to force an event to be fixed multiple times
  	if (oe) {
  		for ( var i = props.length, prop; i; ) {
  			prop = props[ --i ];
  			event[prop] = oe[prop];
  		}
  	}
  	
	if (t.search(/^touch/) !== -1){
		var ne = getNativeEvent(oe),
			t = ne.touches,
			ct = ne.changedTouches,
			touch = (t && t.length) ? t[0] : ((ct && ct.length) ? ct[0] : undefined);
		if (touch){
			var touchEventProps = "clientX clientY pageX pageY screenX screenY".split(" ");
			for (var i = 0, len = touchEventProps.length; i < len; i++){
				var prop = touchEventProps[i];
				event[prop] = touch[prop];
			}
		}
	}
	
  	return event;
 }  
