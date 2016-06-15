var offerer = false; // Role (offerer or answerer)
var answeredConnection = false;
var localPeerConnection = null; // WebRTC PeerConnection
var remotePeerConnection;
var servers = null;
var dataChannel = null; // WebRTC DataChannel
var iceCandidate = null;
var isCandidateSet = false;
var peerId = null;
var startButton = document.getElementById('startButton');
var sendButton = document.getElementById('sendButton');
var acceptButton = document.getElementById('acceptButton');
var declineButton = document.getElementById('declineButton');
var dataChannelSend = document.getElementById('dataChannelSend');
var dataChannelReceive = document.getElementById('dataChannelReceive');
var remoteVideo = document.getElementById('localVideo');
var localVideo = document.getElementById('remoteVideo');
var friendsTable = document.getElementById("friendsTable");
var addFriendButton = document.getElementById("addFriendButton");
var addFriendTextBox = document.getElementById("addFriendTextBox");
var connectToFBButton = document.getElementById("connect_to_fb");
var sendFileButton = document.getElementById("sendFileButton");
var incomingConnectionP = document.getElementById("connection");
var downloadAnchor = document.getElementById("download");
var history = document.getElementById("historyId");
var fileTransfer = document.getElementById("fileTransfer");
var offerJSON;
var incomingOfferJSON;
var friendsList = [];
var selectedFriend;
var receiveChannel;
var localStream = null;

RTCPeerConnection = window.mozRTCPeerConnection
		|| window.webkitRTCPeerConnection;
RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
RTCSessionDescription = window.mozRTCSessionDescription
		|| window.RTCSessionDescription;

createFriendsTable();
hideIncomingConnectionElements();
hideConnectToFbIfConnected();
hideHistoryLink();
hideFileTransfer();

var checkDb = 5000; // milliseconds
setInterval(waitingForOffer, checkDb);
setInterval(waitingForAnswer, checkDb);
setInterval(waitingForCandidate, checkDb);
setInterval(updateFriendsTable, checkDb);

startButton.disabled = true;

startButton.onclick = createConnection;
addFriendButton.onclick = addFriendByUser;
sendButton.onclick = sendData;
acceptButton.onclick = acceptConnection;
declineButton.onclick = declineConnection;
connectToFBButton.onclick = connectToFacebook;
sendFileButton.onclick = sendFile;

function createConnection() {
	localPeerConnection = new RTCPeerConnection(servers); // eslint-disable-line
	startcall = true;
	offerer = true;
	setLocalMedia();
	createDataChannel();
	setTimeout(function() {
		connect();
	}, 2000);
}

function connect() {
	localPeerConnection.onicecandidate = getIceCandidate;
	if (localStream != null) {
		localPeerConnection.addStream(localStream);
	}
	localPeerConnection.createOffer(createOffer, errorHandler);
}

function createOffer(sessionDescriptionProtocol) {
	localPeerConnection.createOffer(function(sessionDescriptionProtocol) {
		localPeerConnection.setLocalDescription(sessionDescriptionProtocol);
		var myId = getMyId();
		var peerId = getPeerId();
		offerJSON = {
			myId : myId,
			peerId : peerId,
			type : "offer",
			data : sessionDescriptionProtocol.sdp
		};
		insertDataToDb(offerJSON, "/insertOffer");
		console.log(localPeerConnection);
	}, errorHandler);
}

function createAnswer(responseJSON) {
	remotePeerConnection = new RTCPeerConnection(null);
	createDataChannel();
	setLocalMedia();
	setTimeout(function() {
		connectRemote(responseJSON);
	}, 2000);

}

