window.addEventListener("load", function() {
    events();
})

////////////////////////////////////////////////////////////

const sectionalert = document.querySelector('.section-alert');
const sectionmodal = document.querySelector('.section-modal');
const sectionpopup = document.querySelector('.section-popup');
const sectionfree = document.querySelector('.section-free-action');
const freeactionbtn = document.querySelector('.freeactionbtn');
const popup = document.querySelector('.popup');

const showpopupf = function(){
    popup.classList.remove('hidden');
}

freeactionbtn.addEventListener('click', function(){
    sectionalert.classList.toggle('hidden');
    sectionmodal.classList.toggle('hidden');
    sectionpopup.classList.toggle('hidden');
    sectionfree.classList.toggle('secfree');
});
////////////////////////////////////////////////////////////

function events() {

    $(".section-alert button").click(function() {
        getNotifications(function(response) {
            const notifications = response.notifications;
            const alert_notification = notifications.find((notification) => notification.type == "Alert");

            new Notification({
                type: "Alert",
                title: alert_notification.title,
                content: alert_notification.content,
                button_text: alert_notification.button_text
            }).show();
        })
    })

    $(".section-popup button").click(function() {  // when click popup show button
        getNotifications(function(response) {
            const notifications = response.notifications;
            const popup_notification = notifications.find((notification) => notification.type == "Popup");

            new Notification({
                type: "Popup",
                title: popup_notification.title,
                content: popup_notification.content,
                button_text: popup_notification.button_text
            }).show();
        })
    })

    $(".section-modal button.button-modal-1").click(function() {
        new Notification({
            type: "Modal",
            selector: ".modal-1"
        }).show();
    })

    $(".section-modal button.button-modal-2").click(function() {
        new Notification({
            type: "Modal",
            selector: ".modal-2"
        }).show();
    })
}

function fetch(config) {
    $.ajax({
        dataType: config.dataType ? config.dataType : "json",
        url: config.url,
        success: function(response) {
            config.callback(response);
        }
    });
}

function getNotifications(callback) {
    fetch({
        url: "/assets/json/notification.json",
        callback: function(response) {
            callback(response);
        }
    })
}

function Notification(config) {
    let _this = this;
    let _proto = Notification.prototype;

    this.types = {
        Alert,
        Modal,
        Popup
    }

    _proto.show = () => {
        new _this.types[config.type]().show(config)
    }
}

function Alert() {
    let _this = this;
    let _proto = Alert.prototype;

    _proto.set = (config) => {
        _proto.reset();

        const element = $(".alert");

        element.find(".content > .header > h2").html(config.title);
        element.find(".content > .body").html(config.content);
        element.find(".content > .footer > button").html(config.button_text);

        element.addClass("open");
    }

    _proto.reset = function() {
        const element = $(".alert");

        element.find(".content > .header > h2").html("");
        element.find(".content > .body").html("");
        element.find(".content > .footer > button").html("");
    }

    _proto.show = (config) => {
        _this.set(config);

        $(".alert").addClass("open");

        events();
    }

    _proto.hide = () => {
        _proto.reset();
        
        $(".alert").removeClass("open");
    }

    function events() {
        $(".alert .close").unbind("click").click(function() {
            _this.hide();  
        })

        $(".alert").unbind("click").click("click", function(e) {
            const is_wrapper = e.target.classList.contains("alert");

            if(is_wrapper) {
                _this.hide();
            }
        })
    }
}

function Popup() {
    let _this = this;
    let _proto = Popup.prototype;

    _proto.set = (config) => {
        _proto.reset();

        const element = $(".popup");

        element.find(".content > .header > h2").html(config.title);
        element.find(".content > .body").html(config.content);
        element.find(".content > .footer > button").html(config.button_text);

        element.addClass("open");
    }

    _proto.reset = function() {
        const element = $(".popup");

        element.find(".content > .header > h2").html("");
        element.find(".content > .body").html("");
        element.find(".content > .footer > button").html("");
    }

    _proto.show = (config) => {
        _this.set(config);

        $(".popup").addClass("open");

        events();
    }

    _proto.hide = () => {
        _proto.reset();
        
        $(".popup").removeClass("open");
    }

    function events() {
        $(".popup .close").unbind("click").click(function() {
            _this.hide();  
        })

        $(".popup").unbind("click").click("click", function(e) {
            const is_wrapper = e.target.classList.contains("popup");

            if(is_wrapper) {
                _this.hide();
            }
        })
    }
}

function Modal() {
    let _this = this;
    let _proto = Modal.prototype;

    _proto.show = (config) => {
        $(config.selector).addClass("open");

        events(config.selector);
    }

    _proto.hide = (e) => {
        $(e.target).parents(".modal").removeClass("open");
    }

    function events(modal) {
        $(modal).find(".close").unbind("click").click("click", function(e) {
            _proto.hide(e);
        })
    }
}

