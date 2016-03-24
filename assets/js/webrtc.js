webRTC();

function webRTC() {
	var offerer = false; // Role (offerer or answerer)
	var peerConnection = null; // WebRTC PeerConnection
	var dataChannel = null; // WebRTC DataChannel

	var startButton = document.getElementById('startButton');
	
	RTCPeerConnection = webkitRTCPeerConnection;
	RTCIceCandidate = window.RTCIceCandidate;
	RTCSessionDescription = window.RTCSessionDescription;
	
	startButton.onclick = createConnection;
	
	function createConnection(){
		peerConnection = new RTCPeerConnection(null);
		peerConnection.createOffer(createOffer, errorHandler);
	}
	
	function createOffer(sessionDescriptionProtocol){
		peerConnection.setLocalDescription(sessionDescriptionProtocol);
		var myId = getMyId();
		var peerId = getPeerId();
		var offerJSON = {
				myId:myId,
				peerId:peerId,
				type:"offer",
				data:sessionDescriptionProtocol.sdp
			};
		
		insertDataToDb(offerJSON);
	}
	
	function insertDataToDb(offerJSON){
		$.ajax({
	         data: offerJSON,
	         type: "post",
	         url: "/insertOffer",
	});
	}
	
	function errorHandler(error){
		console.error("Error at create offer: " + error);
	}
	
	function getMyId(){
		return 1;
	}
	
	function getPeerId(){
		return 2;
	}
	

}