function connectRemote(responseJSON) {
	var remoteSDP = new RTCSessionDescription();
	remoteSDP.type = "offer";
	remoteSDP.sdp = responseJSON.offerersdp;
	peerId = responseJSON.offererid;
	if (localStream != null) {
		remotePeerConnection.addStream(localStream);
	}
	remotePeerConnection.onaddstream = gotRemoteStream;
	remotePeerConnection.setRemoteDescription(remoteSDP);
	remotePeerConnection.createAnswer(function(sessionDescriptionProtocol) {
		remotePeerConnection.setLocalDescription(sessionDescriptionProtocol);
		var myId = getMyId();
		var peerId = responseJSON.offererid;
		answerJSON = {
			myId : myId,
			peerId : peerId,
			type : "answer",
			data : sessionDescriptionProtocol.sdp
		};
		console.log(remotePeerConnection);
		insertDataToDb(answerJSON, "/insertAnswer");
	}, errorHandler);
}

function insertDataToDb(offerJSON, url) {
	$.ajax({
		data : offerJSON,
		type : "post",
		url : url,
	});
}

function waitingForOffer() {
	if (!answeredConnection) {
		var success = null;
		if (!offerer) {
			var responseJSON = getOfferFromDb();
			if (responseJSON != null) {
				showIncomingConnection(responseJSON);
			}
		}
	}
}

function waitingForAnswer() {
	if (offerer) {
		var success = null;
		var responseJSON = getAnswerFromDb();
		if (responseJSON != null) {
			offerer = false;
			var remoteSDP = new RTCSessionDescription();
			remoteSDP.type = "answer";
			remoteSDP.sdp = responseJSON.answerersdp;
			localPeerConnection.onaddstream = gotRemoteStream;
			localPeerConnection.setRemoteDescription(remoteSDP);
			console.log(localPeerConnection);
			console.log(iceCandidate);
			var myId = getMyId();
			candidateJSON = {
				myId : myId,
				peerId : peerId,
				type : "candidate",
				data : iceCandidate.candidate,
			};
			insertDataToDb(candidateJSON, "/insertCandidate");
		}
	}
}

function waitingForCandidate() {
	if (answeredConnection) {
		var success = null;
		var responseJSON = getCandidateFromDb();
		if (responseJSON != null) {
			var iceCandidate = new RTCIceCandidate({
				candidate : responseJSON.candidate
			});
			iceCandidate.sdpMid = 'data';
			iceCandidate.sdpMLineIndex = 0;

			remotePeerConnection.addIceCandidate(iceCandidate);
			console.log(remotePeerConnection);
			answeredConnection = false;
			completeConnection(responseJSON, "complete");
		}
	}
}

function getOfferFromDb() {
	var myId = getMyId();
	var responseJSON = null;
	myDataJSON = {
		myId : myId
	};
	$.ajax({
		data : myDataJSON,
		type : "post",
		url : "/getOffer",
		async : false,
		success : function(response) {
			responseJSON = response;
		}
	});
	return responseJSON;
}

function getAnswerFromDb() {
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
		url : "/getAnswer",
		async : false,
		success : function(response) {
			responseJSON = response;
		}
	});
	return responseJSON;
}

function getCandidateFromDb() {
	var myId = getMyId();
	var responseJSON = null;
	myDataJSON = {
		myId : myId
	};
	$.ajax({
		data : myDataJSON,
		type : "post",
		url : "/getCandidate",
		async : false,
		success : function(response) {
			responseJSON = response;
		}
	});
	return responseJSON;
}

function getIceCandidate() {
	var candidate = event.candidate;
	if (candidate) {
		if (isCandidateSet == 0) {
			isCandidateSet = true;
			iceCandidate = candidate;
		}
	}
}

function completeConnection(responseJSON, status) {
	var myId = getMyId();
	myDataJSON = {
		myId : myId,
		offererId : responseJSON.offererid,
		status : status
	};
	answeredConnection = false;
	insertDataToDb(myDataJSON, "/completeConnection");
}

function setLocalMedia() {
	navigator.getUserMedia = navigator.getUserMedia
			|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	navigator.getUserMedia({
		video : true,
		audio : true,
	}, gotStream, errorHandler);
}

function gotStream(stream) {
	localVideo.src = URL.createObjectURL(stream);
	if (stream) {
		localStream = stream;
	}
	console.log('Stream: ');
	console.log(stream);
	console.log(localVideo.src);
}

