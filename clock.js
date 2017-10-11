//Hack Timer by stalingradd https://github.com/stalingraddd ///////////////////////////
(function (workerScript) {
	if (!/MSIE 10/i.test (navigator.userAgent)) {
		try {
			var blob = new Blob (["\
var fakeIdToId = {};\
onmessage = function (event) {\
	var data = event.data,\
		name = data.name,\
		fakeId = data.fakeId,\
		time;\
	if(data.hasOwnProperty('time')) {\
		time = data.time;\
	}\
	switch (name) {\
		case 'setInterval':\
			fakeIdToId[fakeId] = setInterval(function () {\
				postMessage({fakeId: fakeId});\
			}, time);\
			break;\
		case 'clearInterval':\
			if (fakeIdToId.hasOwnProperty (fakeId)) {\
				clearInterval(fakeIdToId[fakeId]);\
				delete fakeIdToId[fakeId];\
			}\
			break;\
		case 'setTimeout':\
			fakeIdToId[fakeId] = setTimeout(function () {\
				postMessage({fakeId: fakeId});\
				if (fakeIdToId.hasOwnProperty (fakeId)) {\
					delete fakeIdToId[fakeId];\
				}\
			}, time);\
			break;\
		case 'clearTimeout':\
			if (fakeIdToId.hasOwnProperty (fakeId)) {\
				clearTimeout(fakeIdToId[fakeId]);\
				delete fakeIdToId[fakeId];\
			}\
			break;\
	}\
}\
"]);
			// Obtain a blob URL reference to our worker 'file'.
			workerScript = window.URL.createObjectURL(blob);
		} catch (error) {
			/* Blob is not supported, use external script instead */
		}
	}
	var worker,
		fakeIdToCallback = {},
		lastFakeId = 0,
		maxFakeId = 0x7FFFFFFF, // 2 ^ 31 - 1, 31 bit, positive values of signed 32 bit integer
		logPrefix = 'HackTimer.js by turuslan: ';
	if (typeof (Worker) !== 'undefined') {
		function getFakeId () {
			do {
				if (lastFakeId == maxFakeId) {
					lastFakeId = 0;
				} else {
					lastFakeId ++;
				}
			} while (fakeIdToCallback.hasOwnProperty (lastFakeId));
			return lastFakeId;
		}
		try {
			worker = new Worker (workerScript);
			window.setInterval = function (callback, time /* , parameters */) {
				var fakeId = getFakeId ();
				fakeIdToCallback[fakeId] = {
					callback: callback,
					parameters: Array.prototype.slice.call(arguments, 2)
				};
				worker.postMessage ({
					name: 'setInterval',
					fakeId: fakeId,
					time: time
				});
				return fakeId;
			};
			window.clearInterval = function (fakeId) {
				if (fakeIdToCallback.hasOwnProperty(fakeId)) {
					delete fakeIdToCallback[fakeId];
					worker.postMessage ({
						name: 'clearInterval',
						fakeId: fakeId
					});
				}
			};
			window.setTimeout = function (callback, time /* , parameters */) {
				var fakeId = getFakeId ();
				fakeIdToCallback[fakeId] = {
					callback: callback,
					parameters: Array.prototype.slice.call(arguments, 2),
					isTimeout: true
				};
				worker.postMessage ({
					name: 'setTimeout',
					fakeId: fakeId,
					time: time
				});
				return fakeId;
			};
			window.clearTimeout = function (fakeId) {
				if (fakeIdToCallback.hasOwnProperty(fakeId)) {
					delete fakeIdToCallback[fakeId];
					worker.postMessage ({
						name: 'clearTimeout',
						fakeId: fakeId
					});
				}
			};
			worker.onmessage = function (event) {
				var data = event.data,
					fakeId = data.fakeId,
					request,
					parameters,
					callback;
				if (fakeIdToCallback.hasOwnProperty(fakeId)) {
					request = fakeIdToCallback[fakeId];
					callback = request.callback;
					parameters = request.parameters;
					if (request.hasOwnProperty ('isTimeout') && request.isTimeout) {
						delete fakeIdToCallback[fakeId];
					}
				}
				if (typeof (callback) === 'string') {
					try {
						callback = new Function (callback);
					} catch (error) {
						console.log (logPrefix + 'Error parsing callback code string: ', error);
					}
				}
				if (typeof (callback) === 'function') {
					callback.apply (window, parameters);
				}
			};
			worker.onerror = function (event) {
				console.log (event);
			};
			console.log (logPrefix + 'Initialisation succeeded');
		} catch (error) {
			console.log (logPrefix + 'Initialisation failed');
			console.error (error);
		}
	} else {
		console.log (logPrefix + 'Initialisation failed - HTML5 Web Worker is not supported');
	}
}) ('HackTimerWorker.js');
//////////////////////////////////////////////////////////////////////////////////////////////
//Coded by Collin Banks
function load(){
	let a = $('#timer-text').html();
	let b = $('#set-text').html();
	a = b;
	$('#timer-text').html(a);
}
//audio file to be passed into the startMyTimer function
function playAudio(){
	let alarm = 'Notification-Sound.wav';
	let aud = new Audio(alarm);
	aud.play();
}
//reloads the page to start over
function stopTimer(){
	$('#stop-time').click(function(){
		location.reload(true);
	})
}
//starts the timer
function startMyTimer(){
	$('#start-time').click(function(){
		$('#start-time').hide();
		$('#break-time').hide();
		$('#set-time').hide();

		$('#stop-time').show();
		$('#timer').css('border-color', '#00acc1');
		$('#title').html('Session in progress...');

		//takes the session length and multiplies it by 60000 to be  
		//stored in a var and passed into the setTimeout function
		let sessionTime = $('#set-text').html();
		let milliseconds = sessionTime * 60000;
		
		timer(sessionTime);
		
		setTimeout(function(){
			startBreak();
			playAudio();
		}, milliseconds);
	});
}
//starts the break
function startBreak(){
	let breakTime = $('#break-text').html();
	$('#timer-title').html('Break');
	$('#timer').css('border-color', '#e53935');
	$('#stop-time').css('color', 'white');
	$('#stop-time').css('background-color', '#e53935');
	$('#title').html('Take a break...');
	
	let milliseconds = breakTime * 60000;
	timer(breakTime);

	setTimeout(restart, milliseconds);
}
//lets the user start a new timer
function restart(){
	$('#timer-title').html('Session <br>Over');
	$('#timer-text').html('');
	$('#stop-time').hide();
	$('#restart').show();
	$('#timer').css('border-color', '#fb8c00');

	$('#title').html('Session complete!');

	$('#restart').click(function(){
		$('#restart').hide();
		$('#start-time').show();
		$('#timer-title').html('Session');
		$('#timer-text').html('25');
		$('#set-text').html('25');
		$('#break-text').html('5');
		$('#break-time').show();
		$('#set-time').show();
		$('#title').html('Pomodoro Productivity Clock');
		$('#timer').css('border-color', '#43a047');
	});
}

