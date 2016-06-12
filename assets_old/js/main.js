webRTC();

/* globals webkitRTCPeerConnection */
function webRTC() {
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
	var dataChannelSend = document.getElementById('dataChannelSend');
	var dataChannelReceive = document.getElementById('dataChannelReceive');
	var localVideo = document.getElementById('localVideo');
	var remoteVideo = document.getElementById('remoteVideo');
	var friendsTable = document.getElementById("friendsTable");
	var addFriendButton = document.getElementById("addFriendButton");
	var addFriendTextbox = document.getElementById("addFriendButton");
	var offerJSON;
	var friendsList;
	var selectedFriend;
	var receiveChannel;
	var localStream;

	RTCPeerConnection = window.mozRTCPeerConnection
			|| window.webkitRTCPeerConnection;
	RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
	RTCSessionDescription = window.mozRTCSessionDescription
			|| window.RTCSessionDescription;
	
	createFriendsTable();

	startButton.disabled = false;
	startButton.onclick = createConnection;

	var total = '';

	function trace(text) {
		total += text;
		console.log((window.performance.now() / 1000).toFixed(3) + ': ' + text);
	}

	function gotStream(stream) {
		trace('Received local stream');
		localVideo.src = URL.createObjectURL(stream);
		localStream = stream;
	}

	var startcall = false;

	function createConnection() {
		if (!startcall) {
			localPeerConnection = new RTCPeerConnection(servers); // eslint-disable-line
			startcall = true;
			offerer = true;
			setLocalMedia();
			createDataChannel();
		} else {
			call();
		}
	}

	function call() {
		trace('Starting call');


		// new-cap
		trace('Created local peer connection object localPeerConnection');
		localPeerConnection.onicecandidate = gotLocalIceCandidate;

		remotePeerConnection = new RTCPeerConnection(servers); // eslint-disable-line
		// new-cap
		trace('Created remote peer connection object remotePeerConnection');
		remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
		remotePeerConnection.onaddstream = gotRemoteStream;

		console.log(localStream);
		localPeerConnection.addStream(localStream);
		trace('Added localStream to localPeerConnection');
		localPeerConnection.createOffer(gotLocalDescription, errorHandler);
	}
	
	function setLocalMedia() {
		navigator.getUserMedia = navigator.getUserMedia
				|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		navigator.getUserMedia({
			video : true,
			audio : true
		}, gotStream, errorHandler);
	}

	function gotStream(stream) {
		localVideo.src = URL.createObjectURL(stream);
		localStream = stream;
		console.log('Stream: ');
		console.log(stream);
		console.log(localVideo.src);
		if(offerer){
			//localPeerConnection.addStream(localStream);
		}
		else{
			remotePeerConnection.addStream(localStream);
		}
	}

	function errorHandler(err) {
	}
	
	var ll;
	function gotLocalDescription(description) {
		localPeerConnection.setLocalDescription(description);
		trace('Offer from localPeerConnection: \n' + description.sdp);
		console.log(description);
		remotePeerConnection.setRemoteDescription(description);
		remotePeerConnection.createAnswer(gotRemoteDescription, errorHandler);
	}

	function gotRemoteDescription(description) {
		console.log(description);
		remotePeerConnection.setLocalDescription(description);
		trace('Answer from remotePeerConnection: \n' + description.sdp);
		console.log("fdfsdfdsfdsfdsf!!!!!!!!!!!1");
		localPeerConnection.setRemoteDescription(description);
	}

	function hangup() {
		trace('Ending call');
		localPeerConnection.close();
		remotePeerConnection.close();
		localPeerConnection = null;
		remotePeerConnection = null;
	}

	function gotRemoteStream(event) {
		remoteVideo.src = URL.createObjectURL(event.stream);
		trace('Received remote stream');
	}

	function gotLocalIceCandidate(event) {
		if (event.candidate) {
			remotePeerConnection.addIceCandidate(new RTCIceCandidate(
					event.candidate));
			trace('Local ICE candidate: \n' + event.candidate.candidate);
		}
	}

	function gotRemoteIceCandidate(event) {
		if (event.candidate) {
			localPeerConnection.addIceCandidate(new RTCIceCandidate(
					event.candidate));
			trace('Remote ICE candidate: \n ' + event.candidate.candidate);
		}
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
		var dataArray = decode(event.data);
		var message = dataArray[1];
		var peerUsername = getPeerUsername(dataArray);
		dataChannelReceive.value += peerUsername + ": " + message + "\n";
		saveConversation(peerUsername, message);
	}

	function eventDCOpen() {
		sendButton.disabled = false;
		dataChannelSend.disabled = false;
		dataChannelSend.focus();
		dataChannelSend.placeholder = '';
	}

	function eventDCClosed() {
		sendButton.disabled = true;
		dataChannelSend.disabled = true;
		dataChannelSend.focus();
		dataChannelSend.placeholder = '';
	}

	function eventDCError(event) {
		console.log(event);
	}

	function sendData() {
		var data = dataChannelSend.value;
		dataChannelSend.value = '';
		var username = getMyUsername();
		dataChannelReceive.value += username + ": " + data + "\n";
		dataChannel.send(encode(username) + data);
	}

	
	function createFriendsTable() {
		var responseJSON = getFriendsFromDb();
		if (responseJSON != null) {
			friendsList = responseJSON;
			populateTable();
			addRowHandlers();
		}
	}
	
	function populateTable() {
		$.each(friendsList, function(key, value) {
			var row = friendsTable.insertRow(-1);
			var cell = row.insertCell(0);
			cell.innerHTML = value.username;
		});
	}

	function addRowHandlers() {
		var rows = friendsTable.getElementsByTagName("tr");
		for (i = 0; i < rows.length; i++) {
			var currentRow = friendsTable.rows[i];
			var createClickHandler = function(row) {
				return function() {
					var cell = row.getElementsByTagName("td")[0];
					var id = cell.innerHTML;
					if (!offerer) {
						$.each(friendsList, function(key, value) {
							if (value.username == id) {
								selectedFriend = value;
								peerId = selectedFriend.id;
							}
						});
					}
				};
			};

			currentRow.onclick = createClickHandler(currentRow);
		}
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

	function getCookie(name) {
		var value = "; " + document.cookie;
		var parts = value.split("; " + name + "=");
		if (parts.length == 2)
			return parts.pop().split(";").shift();
	}
}