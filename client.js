var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// <DOMNode> options.placeholder
// <Date> options.currentTime
var Countdown = function(options) {
    this._$placeholder = $(options.placeholder);
    this._currentTime = moment(options.currentTime);
    this._mayTime = moment(new Date(2015, 04, 01));
    setInterval(function() {
        this._tick();
    }.bind(this), 1000);
};

Countdown.prototype._tick = function() {
    this._currentTime.add(1, 'seconds');
    this._$placeholder.html(this._mayTime.diff(this._currentTime, 'seconds'));
};

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
                var blur = bg.blur || cfg.defaultBlur || 0;
                var getBlurStyleString = function(blurAmount) {
                    var s = '';
                    var p = ['filter', '-o-filter', '-ms-filter', '-moz-filter', '-webkit-filter'];
                    p.map(function(e) {
                        s += e + ': ' + 'blur(' + blurAmount + 'px' + ')' + ';';
                    });
                    return s;
                };
                $('.bg')[0].setAttribute('style', $('.bg')[0].getAttribute('style') + ' ' + getBlurStyleString(blur));
                $('.bg').animate({
                    opacity: bg.opacity ? bg.opacity + '' : '1'
                }, 1500);
            }).attr('src', bg.url);
        });
        $.ajax(cfg.timeUrl).then(function(response) {
            new Countdown({
                placeholder: $('.countdown')[0],
                currentTime: new Date(response / 1)
            });
        });
    });
});