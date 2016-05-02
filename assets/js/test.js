webRTC();

function webRTC() {
	var offerer = false; // Role (offerer or answerer)
	var answeredConnection = false;
	var localPeerConnection = null; // WebRTC PeerConnection
	var dataChannel = null; // WebRTC DataChannel
	var constraints = {
		'mandatory' : {
			'OfferToReceiveAudio' : true,
			'OfferToReceiveVideo' : true,
			'iceTransports' : 'relay'
		}

	}
	var peerId = null;
	var startButton = document.getElementById('startButton');
	var offerJSON;
	var localPeerConnection;
	var receiveChannel;

	var startButton = document.getElementById('startButton');
	startButton.onclick = createConnection;

	RTCPeerConnection = webkitRTCPeerConnection;
	RTCIceCandidate = window.RTCIceCandidate;
	RTCSessionDescription = window.RTCSessionDescription;

	createFriendsTable();

	function trace(text) {
		console.log((window.performance.now() / 1000).toFixed(3) + ': ' + text);
	}

	function createConnection() {
		offerer = true;
		var servers = null;
		localPeerConnection = new RTCPeerConnection(servers);
		createDC();
		// try {
		// Reliable Data Channels not yet supported in Chrome
		// 'sendDataChannel', {
		// reliable : false
		// });
		// } catch (e) {
		// alert('Failed to create data channel. '
		// + 'You need Chrome M25 or later with RtpDataChannel enabled');
		// }
		// localPeerConnection.onicecandidate = gotLocalCandidate;
		localPeerConnection.createOffer(createOffer, errorHandler);
	}

	function createOffer(sessionDescriptionProtocol) {
		localPeerConnection.createOffer(
				function(sessionDescriptionProtocol) {
					localPeerConnection
							.setLocalDescription(sessionDescriptionProtocol);
					var myId = getMyId();
					var peerId = getPeerId();
					console.log(peerId);
					offerJSON = {
						myId : myId,
						peerId : peerId,
						type : "offer",
						data : sessionDescriptionProtocol.sdp
					};
					console.log(localPeerConnection);
					insertDataToDb(offerJSON, "/insertOffer");
				}, errorHandler);
	}

	function errorHandler(error) {
		console.error("Error at create offer: " + error);
	}

	function insertDataToDb(offerJSON, url) {
		$.ajax({
			data : offerJSON,
			type : "post",
			url : url,
		});
	}

	function createDC() {
		if (!offerer) {
			localPeerConnection.ondatachannel = eventDC;
		} else {
			dataChannel = localPeerConnection.createDataChannel('myDataChannel');
		//	dataChannel.onmessage = eventDCMessage;
		//	dataChannel.onopen = eventDCOpen;
		//	dataChannel.onclose = eventDCClosed;
		//	dataChannel.onerror = eventDCError;
		}
	}

	function gotLocalCandidate(event) {
		trace('local ice callback');
		if (event.candidate) {
			trace('Local ICE candidate: \n' + event.candidate.candidate);
		}
	}

	function createFriendsTable() {
		var friendsList = [ "szabi", "bene", "c" ];
		populateTable(friendsList);
		addRowHandlers();
	}

	function populateTable(friendsList) {
		var friendsTable = document.getElementById("friendsTable");
		$.each(friendsList, function(key, value) {
			var row = friendsTable.insertRow(-1);
			var cell = row.insertCell(0);
			cell.innerHTML = value;
		});
	}

	function addRowHandlers() {
		var table = document.getElementById("friendsTable");
		var rows = table.getElementsByTagName("tr");
		for (i = 0; i < rows.length; i++) {
			var currentRow = table.rows[i];
			var createClickHandler = function(row) {
				return function() {
					var cell = row.getElementsByTagName("td")[0];
					var id = cell.innerHTML;
					if (!offerer) {
						if (id == 'szabi') {
							peerId = 2;
						} else {
							peerId = 1;
						}
					}
				};
			};

			currentRow.onclick = createClickHandler(currentRow);
		}
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