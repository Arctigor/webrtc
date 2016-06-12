$("#friendTab a").click(function() {
    addTab($(this));
});

// Add new friend tab when friend is selected from the Friend Menu Table
function addTab(link) {   	
	// If tab already exist in the list, return
	if ($("#" + $(link).attr("rel")).length != 0)
    return;

	// hide other tabs
    $("#tabs li").removeClass("current");
    $("#content p").hide();
    
    // add new tab and related content
    $("#tabs").append("<li id='"+$(link).attr("rel") + "_content'"+" class='current'> <a onclick=\"displayContent("+$(link).attr("rel") +")\" class='tab' id='" + $(link).attr("rel") + "' href='#'>" + $(link).html() +
        "</a><a href='#' onclick=\"removeFunction("+$(link).attr("rel") +")\" id='"+$(link).attr("rel") + "_content_remove'"+"'class='remove'>x</a></li>");
		
    $("#content").append("<p id='" + $(link).attr("rel") + "_content'>" +
        $(link).attr("title") + "</p>");
		
    // set the newly added tab as current
    $("#" + $(link).attr("rel") + "_content").show();
	
	document.getElementById("historyId").style.visibility = "visible";
	
	// apar cand selectezi un prieten !!
	document.getElementById("incommingId").style.visibility = "visible";	
	document.getElementById("acceptButton").style.visibility = "visible";
	
}

// Remove the tab when x is clicked
function removeFunction(id){		   
    // remove tab and related content    
	$("#"+id.id + "_content").remove();
	$("#"+id.id + "_content_remove").remove();
	$("p#"+id.id + "_content").remove();
    $(id).remove();
	
	
	// if there is no current tab and if there are still tabs left, show the last one
	 if ($("#tabs li.current").length == 0 && $("#tabs li").length > 0) {		
		// hide other tabs
		$("#tabs li").removeClass("current");
		$("#content p").hide();
			
		// find the last tab
		 var lastTab = $("#tabs li:last-child");
		 lastTab.addClass("current");
		 
		// // get its link name and show related content
		 var currentTabSelected = $(lastTab).find("a.tab").attr("id");
		 $("p#" + currentTabSelected + "_content").show();
	 } 
}

// Display content of tab and mark as selected when tab clicked
function displayContent(currentTab){	
	// hide other tabs
	$("#tabs li").removeClass("current");
	$("#content p").hide();
		
	// find the clicked tab
	 var currentTabSelected = $("#tabs li#"+currentTab.id+"_content");
	 currentTabSelected.addClass("current");
	 
	// // get its link name and show related content
	 var selectedTabId = $(currentTabSelected).find("a.tab").attr("id");
	 $("p#" + selectedTabId + "_content").show(); 
	 
	 
	 $("#dataChannelReceive").text(selectedTabId + ": salut");
}

// Change background functionality
function changeBackground(color) {
   var div = document.getElementById('wrapper');
   div.style.backgroundColor = color;    
}

// accept connection
function acceptConnection(){
	alert("Oh, hello!");
}

// display History
function displayHistory(){
	var currentId = $($("#tabs li.current")).find("a.tab").attr("id");
	
	// display history for id: currentId
	alert("History for " + currentId);
	

	window.open("/history/?peerId=" + currentId + "");
	 
}

// Connection buttons
$("#closeButton").click(function() {
	$("#localVideo").hide();
	$("#remoteVideo").hide(); 	
	document.getElementById("sendButton").disabled = true;
	document.getElementById("dataChannelSend").disabled = true; 
});

$("#startButton").click(function() {
	$("#localVideo").show();
	$("#remoteVideo").show();   
	document.getElementById("sendButton").disabled = false;	
	document.getElementById("dataChannelSend").disabled = false;  
});