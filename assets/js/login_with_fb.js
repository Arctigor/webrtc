login();

function login(){
	setTimeout(function() {
		connectToFacebook();
	}, 2000);
	
	
	function loginWithFb(response) {
		FB.api('/me', function(userInfo) {
		var responseJSON = null;
		myDataJSON = {
			fbId : userInfo.id,
		};
		$.ajax({
			data : myDataJSON,
			type : "post",
			url : "/formLogin",
			async : false,
			success : function(response) {
				responseJSON = response;
				if(response.success == "true"){
					window.location = "/welcome";
				} else{
					window.location = "/fbError";
				}
			}
		});
		return responseJSON;
		});
	}
	
	function connectToFacebook(){
		FB.getLoginStatus(function(response) {
		      if (response.status == 'connected') {
		    	  	loginWithFb(response);
		      } else {
		        FB.login(function(response) {
		          if (response.authResponse){
		        	 loginWithFb(response);
		          } else {
		            console.log('Auth cancelled.')
		          }
		        }, { scope: 'email' });
		      }
		    });
	}
}