function errorHandler(err) {
}

function gotRemoteStream(event) {
	remoteVideo.src = URL.createObjectURL(event.stream);
	setRemoteMediaById(getPeerId(), event.stream);
	console.log('Received remote stream');
}

function getFriendsFromDb() {
	var myId = getMyId();
	var responseJSON = null;
	myDataJSON = {
		myId : myId
	};
	$.ajax({
		data : myDataJSON,
		type : "post",
		url : "/getFriends",
		async : false,
		success : function(response) {
			responseJSON = response;
		}
	});
	return responseJSON;
}

function addFriendsByUsername(username) {
	var myId = getMyId();
	var responseJSON = null;
	myDataJSON = {
		myId : myId,
		username : username,
	};
	$.ajax({
		data : myDataJSON,
		type : "post",
		url : "/addFriend",
		async : false,
		success : function(response) {
			responseJSON = response;
		}
	});
	return responseJSON;
}

function saveConversation(peerUsername, data) {
	var myUsername = getMyUsername();
	convJSON = {
		myUsername : myUsername,
		peerUsername : peerUsername,
		message : data,
	};
	insertDataToDb(convJSON, "/insertConversation");
}

function createDataChannel() {
	if (!offerer) {
		remotePeerConnection.ondatachannel = eventDC;
	} else {
		dataChannel = localPeerConnection.createDataChannel('myDataChannel');
		dataChannel.onmessage = eventDCMessage;
		dataChannel.onopen = eventDCOpen;
		dataChannel.onclose = eventDCClosed;
		dataChannel.onerror = eventDCError;
	}
}

function eventDC(event) {
	dataChannel = event.channel;
	dataChannel.onmessage = eventDCMessage;
	dataChannel.onopen = eventDCOpen;
	dataChannel.onclose = eventDCClosed;
	dataChannel.onerror = eventDCError;

}

function eventDCMessage(event) {
	try {
		var dataArray = decode(event.data);
		var message = dataArray[1];
		var peerUsername = getPeerUsername(dataArray);
		var date = getCurrentTime();
		dataChannelReceive.value += "[" + date + "] " + peerUsername + ": "
				+ message + "\n";
		dataChannelReceive.scrollTop = dataChannelReceive.scrollHeight;
		saveConversation(peerUsername, message);
	} catch (err) {
		var receiveBuffer = [];
		receiveBuffer.push(event.data);
		var received = new window.Blob(receiveBuffer);
		receiveBuffer = [];
		downloadAnchor.href = URL.createObjectURL(received);
		var name = getFileName();
		createDownloadLink(name);
	}
}

function createDownloadLink(name) {
	downloadAnchor.download = name;
	downloadAnchor.textContent = 'Click to download file: ' + name;
}

function eventDCOpen() {
	sendButton.disabled = false;
	dataChannelSend.disabled = false;
	dataChannelSend.focus();
	dataChannelSend.placeholder = '';
	$.each(friendsList, function(key, value) {
		if (getPeerId() == value.id) {
			value.isconnected = true;
		}
	});
	$(fileTransfer).show();
}

function eventDCClosed() {
	sendButton.disabled = true;
	dataChannelSend.disabled = true;
	dataChannelSend.focus();
	dataChannelSend.placeholder = '';
	$(fileTransfer).hide();
}

function eventDCError(event) {
	console.log(event);
}

function sendData() {
	var data = dataChannelSend.value;
	dataChannelSend.value = '';
	var username = getMyUsername();
	var date = getCurrentTime();
	dataChannelReceive.value += "[" + date + "] " + username + ": " + data
			+ "\n";
	dataChannel.send(encode(username) + data);
	dataChannelReceive.scrollTop = dataChannelReceive.scrollHeight;
}

function getCurrentTime() {
	var currentdate = new Date();
	var time = currentdate.getHours() + ":" + currentdate.getMinutes() + ":"
			+ currentdate.getSeconds();
	return time;
}

