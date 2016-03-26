webRTC();

function webRTC() {
	var offerer = false; // Role (offerer or answerer)
	var localPeerConnection = null; // WebRTC PeerConnection
	var dataChannel = null; // WebRTC DataChannel
	var constraints = {
			'mandatory' :
			{
				'OfferToReceiveAudio' : true,
				'OfferToReceiveVideo' : true,
				'iceTransports': 'relay'
			}

		}
	var startButton = document.getElementById('startButton');
	var offerJSON;
	
	RTCPeerConnection = webkitRTCPeerConnection;
	RTCIceCandidate = window.RTCIceCandidate;
	RTCSessionDescription = window.RTCSessionDescription;
	
	startButton.onclick = createConnection;
	
	var checkOffer = 5000;
 	setInterval(waitingForOffer, checkOffer); 
	
	function createConnection(){
		localPeerConnection = new RTCPeerConnection(null);
		localPeerConnection.createOffer(createOffer, errorHandler);
	}
	
	function createOffer(sessionDescriptionProtocol){
		localPeerConnection.setLocalDescription(sessionDescriptionProtocol);
		var myId = getMyId();
		var peerId = getPeerId();
		offerJSON = {
				myId:myId,
				peerId:peerId,
				type:"offer",
				data:sessionDescriptionProtocol.sdp
			};
		insertDataToDb(offerJSON);
		offerer = true;
	}
	
	function insertDataToDb(offerJSON){
		$.ajax({
	         data: offerJSON,
	         type: "post",
	         url: "/insertOffer",
		});
	}
	
	function waitingForOffer(){
		if(!offerer){
			var responseJSON = getOfferFromDb();
			if(responseJSON != null){
				
			}
		}
	}
	
	function getOfferFromDb(){
		//TODO create ajax to get data from db
		var responseJSON;
		$.ajax({
	         type: "post",
	         url: "/getOffer",
	         success:function(response){ 
	        	 console.log(response);
	            }
		});
		console.log(responseJSON);
		return null;
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
