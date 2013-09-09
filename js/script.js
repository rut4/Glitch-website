(function () {
	VK.init({ apiId: 3863940 });

	$("#glitchButton").on("click", $.proxy(VK.Auth.login, this, startGlitch, 6));
	$("#buttonGroup")
		.on("click", "#backButton", goBack)
		.on("click", "#postToWallBtn", postToWall);

	
	function startGlitch() {
		$("#glitchButton").fadeOut();

		var urls = [];

		$("#loader").show();

		VK.Api.call("friends.get", {
			fields: ["photo_100"],
			count: 25,
			order: "random"
		}, function (r) {
			r = r.response;
			if (!r)
			{
				startGlitch();
				return;
			}
			for (var i = 0; i < r.length; i++)
				urls.push(r[i].photo_100);

			$.ajax("glitch.php",
			{
				type: "post",
				success: imagesGetted,
				data: { "urls": JSON.stringify(urls) }
			});
		});
	}

	function imagesGetted(data) {
		$("#loader").hide();

		data = eval(data);
		var $imgsWrapper = $("#imagesWrapper");

		for (var key in data)
		{
			var $img = $("<img>")
				.attr("src", data[key])
				.attr("alt", data[key]);

			$imgsWrapper.append($img);
		}


		$imgsWrapper
			.children()
				.last()
					.on("load", function () {
						$("#buttonGroup").show();
						$imgsWrapper.fadeIn();
					});

		$(window).on("unload", $.proxy(deleteImgsFromServer, this, false));
	}

	function goBack() {
		deleteImgsFromServer();

		$(window).off("unload");

		$("#buttonGroup").hide();
		$("#imagesWrapper")
			.fadeOut(400, function() { $("#glitchButton").fadeIn(); })
			.empty();
	}

	function postToWall() {
		$.ajax("merge_imgs.php", {
			success: function (photo_url) {
				VK.Api.call("photos.getWallUploadServer", {},
					function (url) {
						url = url.response.upload_url;
						$.ajax("post_to_wall.php",
						{
							type: "post",
							data: {
								url: url,
								photo_url: photo_url
							},
							success: function (response) {
								response = JSON.parse(response);
								VK.Api.call("photos.saveWallPhoto", response,
									function(res) {
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

