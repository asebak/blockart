"use strict";

var UserProfileItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.name = obj.name;
        this.avatar = obj.avatar;
	} else {
		this.name = "";
        this.avatar = "";
	}
};

UserProfileItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var UserProfile = function () {
    LocalContractStorage.defineMapProperty(this, "userrepo", {
        parse: function (text) {
            return new UserProfileItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

UserProfile.prototype = {
    init: function () {
    },

    save: function (name, avatar) {

        var from = Blockchain.transaction.from;
        var profile = this.userrepo.get(from);
     
        profile = new UserProfileItem();
        profile.name = name;
        profile.avatar = avatar;

        this.userrepo.put(from, profile);
        
    },

    get: function (key) {
        key = key.trim();
        if ( key === "" ) {
            throw new Error("empty key")
        }
        return this.userrepo.get(key);
    },

    getall: function() {
        //todo needs to be implemented
    }
};
module.exports = UserProfile;