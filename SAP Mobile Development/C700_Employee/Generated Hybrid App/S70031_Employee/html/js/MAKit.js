
/*
 * Sybase Hybrid App version 2.2.2
 * 
 * MAKit.js
 * This file will not be regenerated, so it is possible to modify it, but it
 * is not recommended.
 * Copyright (c) 2012 Sybase Inc. All rights reserved.
 */
 
//globals

var g_currentScreenMAChartIDs = null;

$(window).bind("throttledresize",function(){
 	       onMAChartResize();
});
		
function initMAChartIDs(screenMACharIDs)
{
	g_currentScreenMAChartIDs = screenMACharIDs;
}

function initMAChartView(screenName, chartIDs, row, column, bSplitView, bDrillDown, bDAVar) 
{
 	arrangeMACharts(column, row, screenName, chartIDs);
 	var metaDir = "makitMeta/";
	try {
	 	if (bDAvar) {
	 		var daFile = metaDir + screenName + "_da_variables.xml";
	 		$MA.DA.load(daFile);
	 		$MA.Chart.getStyles();
	
			if ((typeof(jQuery)!='undefined')&&(typeof(jQuery)!=undefined)) {
				$ = jQuery.noConflict();
				$(window).bind("dachanged", onMADAChanged);
			}	
		}
	} catch (err) {
	}
 	
 	var chart;
	if (bSplitView) {
		for (var i = 0; i < chartIDs.length; i++) {
			chart = new $MA.Chart(chartIDs[i]);
			chart.bind("initialized", onMAChartInitiate);
			chart.bind("maximize", onMASplitChartMaximize);
			chart.load(metaDir+chartIDs[i]+".xml");
		}
	} else {
	 	if (bDrillDown) {
	 		chart = new $MA.DrillDownGroup(chartIDs[0]);
	 	} else {
		 	chart = new $MA.Chart(chartIDs[0], true);
		 }

		chart.bind("initialized", onMAChartInitiate);
	 	chart.load(metaDir + chartIDs[0]+".xml");
 	}
}


function onMAChartInitiate(chartID)
{
	var chartObj = $MA(chartID);
	var chartDiv = document.getElementById(chartID);
	var screenName = chartDiv.getAttribute("screen");
	var	realChartName = chartID.substring(screenName.length+1);


	try {
		if (chartObj.getCurrentChart) {
			chartObj.getCurrentChart().showWhatIfView(true);
		} else {
			chartObj.showWhatIfView(true);
		}
		
	 	var screenVars = eval(screenName + "_vars");
	 	if (screenVars) {
	 		if (chartObj.getCurrentChart) {
				chartObj.getCurrentChart().showDynamicAnalysisView(true);
	 		} else {
				chartObj.showDynamicAnalysisView(true);
			}
	 	}
	} catch (err) {
	}
	
 	if (typeof customAfterInitiateMAChart != "undefined")
 		customAfterInitiateMAChart(chartObj, screenName, realChartName);
}

function onMADAChanged(e, daname, value)
{
	if (g_currentScreenMAChartIDs) {
		for (var i = 0; i < g_currentScreenMAChartIDs.length; i++) {
			var chartObj = $MA(g_currentScreenMAChartIDs[i]);
			chartObj.refresh();
		}
	}
}

function onMASplitChartMaximize(chartID)
{
	var chartObj = $MA(chartID);
	var chartDiv = document.getElementById(chartID);
	var screenName = chartDiv.getAttribute("screen");
	var	realChartName = chartID.substring(screenName.length+1);

 	if (typeof customBeforeMaximizeMASplitChart != "undefined")
 	{
	 	if (!customBeforeMaximizeMASplitChart(chartObj, screenName, realChartName))
	 		return;
	}
 		
 	if (typeof customAfterMaximizeMASplitChart != "undefined")
 	 	customAfterMaximizeMASplitChart(chartObj, screenName, realChartName);

}

function executeMAQuery(chartObj, name, args) 
{
 	if (typeof customBeforeExecuteMAQuery != "undefined")
 	{
	 	if (!customBeforeExecuteMAQuery(chartObj, name, args))
	 		return;
	}
 		
 	if (typeof customAfterExecuteMAQuery != "undefined")
 	{
	 	customAfterExecuteMAQuery(chartObj, name, args);
	}
}
 
