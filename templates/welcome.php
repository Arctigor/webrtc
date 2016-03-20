<div class="content">
	<?php 
		print_r("Welcome, ".$_SESSION['username']);
	?>
			<div id="buttons">
				<button id="startButton">Start</button>
				<button id="sendButton">Send</button>
				<button id="closeButton">Stop</button>
			</div>

			<div id="sendReceive">
				<div id="send">
					<h2>Send</h2>
					<textarea id="dataChannelSend" disabled
						placeholder="Press Start, enter some text, then press Send."></textarea>
				</div>
				<div id="receive">
					<h2>Receive</h2>
					<textarea id="dataChannelReceive" disabled></textarea>
				</div>
			</div>

</div>
