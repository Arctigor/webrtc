webRTC();

function webRTC() {
	var offerer = false; // Role (offerer or answerer)
	var answeredConnection = false;
	var localPeerConnection = null; // WebRTC PeerConnection
	var dataChannel = null; // WebRTC DataChannel
	var iceCandidate = null;
	var constraints = {
		'mandatory' : {
			'OfferToReceiveAudio' : true,
			'OfferToReceiveVideo' : true,
			'iceTransports' : 'relay'
		}

	}
	var peerId = null;
	var startButton = document.getElementById('startButton');
	var sendButton = document.getElementById('sendButton');
	var dataChannelSend = document.getElementById('dataChannelSend');
	var dataChannelReceive = document.getElementById('dataChannelReceive');
	var localVideo = document.getElementById('localVideo');
	var remoteVideo = document.getElementById('remoteVideo');
	var friendsTable = document.getElementById("friendsTable");
	var offerJSON;
	var friendsList;
	var selectedFriend;
	var localPeerConnection;
	var receiveChannel;

	startButton.onclick = createConnection;
	sendButton.onclick = sendData;

	RTCPeerConnection = window.mozRTCPeerConnection
			|| window.webkitRTCPeerConnection;
	RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
	RTCSessionDescription = window.mozRTCSessionDescription
			|| window.RTCSessionDescription;

	createFriendsTable();

	var checkDb = 5000; // milliseconds
	setInterval(waitingForOffer, checkDb);
	setInterval(waitingForAnswer, checkDb);
	setInterval(waitingForCandidate, checkDb);

	function createConnection() {
		offerer = true;
		var servers = null;
		localPeerConnection = new RTCPeerConnection(servers);
		setLocalMedia();
		createDataChannel();
		localPeerConnection.onicecandidate = getIceCandidate;
		localPeerConnection.createOffer(createOffer, errorHandler);
	}

	function createOffer(sessionDescriptionProtocol) {
		localPeerConnection.createOffer(
				function(sessionDescriptionProtocol) {
					localPeerConnection
							.setLocalDescription(sessionDescriptionProtocol);
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
		var remoteSDP = new RTCSessionDescription();
		remoteSDP.type = "offer";
		remoteSDP.sdp = responseJSON.offerersdp;

		localPeerConnection = new RTCPeerConnection(null);
		createDataChannel();
		localPeerConnection.setRemoteDescription(remoteSDP);
		localPeerConnection.createAnswer(
				function(sessionDescriptionProtocol) {
					localPeerConnection
							.setLocalDescription(sessionDescriptionProtocol);
					var myId = getMyId();
					var peerId = responseJSON.offererid;
					answerJSON = {
						myId : myId,
						peerId : peerId,
						type : "answer",
						data : sessionDescriptionProtocol.sdp
					};
					console.log(localPeerConnection);
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
					createAnswer(responseJSON);
					answeredConnection = true;
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

				localPeerConnection.setRemoteDescription(remoteSDP);
				console.log(localPeerConnection);
				console.log(iceCandidate);
				var myId = getMyId();
				candidateJSON = {
					myId : myId,
					peerId : peerId,
					type : "candidate",
					data : iceCandidate.candidate
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

				localPeerConnection.addIceCandidate(iceCandidate);
				console.log(localPeerConnection);
				answeredConnection = false;
				completeConnection(responseJSON);
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
			iceCandidate = candidate;
		}
	}

	function completeConnection(responseJSON) {
		var myId = getMyId();
		myDataJSON = {
			myId : myId,
			offererId : responseJSON.offererid,
		};
		insertDataToDb(myDataJSON, "/completeConnection");
	}

	function setLocalMedia() {
		/*navigator.getUserMedia = navigator.getUserMedia
				|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		navigator.getUserMedia({
			video : true,
			audio : true
		}, gotStream, errorHandler);*/
	}
	
	function gotStream(stream) {
		  localVideo.src = URL.createObjectURL(stream);
		  localStream = stream;
		  console.log('Stream: ');
		  console.log(localVideo.src);
		}

	function errorHandler(error) {
		console.error(error);
	}

	function createDataChannel() {
		if (!offerer) {
			localPeerConnection.ondatachannel = eventDC;
		} else {
			dataChannel = localPeerConnection
					.createDataChannel('myDataChannel');
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
		dataChannelReceive.value += getPeerUsername(dataArray) + ": " +dataArray[1] + "\n";
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
		dataChannelReceive.value += username +": "+data + "\n";
		dataChannel.send(encode(username)+data);
	}

	function gotLocalCandidate(event) {
		trace('local ice callback');
		if (event.candidate) {
			trace('Local ICE candidate: \n' + event.candidate.candidate);
		}
	}

	function createFriendsTable() {
		var responseJSON = getFriendsFromDb();
		if (responseJSON != null) {
			friendsList=responseJSON;
			populateTable();
			addRowHandlers();
		}
	}
	
	function getFriendsFromDb(){
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
							if(value.username == id){
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
	
	function encode(username){
		return username+"@#$";
	}
	
	function decode(data){
		return data.split("@#$");
	}
	
	function getPeerUsername(data){
		return data[0];
	}
	
	function getMyUsername(){
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