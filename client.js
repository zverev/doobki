var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getCookie = function(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

var setCookie = function(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

// <DOMNode> options.placeholder
// <Date> options.currentTime
var Countdown = function(options) {
    this._$placeholder = $(options.placeholder);
    this._currentTime = moment(options.currentTime);
    this._template = options.template;
    this._mayTime = moment(new Date(2015, 04, 01));
    this._$placeholder.html(Handlebars.compile(this._template)());
    this._tick();
    setInterval(function() {
        this._tick();
    }.bind(this), 1000);
};

Countdown.prototype._tick = function() {
    var parseDate = function(current, may) {
        var o = {};
        var c = moment(current);
        var d = moment(may);
        var entries = ['months', 'days', 'hours', 'minutes', 'seconds'];
        entries.map(function(e) {
            // ex: months = clonedTimeToMay.diff(currentTime, 'months');
            o[e] = d.diff(c, e);
            // ex: clonedTimeToMay.subtract(months, 'months');
            d.subtract(o[e], e);
        });
        return o;
    };

    this._currentTime.add(1, 'seconds');
    var dt = parseDate(this._currentTime, this._mayTime);
    this._$placeholder.find('.countdown-seconds').html(dt.seconds);
    this._$placeholder.find('.countdown-minutes').html(dt.minutes);
    this._$placeholder.find('.countdown-hours').html(dt.hours);
    this._$placeholder.find('.countdown-days').html(dt.days);
    this._$placeholder.find('.countdown-months').html(dt.months);
};

// <DOMNode> options.placeholder
// <Object> options.backgrounds
var Background = function(options) {
    this._backgrounds = options.backgrounds;
    this._$placeholder = $(options.placeholder);
    this._defaultBlur = options.defaultBlur || 0;
    this._switch(options.id ? this._backgrounds[options.id] : this._pickRandom(this._backgrounds));
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
        }, 1500, function() {
            $(this).trigger('switched', [bg]);
        }.bind(this));
    }.bind(this)).attr('src', bg.url);
};

$(document).ready(function() {
    $.ajax('config.json').then(function(cfg) {
        $.ajax('backgrounds.json').then(function(resp) {
            var background = new Background({
                placeholder: $('.background-container')[0],
                backgrounds: resp.backgrounds,
                id: getCookie('firstrun') ? false : resp.firstRunBackground
            });

            $(background).on('switched', function(e, data) {
                setTimeout(function() {
                    $('.copyright-container').css('opacity', 0);
                    $('.copyright-container').html(Handlebars.compile($('#copyright-template').html())({
                        title: data.title,
                        by: data.by
                    }));
                    $('.copyright-container').animate({
                        opacity: 1
                    }, cfg.copyrightAnimationDuration)
                }, cfg.copyrightTimeout);
            });

            setCookie('firstrun', true);
        }).fail(function() {
            console.error(arguments)
        });

        $.ajax(cfg.timeUrl).then(function(response) {
            new Countdown({
                placeholder: $('.countdown-container')[0],
                currentTime: new Date(response / 1),
                template: $('#countdown-template').html()
            });
        });
    });
});