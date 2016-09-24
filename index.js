skygear.config({
    'endPoint': 'https://rr.staging.skygeario.com/',
    'apiKey': 'd0cfb97ee70548ddb1420d020c592dfb'
});

var oppo = null;
var youNext = false;
var stbtn = document.getElementById('st');
function toggle() {
    document.getElementById('user').className = "hidden";
    document.getElementById('find').className = "";
    document.getElementById('game').className = "hidden";
    document.getElementById('myid').innerHTML = skygear.currentUser.id;
    skygear.on(skygear.currentUser.id, function (data) {
        if (data.invite) {
            oppo = data.id;
            alert('game!');
            youNext = true;
            toggle2();
        } else if (data.test) {
            alert(data.id);
        } else if (data.shoot) {
            if (data.survived) {
                toggle3();
            } else {
                document.getElementById('sb').innerHTML = "The opponent died! You win!";
                alert("The opponent died! You win!");
            }
        }
    });
    // var User = skygear.Record.extend('user');
    // var query = new skygear.Query(User);
    // skygear.publicDB.query(query).then(function (records) {
    //     var findElem = document.getElementById('find');
    //     for (var i = 0; i < records.length; i++) {
    //         findElem.innerHTML += "<div>" + records[i]._id + "</div>"
    //     }
    // }, function (error) {
    //     alert(error);
    //     console.log(error);
    // })
}

function toggle2() {
    document.getElementById('find').className = "hidden";
    document.getElementById('game').className = "";
    if (youNext) {
        document.getElementById('sb').innerHTML = 'The gun is pointing at you!';
    } else {
        document.getElementById('sb').innerHTML = 'The gun is pointing at the enemy!';
    }
}

function toggle3() {
    if (youNext) {
        document.getElementById('sb').innerHTML = 'The gun is pointing at you!';
        youNext = false;
        stbtn.disabled = false;
    } else {
        document.getElementById('sb').innerHTML = 'The gun is pointing at the enemy!';
        youNext = true;
        stbtn.disabled = true;
    }
}

var nameElem = document.getElementById('name');
var passElem = document.getElementById('password');
document.getElementById('signup').addEventListener('click', function (evt) {
    if (nameElem.value && passElem.value) {
        skygear.signupWithUsername(nameElem.value, passElem.value).then(function () {
            alert('signup success!');
            toggle();
        }, function (err) {
            alert(err);
            console.log(err);
        });
    } else {
        alert("fucking empty!")
    }
});
document.getElementById('login').addEventListener('click', function (evt) {
    if (nameElem.value && passElem.value) {
        skygear.loginWithUsername(nameElem.value, passElem.value).then(function () {
            alert('login success!');
            toggle();
        }, function (err) {
            alert(err);
            console.log(err);
        })
    } else {
        alert("fucking empty!")
    }
});

var User = skygear.Record.extend('user');
var oppoElem = document.getElementById('oppo');
document.getElementById('kill').addEventListener('click', function (evt) {
    if (oppoElem.value) {
        console.log('finding');
        var query = new skygear.Query(User);
        query.equalTo('_id', oppoElem.value);
        skygear.publicDB.query(query).then(function (records) {
            if (records.length > 0) {
                oppo = oppoElem.value;
                skygear.pubsub.publish(oppo, { invite: true, id: skygear.currentUser.id });
                stbtn.disabled = true;
                toggle2();
            } else {
                alert('This guy does not exist');
            }
        }, function (error) {
            console.log(error);
            alert(error);
        })
    } else {
        alert("Give me a f*cking username!");
    }
});

document.getElementById('sb').innerHTML = 'The gun is pointing at you!';
stbtn.addEventListener('click', function (evt) {
    console.log("click: " + youNext)
    if (Math.random() > 0.5) {
        // you die!
        skygear.pubsub.publish(oppo, { shoot: true, survived: false, id: skygear.currentUser.id });
        document.getElementById('sb').innerHTML = 'You died! You idiot!';
    } else {
        // you survived!
        skygear.pubsub.publish(oppo, { shoot: true, survived: true, id: skygear.currentUser.id });
        toggle3();
    }
});