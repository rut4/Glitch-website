(function () {
	VK.init({ apiId: 3863940 });

	$("#glitchButton").on("click", auth);

	$("#buttonGroup")
		.on("click", "#backButton", goBack)
		.on("click", "#postToWallBtn", postToWall);

	function auth() {
		var $button = $("#glitchButton"),
			$loader = $("#loader");

		$loader.show();
		$button.fadeOut();
		try {
			VK.Auth.getLoginStatus(function (response) {
				if (response.session) {
					startGlitch(); // if login
				} else {
					VK.Auth.login(startGlitch, 6); // if not login
				}
			});
		} catch(e) {
			$button.fadeIn();
			$loader.hide();
		}
	}

	function startGlitch() {
		
		var urls = []; //list urls of photos

		VK.Api.call("friends.get", {
			fields: ["photo_100"],
			count: 25,
			order: "random"
		}, function (r) {
			r = r.response;
			if (!r) // if VK not response
			{
				startGlitch(); // then repeat startGlitch
				return;
			}
			for (var i = 0; i < r.length; i++)
				urls.push(r[i].photo_100); //save photo url

			$.ajax("glitch.php", //get modifited photos
			{
				type: "post",
				success: imagesGetted,
				data: { "urls": JSON.stringify(urls) }
			});
		});
	}

	function imagesGetted(data) {
		try {
			data = eval(data);
		} catch(e) {
			startGlitch();
			return;
		}

		$("#loader").hide();


		var $imgsWrapper = $("#imagesWrapper");

		//append glitched photos
		for (var key in data)
		{
			var $img = $("<img>")
				.attr("src", data[key])
				.attr("alt", data[key]);

			$imgsWrapper.append($img);
		}


		$("#buttonGroup").show();

		$imgsWrapper.fadeIn();

		//if window closing then delete user photos from server
		$(window).on("unload", $.proxy(deleteImgsFromServer, this, false));
	}

	function goBack() {
		deleteImgsFromServer();

		$(window).off("unload");

		$("#buttonGroup").hide();
		$("#imagesWrapper")
			.fadeOut()
			.empty();
		 $("#glitchButton").fadeIn();
	}

	function postToWall() {
		$.ajax("merge_imgs.php", {
			success: function (photo_url) {
				VK.Api.call("photos.getWallUploadServer", {},
					function (url) { //get upload url
						url = url.response.upload_url;
						$.ajax("post_to_wall.php", //download mosaic to VK
						{
							type: "post",
							data: {
								url: url,
								photo_url: photo_url
							},
							success: function (response) {
								response = JSON.parse(response);
								VK.Api.call("photos.saveWallPhoto", response, //save mosaic to album in VK
									function(res) { // post mosaic to wall
										VK.Api.call("wall.post", {
											attachments: [res.response[0].id,"http://edu.oggettoweb.ru/backend/"],
											message: "GLITCH EM Website"
										}, function () { });
									});
							}
						});

								
							
					});
			}
		});
	}
		

	function deleteImgsFromServer(asnc) {
		asnc = asnc === undefined ? true : false;
		$.ajax("rem_imgs.php", {
			async: asnc
		});
	}

})();

