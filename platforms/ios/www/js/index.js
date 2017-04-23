/*****************************************************************
File: index.js
Author: Jake Oh
Description:
Here is the sequence of logic for the app
- Once Device ready, will read localStorage
Version: 0.0.1
Updated: Apr 22, 2017
- 
*****************************************************************/
const MYKEY = "reviewr-oh000024";

let greviews = [];

var grating = 1;
var stars = null;

let regNumber = /^[0-5]$/;
let greviewId = 0;
let imagepath = "";

let BASE64 = "data:image/png;base64,";

var REVIEW = {
	id: '',
	name: '',
	rating: 0,
	img: ''
};


function addListeners() {
  [].forEach.call(stars, function (star, index) {
		star.addEventListener('click', (function (idx) {
			console.log('adding listener', index);
			return function () {
				grating = idx + 1;
				setRating();
			}
		})(index));
	});
}

function setRating() {
  [].forEach.call(stars, function (star, index) {
		if (grating > index) {
			star.classList.add('rated');
		} else {
			star.classList.remove('rated');
		}
	});
}
var MessageHandler ={
	
	Login:function(){
		console.log("Login");
		
	},
	Register:function(){
		console.log("Register");
	},
	
},
var app = {
	localNote: null,
	init: function () {
		try {
			document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		} catch (e) {
			document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
			console.log('failed to find deviceready');
		}
	},
	onDeviceReady: function () {
		
		let lBut = windows.document.getElementById("Login");
		let rBut = windows.document.getElementById("Register");
		
		if(lBut && 0xff  && (rBut & 0xff)){
		   lBut.addEventListener("touchstart",MessageHandler.Login);
			rBut.addEventListener("touchstart",MessageHandler.Register);
		   };
			
//		GSTORAGE.init();
//		GAPP.init();
		console.log("called onDeviceReady");
		window.addEventListener('push', app.pageChanged);
		//app.showPersonList();
	},
	pageChanged: function (ev) {
		console.log('pageChanged' + " ");

		console.trace(globalPersonId);
		switch (id) {
			case "personPage":
				//app.showPersonList();
				break;
			case "giftPage":
				//let fields = document.URL.split('#');
				//app.showGifts(globalPersonId);
				break;
		}
	},
	onCancel: function (m) {

	},
	onSave: function () {

	},

	onCamera: function () {
		console.log("Operating a camera");

		var options = {
			quality: 80,
			destinationType: Camera.DestinationType.FILE_URI,
			encodingType: Camera.EncodingType.PNG,
			mediaType: Camera.MediaType.PICTURE,
			pictureSourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			targetWidth: 300,
			targetHeight: 300
		}
		navigator.camera.getPicture(app.onSuccess, app.onError, options);
	},
	onSuccess: function (imageData) {
		console.log("successfull." + imageData);

		imagepath = imageData; //"data:image/jpeg;base64,"

		let img = document.createElement("img");
		img.classList.add("mid-thumb");

		let modalpad = document.querySelector("#ReviewModal p.content-padded");

		img.src = imageData;
		img.style.width = "100%";
		img.style.height = "100%";

		//thumb.style.display="block";

		HTMLHANDLER.replaceBut(img);

	},
	onError: function (obj, type = "bad", message) {
		//		console.log(message);
		app.generateMessage(obj, type = "bad", message);
	},
	generateMessage: function (obj, type = "bad", message) {
		let mcontent = window.document.querySelector(obj);
		//let mcontentpad = window.document.querySelector('#ReviewModal div.content-padded');
		let div = document.createElement('div');

		div.classList.add('msg');
		setTimeout(function () {
			div.classList.add(type);
		}, 20); //delay before adding the class to trigger transition

		div.textContent = message === null ? "Unknown Error" : message;

		mcontent.insertBefore(div, mcontent.firstElementChild[0]);
		setTimeout((function (m, d) {
			return function () {
				m.removeChild(d);
			}
		})(mcontent, div), 3210);
	}
};


const GSTORAGE = {
	storage: "",
	gdata: null,
	init: function () {
		try {
			console.log("Start GSTROGAGE Initialization");
			this.gdata = [];
			this.storage = localStorage.getItem(MYKEY);

			if (this.storage === null) {
				console.log("LocalStorage is Empty");
				//this.gdata=greviews;
				//localStorage.setItem(MYKEY,JSON.stringify(this.gdata));
			} else {
				this.gdata = JSON.parse(this.storage);
				console.log("FIRST DATA: " + this.gdata);

				//this.sortData(this.gdata);
				console.log("LATER DATA: " + this.gdata);
			}
			console.log("Finish GSTROGAGE Initialization");
		} catch (e) {
			console.log(e.message);
		}
	},
	saveReview: function (review) {

	},

	deleteReview: function (id) {

	}
}
const HTMLHANDLER = {
	createReviewsList: function () {

	},

	clearModal: function () {}
}

app.init();
