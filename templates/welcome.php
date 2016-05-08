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
	<table id="friendsTable"class="tg">
		<tr>
			<th class="tg-yw4l">Friends</th>
		</tr>
	</table>

</div>
