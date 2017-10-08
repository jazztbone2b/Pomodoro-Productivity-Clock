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
		let counter = document.querySelector('#timer-text');
		let currentMins = mins - 1;
		seconds--;
		counter.innerHTML = currentMins.toString() + ':' + (seconds < 10 ? '0' : '') + String(seconds);
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
