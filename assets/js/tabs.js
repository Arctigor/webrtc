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
	$("#tabs").append(
			"<li id='" + $(link).attr("rel") + "_content'"
					+ " class='current'> <a onclick=\"displayContent("
					+ $(link).attr("rel") + ")\" class='tab' id='"
					+ $(link).attr("rel") + "' href='#'>" + $(link).html()
					+ "</a><a href='#' onclick=\"removeFunction("
					+ $(link).attr("rel") + ")\" id='" + $(link).attr("rel")
					+ "_content_remove'" + "'class='remove'>x</a></li>");

	$("#content").append(
			"<p id='" + $(link).attr("rel") + "_content'>"
					+ $(link).attr("title") + "</p>");

	// set the newly added tab as current
	// $("#" + $(link).attr("rel") + "_content").show();
	
	var history = document.getElementById("historyId");
	$(history).show();
	var currentId = $(link).attr("rel");
	displayContent(currentId);
	setPeerId(currentId);
	handleChatElementsById(currentId);
	showText();
	tabs++;
}

// Remove the tab when x is clicked
function removeFunction(id) {
	tabs--;
	// remove tab and related content
	$("#" + id + "_content").remove();
	$("#" + id + "_content_remove").remove();
	closeLocalConnectionById(id);

	// if there is no current tab and if there are still tabs left, show the
	// last one
	if ($("#tabs li.current").length == 0 && $("#tabs li").length > 0) {
		// hide other tabs
		$("#tabs li").removeClass("current");

		// find the last tab
		var lastTab = $("#tabs li:last-child");
		lastTab.addClass("current");

		// get its link name and show related content
		var currentId = $(lastTab).find("a.tab").attr("id");

		// show history
		setPeerId(currentId);
		handleChatElementsById(currentId);
		showMedia(currentId);
		showText();

	} else {
		// show history
		$("#dataChannelReceive").text("");
		var history = document.getElementById("historyId");
		if (tabs == 0) {
			$(history).hide();
			startButton.disabled = true;
		}
		closeMedia();
		remoteVideo.src = "";
		localVideo.src = "";
	}
}

// Display content of tab and mark as selected when tab clicked
function displayContent(id) {
	// hide other tabs
	$("#tabs li").removeClass("current");

	// find the clicked tab
	var currentTabSelected = $("#tabs li#" + id + "_content");
	currentTabSelected.addClass("current");

	// // get its link name and show related content
	var selectedTabId = $(currentTabSelected).find("a.tab").attr("id");
	setPeerId(selectedTabId);
	handleChatElementsById(selectedTabId);
	showMedia(selectedTabId);
	showText();
}

// Change background functionality
function changeBackground(color) {
	var div = document.getElementById('wrapper');
	div.style.backgroundColor = color;
}

function showMedia(selectedTabId){
	var remoteMedia = getRemoteMediaById(selectedTabId);
	if (remoteMedia != "" && remoteMedia != null) {
		remoteVideo.src = URL.createObjectURL(remoteMedia);
	} else {
		remoteVideo.src = "";
	}
}
function showText(){
	var responseJSON = getHistory();
	var text = "";
	document.getElementById("dataChannelReceive").value = text;
	$.each(responseJSON, function(key, value) {
		text += value.message+"\n";
	});
	document.getElementById("dataChannelReceive").value = text;
}

// display History
function displayHistory() {
	var currentId = $($("#tabs li.current")).find("a.tab").attr("id");
	window.open("/history/?peerId=" + currentId + "");
}

function getHistory() {
	var myId = getMyId();
	var peerId = getPeerId();
	var responseJSON = null;
	myDataJSON = {
		myId : myId,
		peerId : peerId,
	};
	$.ajax({
		data : myDataJSON,
		type : "post",
		url : "/getHistory",
		async : false,
		success : function(response) {
			responseJSON = response;
		}
	});
	return responseJSON;
}
