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
    var t = moment(this._mayTime);
    var months = t.diff(this._currentTime, 'months');
    t.subtract(months, 'months');
    var days = t.diff(this._currentTime, 'days');
    t.subtract(days, 'days');
    var hours = t.diff(this._currentTime, 'hours');
    t.subtract(hours, 'hours');
    var minutes = t.diff(this._currentTime, 'minutes');
    t.subtract(minutes, 'minutes');
    var seconds = t.diff(this._currentTime, 'seconds');
    t.subtract(seconds, 'seconds');
    this._$placeholder.html(months + ':' + days + ':' + hours + ':' + minutes + ':' + seconds);
};

// <DOMNode> options.placeholder
// <Object> options.backgrounds
var Background = function(options) {
    this._backgrounds = options.backgrounds;
    this._$placeholder = $(options.placeholder);
    this._defaultBlur = options.defaultBlur || 0;
    this._switch(this._pickRandom(this._backgrounds));
};

// <Object> backgrounds
Background.prototype._pickRandom = function(backgrounds) {
    var a = [];
    var o = backgrounds;
    for (p in o) {
        if (o.hasOwnProperty(p)) {
            a.push(o[p]);
        }
    }
    return a[getRandomInt(0, a.length - 1)];
};

// <Object> background
Background.prototype._switch = function(bg) {
    var getBlurStyleString = function(blurAmount) {
        var s = '';
        var p = ['filter', '-o-filter', '-ms-filter', '-moz-filter', '-webkit-filter'];
        p.map(function(e) {
            s += e + ': ' + 'blur(' + blurAmount + 'px' + ')' + ';';
        });
        return s;
    };

    var $bg = this._$placeholder;

    $('<img>').load(function() {
        // after image loads
        $bg.css('opacity', 0);
        $bg.css('background-image', 'url(' + bg.url + ')');

        var blur = bg.blur || this._defaultBlur;
        $bg[0].setAttribute('style', $bg[0].getAttribute('style') + ' ' + getBlurStyleString(blur));

        $bg.animate({
            opacity: bg.opacity ? bg.opacity + '' : '1'
        }, 1500);
    }).attr('src', bg.url);
};

$(document).ready(function() {
    $.ajax('config.json').then(function(cfg) {
        var fb = new Firebase(cfg.backgroundsRef);
        fb.on('child_added', function(snapshot) {
            new Background({
                placeholder: $('.background')[0],
                backgrounds: snapshot.val()
            });
        });
        $.ajax(cfg.timeUrl).then(function(response) {
            new Countdown({
                placeholder: $('.countdown')[0],
                currentTime: new Date(response / 1)
            });
        });
    });
});