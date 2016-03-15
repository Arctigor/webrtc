<html>
<meta name="description"
	content="Simplest possible examples of HTML, CSS and JavaScript." />
<meta name="author" content="//samdutton.com">
<meta name="viewport"
	content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes">
<meta itemprop="name"
	content="simpl.info: simplest possible examples of HTML, CSS and JavaScript">
<meta itemprop="image" content="/icon_192x192.png">
<meta name="mobile-web-app-capable" content="yes">
<meta id="theme-color" name="theme-color" content="#fff">

<base target="_blank">

<title>RTCPeerConnection</title>

<link rel="stylesheet" href="/assets/css/main.css" />

<style>
button {
	margin: 0 20px 0 0;
	width: 85.9px;
}

button#hangupButton {
	margin: 0;
}

p.borderBelow {
	margin: 0 0 1.5em 0;
	padding: 0 0 1.5em 0;
}

video {
	height: 225px;
	margin: 0 0 20px 0;
	vertical-align: top;
	width: calc(50% - 13px);
}

video#localVideo {
	margin: 0 20px 20px 0;
}

@media screen and (max-width: 400px) {
	button {
		width: 83px;
	}
	button {
		margin: 0 11px 10px 0;
	}
	video {
		height: 90px;
		margin: 0 0 10px 0;
		width: calc(50% - 7px);
	}
	video#localVideo {
		margin: 0 10px 20px 0;
	}
}
</style>

</head>
<body>
	<div class="container">
		<div class="menu">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/login">Login</a></li>
			</ul>
		</div>
		<div>
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