function updateMACSS(theme, fn) {
	var css;
	var head = document.getElementsByTagName('head')[0];
	var length=head.children.length;	
	
	//clear the theme css
	for (var i = 0; i <length ; i++)
	{
		elem = head.children[i];
		if (elem.className == 'ui-theme')
		{
			head.removeChild(elem);
			length--;
			i--;
		}
	}
	
	//create the new theme css link
	css = document.createElement('link');
	css.setAttribute('rel', 'Stylesheet');
	css.setAttribute('type', 'text/css');
	css.setAttribute('class', 'ui-theme');

	if (theme.toLowerCase()=="default")
		css.setAttribute('href', '../css/' + theme + '.css');
	else	
		css.setAttribute('href', 'css/themes/' + theme + '.css');
	
	//check whether the file is loaded
	var sheet, cssRules;	
	
	if ( 'sheet' in css ) {
      sheet = 'sheet'; cssRules = 'cssRules';
	}
	else {
      sheet = 'styleSheet'; cssRules = 'rules';
	}
	
	var interval_id = setInterval( function() { // start checking
          try {
             if ( css[sheet] && css[sheet][cssRules].length ) { // SUCCESS!
                clearInterval( interval_id );
                clearTimeout( timeout_id );
                fn.call(window, true, css ); // fire the callback
             }
          } catch( e ) {} finally {}
       }, 10 ),
       timeout_id = setTimeout( function() {    // start counting till fail
          clearInterval( interval_id );  //failed
          clearTimeout( timeout_id );
          head.removeChild( css );        
          fn.call( window, false, css ); // fire the callback with failing
       }, 15000 );     // how long to wait

	head.appendChild(css);
}

function arrangeMACharts(col, row, screenName, chartIDs, refresh) {
	//get unqualified chart name
	var realChartNames = new Array();
	var screenLen = screenName.length;
	for(var i=0; i<chartIDs.length; i++)
	{
		realChartNames[i] = chartIDs[i].substring(screenLen+1);
	}
	
	//lay out charts if necessary
	var contentDivElem = chartIDs[0] + "_contents";

	var size = customBeforeArrangeMAChart(screenName, realChartNames, col, row);
	var newCol = size.columns;
	if(newCol < 1)
		newCol = 1;
		
	var newRow = size.rows;
	if(newRow < 1)
		newRow = 1;

	var elem = document.getElementById(contentDivElem);
	var pos = $MA.getAbsolutePosition(elem);
	
	var width = (size && size.w > -1 ) ? size.w : (window.innerWidth - pos.x);
	var height = (size && size.h > -1 ) ? size.h : (window.innerHeight - pos.y);
	elem.style.width = (width - 6) + "px";
	elem.style.height = (height - 6) + "px";

	var len = elem.children.length;
	var childElem;
	for (var i = 0; i < len; i++)
	{
		childElem = elem.children[i];
		childElem.style.width = (98 / newCol)  + "%";
		childElem.style.height = (98 / newRow) + "%";
		childElem.style.marginLeft = "6px";
		childElem.style.marginBottom="6px";
		
		if (childElem && refresh) {
			if (childElem.drilldowngroup != undefined) {
				childElem.drilldowngroup.refresh();
			} else {
				var dummyChart = childElem.getAttribute("dummy");
				
				if (!dummyChart || 0 === dummyChart.length) { 
					$MA(childElem.id).refresh();
				}
			}
		}
	}
}

function onMAChartResize() {
	var screenToShow = getCurrentScreen();
	if (screenToShow && !isWindowsMobile()) 
    {
        var form = document.getElementById(screenToShow + "Form");
        if(form)
        {
    	    var divElems = form.getElementsByTagName("div");
            var divElemIdx;
            var divElem;
            var typeAttrib;
        
            for (divElemIdx = 0; divElemIdx < divElems.length; divElemIdx++) 
            {
                divElem = divElems[divElemIdx];
                typeAttrib = divElem.getAttribute("sup_html_type");

                if (typeAttrib != null && typeAttrib == "machartview") 
                {
                    //we have an MAChartView, get child node
                    var chartIDs = new Array();
                    var row = parseInt(divElem.getAttribute("row"));
				    var column = parseInt(divElem.getAttribute("column"));
				    
                    var divCharts = divElem.getElementsByTagName("div");
                    var chartElem;
                    var chartElemIdx;
                    var currentChartElemIndex = 0;
                    for(chartElemIdx = 0; chartElemIdx < divCharts.length; chartElemIdx++)
                    {
                	    chartElem = divCharts[chartElemIdx];
                    	if (chartElem.parentNode == divElem)
                    	{
                	    	chartIDs[currentChartElemIndex++] = chartElem.id;
                	    }
                    }
                    
                    //arrange the chart
                    arrangeMACharts(column, row, screenToShow, chartIDs, true);
                }
            }
        }
    }
}

$MA.setImagesFolder("./images/makit/");