function updateFriendsTable() {
	deleteFriendsTable();
	createFriendsTable();
}

function addFriendByUser() {
	var responseJSON = addFriendsByUsername(addFriendTextBox.value);
	if (responseJSON.result == "success") {
		deleteFriendsTable();
		createFriendsTable();
	} else {
		alert("User " + addFriendTextBox.value
				+ " doesn't not exist or is already in your friend list");
	}
	addFriendTextBox.value = "";
}

function deleteFriendsTable() {
	var rows = friendsTable.getElementsByTagName("tr");
	var rowsLength = rows.length;
	if (rowsLength > 1) {
		for (i = 0; i < rowsLength - 1; i++) {
			document.getElementsByTagName('tr')[1].remove();
		}
	}
}

function createFriendsTable() {
	var responseJSON = getFriendsFromDb();
	if (responseJSON != null) {
		$.each(responseJSON, function(key, value) {
			var myValue = value;
			try{
				myValue.isconnected = friendsList[key].isconnected;
				myValue.videosrc = friendsList[key].videosrc;
				myValue.connection = friendsList[key].connection;
			} catch(err){}
			
			friendsList[key] = myValue;
		});
		populateTable();
		addRowHandlers();
	}
}

function populateTable() {
	$.each(friendsList, function(key, value) {
		var row = friendsTable.insertRow(-1);
		var userCell = row.insertCell(0);
		if (value.isonline == 1) {
			userCell.innerHTML = '<a href="#" rel="' + value.id
					+ '" style="color:green;font-weight: bold;">'
					+ value.username + '</a>';
		} else {
			userCell.innerHTML = '<a href="#" rel="' + value.id + '">'
					+ value.username + '</a>';
		}
	});
}

function addRowHandlers() {
	var rows = friendsTable.getElementsByTagName("tr");
	for (i = 0; i < rows.length; i++) {
		for ( var j = 0; j < friendsTable.rows[i].cells.length; j++) {
			var currentRow = friendsTable.rows[i];
			var createClickHandler = function(cell, row) {
				return function() {
					var cellValue = cell.innerHTML;
					addTab(cellValue);
					if (!offerer) {
						$.each(friendsList, function(key, value) {
							if (cellValue.includes(value.username)) {
								selectedFriend = value;
								setPeerId(selectedFriend.id);
							}
						});
					}
				};
			};
			friendsTable.rows[i].cells[j].onclick = createClickHandler(
					friendsTable.rows[i].cells[j], i);
		}
	}
}

function viewHistory(friend) {
	var peerId = friend.id;
	window.open("/history/?peerId=" + peerId + "");
}

function showIncomingConnection(responseJSON) {
	var username = getFriendById(responseJSON.offererid);
	$(incomingConnectionP).text("Incoming connection from: " + username);
	$(acceptButton).show();
	$(declineButton).show();
	$(incomingConnectionP).show();
	incomingOfferJSON = responseJSON;
}

function acceptConnection() {
	answeredConnection = true;
	var name;
	var id;
	$.each(friendsList, function(key, value) {
		if (incomingOfferJSON.offererid == value.id) {
			name = value.username;
			id = incomingOfferJSON.offererid;
		}
	});
	addTab('<a href="#" rel="' + id + '">' + name + '</a>');
	createAnswer(incomingOfferJSON);
	hideIncomingConnectionElements();
}

function declineConnection() {
	answeredConnection = true;
	completeConnection(incomingOfferJSON, "decline");
	hideIncomingConnectionElements();
}

function hideIncomingConnectionElements() {
	$(acceptButton).hide();
	$(declineButton).hide();
	$(incomingConnectionP).hide();
}

function getUserFb() {
	var myId = getMyId();
	var responseJSON = null;
	myDataJSON = {
		myId : myId
	};
	$.ajax({
		data : myDataJSON,
		type : "post",
		url : "/getUserFb",
		async : false,
		success : function(response) {
			responseJSON = response;
		}
	});
	return responseJSON;
}

