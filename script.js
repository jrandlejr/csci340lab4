// script.js - Lab 4 jQuery stuff with anime quotes
// James - using current animechan.io endpoint, fixed nested data parsing

$(document).ready(function() {

    // Random Quote button - https://api.animechan.io/v1/quotes/random
    $('#getRandomFact').on('click', function() {
        // loading text
        $('#factText').fadeOut(300, function() {
            $(this).html('<em>grabbing an anime quote... (might be slow if rate limited)</em>').fadeIn(500);
        });

        // timeout to avoid hanging forever
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);  // 8 sec max

        fetch('https://api.animechan.io/v1/quotes/random', { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error('API not ok - status: ' + response.status + ' (check rate limit?)');
                }
                return response.json();
            })
            .then(data => {
                // FIXED: response is nested under data.data
                const quote = data.data.content;  // quote text
                const anime = data.data.anime.name;  // anime name
                const character = data.data.character.name;  // character name

                // show formatted
                $('#factText').fadeOut(400, function() {
                    $(this).html(`<strong>${character} (${anime}):</strong><br>${quote}`).fadeIn(600);
                });

                // placeholder image with anime name
                $('#animeImage').attr('src', `https://via.placeholder.com/400x300?text=${anime}+Quote`);

                // add subheader
                $('#factText').siblings('h3').remove();
                $('#factText').before(`<h3 class="mb-3">${anime} Quote:</h3>`);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.log('fetch error:', error);
                if (error.name === 'AbortError') {
                    $('#factText').text('took too long - try again or check network');
                } else if (error.message.includes('429')) {
                    $('#factText').text('rate limit hit (5/hour free) - wait about an hour');
                } else {
                    $('#factText').text('couldnt load quote - check console for details');
                }
            });

        // button feedback
        $(this).text('Fetching Quote...').delay(2000).queue(function(next) {
            $(this).text('Get Random Anime Fact');
            next();
        });
    });

    // New Track button - placeholder for Openwhyd music next
    $('#getNewTrack').on('click', function() {
        $('#trackInfo').html('<em>looking for a track...</em>');

        $('#trackImage').slideUp(400).slideDown(600, function() {
            $('#trackInfo').text("chill anime OST in background (demo for now)");
        });

        $(this).text("Fetching New Track...").delay(1500).queue(function(next) {
            $(this).text("New Background Track");
            next();
        });
    });

    // Toggle Music button - show/hide player
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

    console.log("script loaded - animechan.io quotes with fixed parsing");
});