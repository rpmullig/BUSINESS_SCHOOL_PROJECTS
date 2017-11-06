/*
 * binding to mobileinit event need to be added before load jquery mobile and after jquery.
 */
$(document).bind("mobileinit", function(){
	 $.mobile.ajaxEnabled = false;
	 $.mobile.pushStateEnabled=false;
	 $.mobile.changePage.defaults =  $.extend( $.mobile.changePage.defaults,{ changeHash: false });
  });
