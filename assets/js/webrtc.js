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
	var acceptButton = document.getElementById('acceptButton');
	var declineButton = document.getElementById('declineButton');
	var dataChannelSend = document.getElementById('dataChannelSend');
	var dataChannelReceive = document.getElementById('dataChannelReceive');
	var localVideo = document.getElementById('localVideo');
	var remoteVideo = document.getElementById('remoteVideo');
	var friendsTable = document.getElementById("friendsTable");
	var addFriendButton = document.getElementById("addFriendButton");
	var addFriendTextBox = document.getElementById("addFriendTextBox");
	var connectToFBButton = document.getElementById("connect_to_fb");
	var incomingConnectionP = document.getElementById("connection");
	var offerJSON;
	var incomingOfferJSON;
	var friendsList;
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

	var checkDb = 5000; // milliseconds
	setInterval(waitingForOffer, checkDb);
	setInterval(waitingForAnswer, checkDb);
	setInterval(waitingForCandidate, checkDb);

	startButton.disabled = false;

	startButton.onclick = createConnection;
	addFriendButton.onclick = addFriendByUser;
	sendButton.onclick = sendData;
	acceptButton.onclick = acceptConnection;
	declineButton.onclick = declineConnection;
	connectToFBButton.onclick = connectToFacebook;
	
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
		if (localStream != null) {
			remotePeerConnection.addStream(localStream);
		}
		remotePeerConnection.onaddstream = gotRemoteStream;
		remotePeerConnection.setRemoteDescription(remoteSDP);
		remotePeerConnection.createAnswer(function(sessionDescriptionProtocol) {
			remotePeerConnection
					.setLocalDescription(sessionDescriptionProtocol);
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
			audio : true
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
		var message = dataArray[1];
		var peerUsername = getPeerUsername(dataArray);
		var date = getCurrentTime();
		dataChannelReceive.value += "[" + date + "] " + peerUsername + ": "
				+ message + "\n";
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
		var date = getCurrentTime();
		dataChannelReceive.value += "[" + date + "] " + username + ": " + data
				+ "\n";
		dataChannel.send(encode(username) + data);
	}

	function getCurrentTime() {
		var currentdate = new Date();
		var time = currentdate.getHours() + ":" + currentdate.getMinutes()
				+ ":" + currentdate.getSeconds();
		return time;
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
		for (i = 0; i < rows.length; i++) {
			document.getElementById("friendsTable").deleteRow(i + 1);
		}
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
			var userCell = row.insertCell(0);
			userCell.innerHTML = value.username;
			var historyCell = row.insertCell(1);
			historyCell.innerHTML = "View Conversation";
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
						if (!offerer) {
							$.each(friendsList, function(key, value) {
								if (value.username == cellValue) {
									selectedFriend = value;
									peerId = selectedFriend.id;
								}
							});
							if (cellValue == "View Conversation") {
								viewHistory(friendsList[row - 1]);
							}
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
		window.open("/history/?peerId="+peerId+"");
	}
	
	function showIncomingConnection(responseJSON){
		var username = getFriendById(responseJSON.offererid);;
		$(incomingConnectionP).text("Incoming connection from: "+username);
		$(acceptButton).show();
		$(declineButton).show();
		$(incomingConnectionP).show();
		incomingOfferJSON = responseJSON;
	}
	
	function acceptConnection(){
		answeredConnection = true;
		createAnswer(incomingOfferJSON);
		hideIncomingConnectionElements();
	}
	
	function declineConnection(){
		answeredConnection = true;
		completeConnection(incomingOfferJSON, "decline");
		hideIncomingConnectionElements();
	}
	
	function hideIncomingConnectionElements(){
		$(acceptButton).hide();
		$(declineButton).hide();
		$(incomingConnectionP).hide();
	}
	
	function getUserFb(){
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
	
	function hideConnectToFbIfConnected(){
		var userFbId = getUserFb();
		if(userFbId.fbid != ""){
			$(connectToFBButton).hide();
		}
	}
	
	function connectToFacebook(){
		FB.getLoginStatus(function(response) {
		      if (response.status == 'connected') {
		        connectUser(response)
		        $(connectToFBButton).hide();
		        alert('User successfully connected to FB account');
		      } else {
		        FB.login(function(response) {
		          if (response.authResponse){
		        	  connectUser(response)
		        	  $(connectToFBButton).hide();
		        	  alert('User successfully connected to FB account');
		          } else {
		            alert('Authentication failed');
		          }
		        }, { scope: 'email' });
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
	
	function getFriendById(id){
		var toRet = null
		$.each(friendsList, function(key, value) {
			if (value.id == id) {
				toRet = value.username;
			}
		});
		return toRet;
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