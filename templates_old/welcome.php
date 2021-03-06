<div class="content">
	Welcome <span id="username"><?php print $_SESSION['username']; ?>
	</span>
	<div id="buttons">
		<button id="startButton">Start</button>
		<button id="sendButton">Send</button>
		<button id="closeButton">Stop</button>
	</div>

	<div id="sendReceive">
		<div id="send">
			<h2>Send</h2>
			<textarea id="dataChannelSend" disabled
				placeholder=""></textarea>
		</div>
		<div id="receive">
			<h2>Receive</h2>
			<textarea id="dataChannelReceive" disabled></textarea>
		</div>
	</div>
	<br></br>
	<div id="video">
		<video style="height:90px;width:190" id="localVideo" autoplay muted></video>
    	<video style="height:90px;width:190" id="remoteVideo" autoplay></video>
	</div>
	<br></br>
	<div id="buttons">
	   	<input id="addFriendTextBox" type="text" name="username" placeholder="Add friend by username"><br>
  		<button id="addFriendButton">Add Friend</button>
	</div>
	<table id="friendsTable"class="tg">
		<tr>
			<th class="tg-yw4l">Friends</th>
			<th class="tg-yw4l">History</th>
		</tr>
	</table>
	<p id="connection">Incoming connection from: </p>
	<div id="buttons">
		<button id="acceptButton">Accept</button>
		<button id="declineButton">Decline</button>
	</div>
	<br>
	<div id="buttons">
		<button id="connect_to_fb">Connect to your FB</button>
	</div>
	<br>
	<section>
      <form id="fileInfo">
        <input type="file" id="fileInput" name="files"/><br>
      </form>
      <button id="sendFileButton">Send File</button><br>
      <a id="download"></a>
    </section>

</div>
