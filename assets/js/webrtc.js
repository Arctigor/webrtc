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

	RTCPeerConnection = webkitRTCPeerConnection;
	RTCIceCandidate = window.RTCIceCandidate;
	RTCSessionDescription = window.RTCSessionDescription;

	startButton.onclick = createConnection;

	var checkOfferAndAnswer = 5000; //milliseconds
	createFriendsTable();
	setInterval(waitingForOffer, checkOfferAndAnswer);
	setInterval(waitingForAnswer, checkOfferAndAnswer);

	function createConnection() {
		localPeerConnection = new RTCPeerConnection(null);
		localPeerConnection.createOffer(createOffer, errorHandler);
	}

	function createOffer(sessionDescriptionProtocol) {
		localPeerConnection = new RTCPeerConnection(null);
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
					insertDataToDb(offerJSON, "/insertOffer");
					offerer = true;
				}, errorHandler);
	}

	function createAnswer(responseJSON) {
		var remoteSDP = new RTCSessionDescription();
		remoteSDP.type = "offer";
		remoteSDP.sdp = responseJSON.offerersdp;

		localPeerConnection = new RTCPeerConnection(null);
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
					insertDataToDb(answerJSON, "/insertAnswer");
				}, errorHandler);
		console.log(localPeerConnection);
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
			console.log(responseJSON);
			if (responseJSON != null) {
				offerer = false;
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

	function errorHandler(error) {
		console.error("Error at create offer: " + error);
	}

	function createFriendsTable() {
		var friendsList = ["szabi","bene","c"];
		populateTable(friendsList);
		addRowHandlers();
	}
	
	function populateTable(friendsList){
		var friendsTable = document.getElementById("friendsTable");
		$.each(friendsList, function( key, value ) {
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
        var createClickHandler = 
            function(row) 
            {
                return function() { 
                                        var cell = row.getElementsByTagName("td")[0];
                                        var id = cell.innerHTML;
                                        if(!offerer){
                                        if(id == 'szabi'){
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
