<link rel="stylesheet" type="text/css" href="assets/css/welcome.css">
<div class="content">
	<div class="userClass">
		Welcome <span id="username"><?php print $_SESSION['username']; ?> </span>
	</div>
	
	<div id="wrapper">
		<ul id="tabs" class="noBorder">
			<!-- Tabs go here -->
		</ul>

		<div id="sendReceive">
			<div id="receive">
				<textarea id="dataChannelReceive" class="notEditableTextArea"
					disabled></textarea>
			</div>
			<div id="send">
				<textarea id="dataChannelSend" class="editableTextArea" disabled
					placeholder=""></textarea>
				<button id="sendButton" class="sendButtonClass">Send</button>
			</div>
		</div>

		<div>
			<span id="connection" class="incommingClass">Incoming connection
				from: </span>

			<button id="acceptButton" class="acceptButtonClass">Accept</button>
			<button id="declineButton" class="acceptButtonClass">Decline</button>
		</div>

		<!-- History link -->
		<a href="#" id="historyId" class="historyClass" onclick="displayHistory()">See history </a>

		<div id="buttons">
			<button id="startButton" class="buttonClass">Start</button>
			<button id="closeButton" class="buttonClass">Stop</button>
			<button id="connect_to_fb" class="buttonClassFb">Connect to your FB</button>
		</div>


		<br></br>
		<div id="video">
			<video class="videoReceiveClass" id="localVideo" autoplay muted></video>
			<video class="videoSendClass" id="remoteVideo" autoplay></video>
		</div>
	</div>



	<!-- Change background -->
	<div class="settingsMenu">
		Customize background
		<ul class="noBorder">
			<button class="colorButton lightGrey "
				onclick="changeBackground('#eee')"></button>
			<button class="colorButton bisque"
				onclick="changeBackground('bisque')"></button>
			<button class="colorButton lavender"
				onclick="changeBackground('lavender')"></button>
			<button class="colorButton mediumAquaMarine "
				onclick="changeBackground('mediumAquaMarine')"></button>
			<button class="colorButton lightSalmon "
				onclick="changeBackground('lightSalmon')"></button>
		</ul>
	</div>

	<div class="friendsMenuHeader">
		<h3>Friends</h3>
		<input id="addFriendTextBox" type="text" name="username"
			class="searchBoxClass" placeholder="Add friend by username">
		<button id="addFriendButton" class="addFriendButtonClass">Add Friend</button>
	</div>

	<div class="friendsMenu">
		<table id="friendsTable" class="friendsTable">
			<tr id="friendTab">	</tr>
		</table>
	</div>




	<br> <br>
	<div class="fileTransfer">
		<form id="fileInfo">
			<input type="file" id="fileInput" name="files" class="fileClass" /><br>
		</form>
		<button id="sendFileButton" class="fileClass">Send File</button>
		<br> <a id="download"></a>
	</div>

</div>