$(document).ready(function() {

    $('#getRandomFact').on('click', function() {
        $('#factText').fadeOut(300, function() {
            $(this).html('<em>loading anime quote...</em>').fadeIn(500);
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        fetch('https://api.animechan.io/v1/quotes/random', { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error('API not ok - status: ' + response.status + ' (check rate limit?)');
                }
                return response.json();
            })
            .then(data => {
                const quote = data.data.content;
                const anime = data.data.anime.name;
                const character = data.data.character.name;

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
                    $('#factText').text('rate limit hit (5/hour free) - wait about an hour');
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

    loadPalette();  // initial load
});