var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function() {
    $.ajax('config.json').then(function(cfg) {
        var fb = new Firebase(cfg.backgroundsRef);
        fb.on('child_added', function(snapshot) {
            // choose a background
            var a = [];
            var o = snapshot.val();
            for (p in o) {
                if (o.hasOwnProperty(p)) {
                    a.push(o[p]);
                }
            }
            var bg = a[getRandomInt(0, a.length - 1)];
            $('<img>').load(function() {
                $('.bg').css('opacity', 0);
                $('.bg').css('background-image', 'url(' + bg.url + ')');
                $('.bg').animate({
                    opacity: '1'
                }, 1500);
            }).attr('src', bg.url);
        });
        $.ajax(cfg.timeUrl).then(function(response) {
            var time = moment(new Date(response/1));
            var may = moment(new Date(2015, 04, 01));
            setInterval(function() {
                time.add(1, 'seconds');
                $('.countdown').html(may.diff(time, 'seconds'));
            }, 1000);
        });
    });
});