function hideConnectToFbIfConnected() {
	var userFbId = getUserFb();
	if (userFbId.fbid != "") {
		$(connectToFBButton).hide();
	}
}

function hideHistoryLink() {
	$(history).hide();
}

function hideFileTransfer() {
	$(fileTransfer).hide();
}

function connectToFacebook() {
	FB.getLoginStatus(function(response) {
		if (response.status == 'connected') {
			connectUser(response)
			$(connectToFBButton).hide();
			alert('User successfully connected to FB account');
		} else {
			FB.login(function(response) {
				if (response.authResponse) {
					connectUser(response)
					$(connectToFBButton).hide();
					alert('User successfully connected to FB account');
				} else {
					alert('Authentication failed');
				}
			}, {
				scope : 'email'
			});
		}
	});
}

function connectUser() {
	FB.api('/me', function(userInfo) {
		var myId = getMyId();
		dataJSON = {
			myId : myId,
			data : userInfo.id
		};
		insertDataToDb(dataJSON, "/connectToFb");
	});
}

function sendFile() {
	var file = fileInput.files[0];
	insertFileName(file.name);
	setTimeout(function() {
		transferFile(file);
	}, 2000);

}
function transferFile(file) {
	if (file != null) {
		var chunkSize = 16384;
		var sliceFile = function(offset) {
			var reader = new window.FileReader();
			reader.onload = (function() {
				return function(e) {
					dataChannel.send(e.target.result);
					if (file.size > offset + e.target.result.byteLength) {
						window.setTimeout(sliceFile, 0, offset + chunkSize);
					}
				};
			})(file);
			var slice = file.slice(offset, offset + chunkSize);
			reader.readAsArrayBuffer(slice);
		};
		sliceFile(0);
	}
}

function insertFileName(fileName) {
	var myId = getMyId();
	var peerId = getPeerId();
	fileJSON = {
		myId : myId,
		peerId : peerId,
		data : fileName,
	};
	insertDataToDb(fileJSON, "/insertFileName");
}

function getFriendById(id) {
	var toRet = null
	$.each(friendsList, function(key, value) {
		if (value.id == id) {
			toRet = value.username;
		}
	});
	return toRet;
}

function getFileName() {
	var peerId = getPeerId();
	var responseJSON = null;
	myDataJSON = {
		myId : myId,
		peerId : peerId,
	};
	$.ajax({
		data : myDataJSON,
		type : "post",
		url : "/getFileName",
		async : false,
		success : function(response) {
			responseJSON = response;
		}
	});
	return responseJSON.name;
}

function hanldeStartButtonById(id){
	$.each(friendsList, function(key, value) {
		if (value.id == id) {
			if(value.isconnected){
				startButton.disabled = true;
			} else{
				if(value.isonline == 1){
					startButton.disabled = false;
				} else{
					startButton.disabled = true;
				}
			}
		}
	});
}

function setLocalConnectionById(id, localConnection){
	$.each(friendsList, function(key, value) {
		if (value.id == id) {
			value.connection = localConnection;
		}
	});
}

function getLocalConnectionById(id){
	$.each(friendsList, function(key, value) {
		if (value.id == id) {
			return value.connection;
		}
	});
}

function setRemoteMediaById(id, src){
	$.each(friendsList, function(key, value) {
		if (value.id == id) {
			value.videosrc = src;
		}
	});
}

function getRemoteMediaById(id){
	var ret = "";
	$.each(friendsList, function(key, value) {
		if (value.id == id) {
			ret =  value.videosrc;
		}
	});
	return ret;
}

function encode(username) {
	return username + "@#$";
}

function decode(data) {
	return data.split("@#$");
}

function getPeerUsername(data) {
	return data[0];
}

function getMyUsername() {
	return getCookie('username');
}

function getMyId() {
	return getCookie('id');
}

function getPeerId() {
	return peerId;
}

function setPeerId(peerIdVar) {
	peerId = peerIdVar;
}


function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2)
		return parts.pop().split(";").shift();
}
