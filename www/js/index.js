/*****************************************************************
File: index.js
Author: Jake Oh
Description:
Here is the sequence of logic for the app
- Once Device ready, will read localStorage
Version: 0.0.1
Updated: Apr 22, 2017
- Login
*****************************************************************/
// DEFINE ERROR VALUE
const NO_ERROR = 0;
const REGISTER = 0;
const LOGIN = 1;
const LISTUSERS = 2;
const LISTMESSAGES = 3;
const SENDMESSAGES = 4;
const GETMESSAGE = 5;
const DELETEMESSAGE = 6;

var PATTERN = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;

let METHODS = [];
let POSTBOX = [];
let gURL = "";
let globalMsgId = 0;
let gGuid = "";
let gUid = 0;


function getJson() {
	gURL = decodeURIComponent(data.baseurl);
	METHODS = data.methods;
}

function MessageManipulator() {

	this.send = function (userID, message, ctx) {
		try {
			BITS.setUserId(BITS.numberToBitArray(userID));
			BITS.setMsgLength(BITS.numberToBitArray(message.length));
			BITS.setMessage(message);
		} catch (e) {
			console.log("ERROR");
		}
	}
}

//MessageManipulator.prototype = new BITS;


function Postman() {
	this.sender = function (request, callback) {

			fetch(request)
				.then(function (response) {
					return response.json();
				}).then(function (data) {
					callback(data);
				})
		},
		this.reciever = function () {}
}

var PublicpostMan = new Postman();

function PrivatePostman() {
	this.userid = 0;
	this.email = "";
	this.localManipulator = new MessageManipulator();
}

PrivatePostman.prototype = new Postman();

function getFormData(messagetype) {
	var formElement = document.querySelector("form");
	let form = new FormData(formElement);

	if (!(formElement && 0xff) && !(form && 0xff)) {

		throw new Error("From is Null");
	}

	let username = document.getElementById("user").value;
	let email = document.getElementById("email").value;

	if ((username === null) || (email === null)) {
		throw new Error("Please,enter name and email.");
	}

	let ret = PATTERN.test(email);
	console.log(ret)

	if (!ret) {
		throw new Error("URL is invalid!");
	}

	form.append("user_name", username); // user_name;
	form.append("email", email); // email
	let url = gURL + METHODS[messagetype].endpoint;
	return {
		form,
		url
	};
}

function onRegister(data) {
	console.log("onRegister" + data);
}

function onLogin(data) {
	console.log(data);

	if (NO_ERROR == data.code) {
		let form = new FormData();
		form.append("user_id", data.user_id);
		form.append("user_guid", data.user_guid);
		let url = gURL + METHODS[LISTMESSAGES].endpoint;

		gGuid = data.user_guid;
		gUid = data.user_id;

		let req = new Request(url, {
			method: 'POST',
			mode: 'cors',
			body: form
		})

		let retdata = PublicpostMan.sender(req, onMessageList);
		console.log(retdata);
	}
}

function onMessageList(data) {

	console.log("onMessageList: " + data);

	POSTBOX = data.messages;
	let messageListModal = document.getElementById("MessageListModal");
	ul = document.querySelector(".table-view");
	ul.innerHTML = "";
	try {
		let users = data.messages;
		for (let message of data.messages) {
			//this.createHtml4Peple(msg);

			let li = document.createElement("li");
			let spanName = document.createElement("span");
			//let spanDate = document.createElement("span");
			let aName = document.createElement("a");
			//let aDod = document.createElement("a");
			//let sbadges = document.createElement("span");

			li.classList.add("table-view-cell");
			spanName.classList.add("name");

			aName.href = "#MessageListModal";
			aName.textContent = "Message From: " + message.user_name;

			aName.classList.add("navigate-right", "pull-right");
			//			aDod.href = "ViewMessageModal";

			//			sbadges.classList.add("badge","badge-primary","pull-right");
			//			sbadges.textContent = ;

			//aDod.appendChild(sbadges);
			let att = document.createAttribute("msg-id");
			att.value = message.msg_id;
			aName.setAttributeNode(att);

			// For Testing Event
			//			aName.addEventListener("touchstart", function (ev) {
			//				app.generateMessage(aName, ev)
			//			});

			aName.addEventListener("touchstart", (function (minf) {
				return function (id) {
					//"requires": ["user_id", "user_guid", "message_id"]
					//var a = ev.currentTarget;
					globalMsgId = aName.getAttribute("msg-id");

					let form = new FormData();
					form.append("user_id", gUid);
					form.append("user_guid", gGuid);
					form.append("message_id", minf.msg_id);
					let url = gURL + METHODS[GETMESSAGE].endpoint;

					let req = new Request(url, {
						method: 'POST',
						mode: 'cors',
						body: form
					})

					let retdata = PublicpostMan.sender(req, onViewMessage);

				}
			})(message));

			spanName.appendChild(aName);

			li.appendChild(spanName);

			ul.appendChild(li);

		}
	} catch (e) {
		alert(e.message);
	}
	messageListModal.classList.add("active");
}

