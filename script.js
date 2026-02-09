// Wait for the DOM to be fully loaded before running any jQuery; 
// Temporary button work to test the waters of jquery
$(document).ready(function() {

    $('#getRandomFact').on('click', function() {
      
        $('#factText').fadeOut(300, function() {
            $(this).text("Here's a fun placeholder anime fact! (Real one coming soon...)").fadeIn(500);
        });

       
        $('#animeImage').fadeTo(800, 1.0);

      
        $(this).css('background-color', '#8FBC8F').delay(1000).queue(function(next) {
            $(this).css('background-color', ''); 
            next();
        });
    });

    
    $('#getNewTrack').on('click', function() {
        $('#trackInfo').html('<em>Loading new vibe track...</em>');

        
        $('#trackImage').slideUp(400).slideDown(600, function() {
            $('#trackInfo').text("Chill anime OST playing in background (demo mode)");
        });

        
        $(this).text("Fetching New Track...").delay(1500).queue(function(next) {
            $(this).text("New Background Track");
            next();
        });
    });

    
    $('#toggleMusic').on('click', function() {
        $('#bgAudio').fadeToggle(500);

        
        if ($(this).text() === 'Play/Pause Music') {
            $(this).text('Music Controls Shown');
        } else {
            $(this).text('Play/Pause Music');
        }

        $(this).addClass('btn-warning').delay(800).queue(function(next) {
            $(this).removeClass('btn-warning');
            next();
        });
    });

    console.log("jQuery is working! Buttons are ready for real API data next.");
});