//function to create a timer
function timer(min){
	let seconds = 60;
	let mins = min;

	function tick(){
		let counter = $('#timer-text');
		let currentMins = mins - 1;
		seconds--;
		counter.html(currentMins.toString() + ':' + (seconds < 10 ? '0' : '') + String(seconds));
		if (seconds > 0){
			setTimeout(tick, 1000);
		} else {
			if (mins > 1){
				timer(mins - 1);
			}
		}
	}
	tick();
}

///***************User input functionality**************///
//subtract break length
$('#less').click(function(){
	let i = $('#break-text').html();
	i--;

	if(i < '1'){
		$('#break-text').html('1');
	} else{
		$('#break-text').html(i);
	}
})

//add break length
$('#more').click(function(){
let i = $('#break-text').html();
	i++;
	$('#break-text').html(i);	
})

//subtract session length
$('#minus').click(function(){
	let i = $('#set-text').html();
	i--;

	if(i > '1'){
		$('#set-text').html(i);
		$('#timer-text').html(i);
	} else{
		$('#set-text').html(1);
		$('#timer-text').html(1);
	}	
})

//add session length
$('#plus').click(function(){
	let i = $('#set-text').html();
	i++;
	$('#set-text').html(i);
	$('#timer-text').html(i);
})

window.onload = load(), startMyTimer(), stopTimer();