function onViewMessage(data) {
	console.log(data);
	console.trace(data);
	console.debug(data);
	let viewMessageModal = document.getElementById("ViewMessageModal");
	viewMessageModal.classList.add("active");
	let img = document.createElement("img");
	img.src = gURL + '/' + data.image;

	let c = document.getElementById("canvas4reciever");

	let ctx = c.getContext('2d');

	img.addEventListener('load', function () {

		//		ctx.drawImage(img1, 0, 0);
		//		
		//		let ms = BITS.getMessage(data.sender, c);
		//		console.log("HERE IS your message: " + ms);
		//		
		//		let user = BITS.numberToBitArray(userID);
		//		BITS.setUserId(user, c);
		//
		//		for (var char = 0; char < message.length; char++) {
		//			BITS.setMessage(BITS.stringToBitArray(message), c);
		//		}

		let msg = BITS.getMessage(data.sender, c);

		let text = document.getElementById("rec_message");
		text.value = msg;
	})


	//let ctx = docment.querySelector("#ViewMessageModal.reciever");

}
var MessageHandler = {

	// First Login
	//	onLogin: function (data) {
	//		console.log(data);
	//		let form = new FormData();
	//		form.append("user_id", data.user_id);
	//		form.append("user_guid", data.user_guid);
	//		let url = gURL + METHODS[LISTMESSAGES].endpoint;
	//
	//		let req = new Request(url, {
	//			method: 'POST',
	//			mode: 'cors',
	//			body: form
	//		})
	//
	//		let retdata = PublicpostMan.sender(req, onMessageList);
	//		console.log(retdata);
	//	},
	//	onRegister: function (data) {
	//		console.log(data);
	//	},
	login: function () {
		console.log("Login");
		try {

			let baseData = getFormData(LOGIN);
			console.log(baseData.url);

			let req = new Request(baseData.url, {
				method: 'POST',
				mode: 'cors',
				body: baseData.form
			})

			let retdata = PublicpostMan.sender(req, onLogin);
			console.log(retdata);

		} catch (e) {
			//console.log(e.message);
			HTMLHANDLER.generateMessage(e.message, "bad");
		}

	},
	register: function () {
		let baseData = getFormData(REGISTER);
		console.log(baseData.url);

		let req = new Request(baseData.url, {
			method: 'POST',
			mode: 'cors',
			body: baseData.form
		})

		let retdata = PublicpostMan.sender(req, onRegister);
		console.log(retdata);
	},
	onSuccess: function (data) {

	},
	getMessage: function () {


	}
}
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
		documentForm = document.createElement("script");
		documentForm.addEventListener('load', getJson);
		documentForm.src = "js/requestFormat.js";
		document.body.appendChild(documentForm);

		let lBut = document.getElementById("login");
		let rBut = document.getElementById("register");
		let tBut = document.querySelector("form button.btn.btn-primary.btn-block");
		let sBut = document.querySelector("form button.btn.btn-positive.btn-block");

		if ((lBut && 0xff) && (rBut && 0xff)) {
			lBut.addEventListener("touchstart", MessageHandler.login);
			rBut.addEventListener("touchstart", MessageHandler.register);
		};

		tBut.addEventListener('touchstart', this.onCamera);
		sBut.addEventListener('touchstart', this.onSend);

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
	onSend: function () {

		var c = document.createElement("canvas");
		let m = new MessageManipulator();
		m.send(9, "This is Test Message", c);

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

		imagepath = imageData;

		var c = document.createElement("canvas");
		var ctx = c.getContext('2d');
		var img1 = document.createElement('img');
		img1.src = imageData;
		img1.addEventListener('load', function (ev) {
			//image has been loaded
			ctx.drawImage(img1, 0, 0);

		});
		//alternate image source

		let img =
			img.classList.add("mid-thumb");

		let modalpad = document.querySelector("#SendModal p.content-padded");

		img.src = imageData;
		img.style.width = "100%";
		img.style.height = "100%";

		let form = document.querySelector("#SendModal form");

		form.replaceChild(img, form.firstElementChild);
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



const HTMLHANDLER = {
	createReviewsList: function () {

	},
	getFormData: function () {

	},
	clearModal: function () {}
}

app.init();

//
//
//const GSTORAGE = {
//	storage: "",
//	gdata: null,
//	init: function () {
//		try {
//			console.log("Start GSTROGAGE Initialization");
//			this.gdata = [];
//			this.storage = localStorage.getItem(MYKEY);
//
//			if (this.storage === null) {
//				console.log("LocalStorage is Empty");
//				//this.gdata=greviews;
//				//localStorage.setItem(MYKEY,JSON.stringify(this.gdata));
//			} else {
//				this.gdata = JSON.parse(this.storage);
//				console.log("FIRST DATA: " + this.gdata);
//
//				//this.sortData(this.gdata);
//				console.log("LATER DATA: " + this.gdata);
//			}
//			console.log("Finish GSTROGAGE Initialization");
//		} catch (e) {
//			console.log(e.message);
//		}
//	},
//	saveReview: function (review) {
//
//	},
//
//	deleteReview: function (id) {
//
//	}
//}
