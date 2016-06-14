// Add new friend tab when friend is selected from the Friend Menu Table
var tabs = 0;
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
   // $("#" + $(link).attr("rel") + "_content").show();
	
	var history = document.getElementById("historyId");
	$(history).show();
	tabs++;
}

// Remove the tab when x is clicked
function removeFunction(id){	
	tabs--;
    // remove tab and related content    
	$("#"+id + "_content").remove();
	$("#"+id + "_content_remove").remove();
 	
	// if there is no current tab and if there are still tabs left, show the last one
	if ($("#tabs li.current").length == 0 && $("#tabs li").length > 0) {		
		// hide other tabs
		$("#tabs li").removeClass("current");
			
		// find the last tab
		 var lastTab = $("#tabs li:last-child");
		 lastTab.addClass("current");
		 
		 // get its link name and show related content
		 var currentId = $(lastTab).find("a.tab").attr("id");	
		 
		// show history
		 $("#dataChannelReceive").text("salut " + currentId);
		 
	 } else{
		// show history
		 $("#dataChannelReceive").text("");
		 var history = document.getElementById("historyId");
		 if(tabs == 0){
			 $(history).hide();
		 }
	 }
}

// Display content of tab and mark as selected when tab clicked
function displayContent(id){	
	// hide other tabs
	$("#tabs li").removeClass("current");
		
	// find the clicked tab
	 var currentTabSelected = $("#tabs li#"+id+"_content");
	 currentTabSelected.addClass("current");
	 
	// // get its link name and show related content
	 var selectedTabId = $(currentTabSelected).find("a.tab").attr("id");
	 
	 // show history
	 $("#dataChannelReceive").text(selectedTabId + ": salut");
}

// Change background functionality
function changeBackground(color) {
   var div = document.getElementById('wrapper');
   div.style.backgroundColor = color;    
}


// display History
function displayHistory(){
	var currentId = $($("#tabs li.current")).find("a.tab").attr("id");
	window.open("/history/?peerId=" + currentId + "");	 
}
