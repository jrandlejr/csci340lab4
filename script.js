// James - Used W3Schools jQuery tutorial[](https://www.w3schools.com/jquery/) for .on(), .fadeOut(), .html(), .css(), .getJSON()
// Also followed Khan Academy jQuery lessons for events and DOM changes
// NOTE: Originally used api.animechan.io/v1 (new API) but it has a 5 req/hour rate limit
// NOTE: Switched to yurippe.vercel.app/api/quotes — animechan endpoints became unreliable
// Source for jQuery methods used below: https://www.w3schools.com/jquery/


$(document).ready(function() {
    // Button to load new quote + trigger palette (W3Schools .on() and .fadeOut() example)
    $('#getRandomFact').on('click', function() {
      
        $('#factText').fadeOut(300, function() {
            $(this).html('<em>loading anime quote...</em>').fadeIn(500);
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);


       
        // Switched to animechan.vercel.app — original free endpoint, no rate limit, no API key needed
        fetch('https://yurippe.vercel.app/api/quotes?random=1', { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error('API not ok - status: ' + response.status + ' (check rate limit?)');
                }
                return response.json();
            })
            .then(data => {
             // yurippe API returns an array, so we grab index [0]
            const quote = data[0].quote;
            const anime = data[0].show; 
            const character = data[0].character;

                
                $('#factText').fadeOut(400, function() {
                    $(this).html(`<span class="character-name">${character}</span> (${anime}):<br>${quote}`).fadeIn(600);
                });
                
                $('#animeImage').attr('src', 'https://picsum.photos/seed/' + encodeURIComponent(anime) + '/600/400');

                $('#factText').siblings('h3').remove();
                $('#factText').before(`<h3 class="mb-4">${anime} Quote</h3>`);

                loadPalette(); 
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.log('quote error:', error);
                if (error.name === 'AbortError') {
                    $('#factText').text('took too long - try again or check network');
                } else if (error.message.includes('429')) {
                    // NEW:
                    $('#factText').text('could not load quote — API may be temporarily down, try again in a moment');
                } else {
                    $('#factText').text('couldnt load quote - check console for details');
                }
            });

        $(this).text('Fetching Quote...').delay(2000).queue(function(next) {
            $(this).text('New Anime Quote');
            next();
        });
    });

    $('#refreshPalette').on('click', function() {
        $('#paletteInfo').text('loading new palette...');
        loadPalette();

        $(this).text('Loading...').delay(1000).queue(function(next) {
            $(this).text('New Vibe Colors');
            next();
        });
    });

    function loadPalette() {
        $.getJSON('https://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=?', function(palettes) {
            if (palettes && palettes.length > 0) {
                const colors = palettes[0].colors;

                const primary = '#' + colors[0];
                const secondary = '#' + (colors[1] || colors[0]);
                const accent = '#' + (colors[2] || colors[0]);
                const bg = '#' + (colors[3] || 'ffffff');

                $('.card').css('background-color', primary + '10');
                $('.card-title, h1, h2, h3').css('color', primary);
                $('.btn-primary').css('background-color', secondary).css('border-color', secondary);
                $('.btn-primary:hover').css('background-color', accent);
                $('body').css('background-color', bg + '20');

                $('#paletteInfo').text('Current vibe palette: ' + colors.map(c => '#' + c).join(' → '));
            }
        }).fail(function() {
            $('#paletteInfo').text('couldnt load palette - using default theme');
        });
    }

    function loadAnimeInfo() {
    fetch('https://api.jikan.moe/v4/random/anime')
        .then(response => response.json())
        .then(data => {
             // Jikan wraps everything inside "data"
            // so data.data gets us to the actual anime fields
            console.log(data.data.title);
        })
}

    loadPalette()
     loadAnimeInfo();
});