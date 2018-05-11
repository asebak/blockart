"use strict";

var ArtItem = function(text) {
	if (text) {
        var obj = JSON.parse(text);
		this.art = obj.art;
	} else {
        this.art = {};
	}
};

ArtItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var Artwork = function () {
    LocalContractStorage.defineMapProperty(this, "art", {
        parse: function (text) {
            return new ArtItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });

    LocalContractStorage.defineMapProperty(this, "ids", {
        parse: function (text) {
            return text;
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "count", null)
};

Artwork.prototype = {
    init: function () {
        this.count = 0;
    },

    get: function (key) {
        key = key.trim();
        if ( key === "" ) {
            throw new Error("empty key")
        }
        return this.art.get(key);
    },

    getAll: function() {
        var arts = [];
        for (var i = 0; i <=  this.count; i++) {
            var id = this.ids.get(i);
            var item = this.art.get(id);
            //if(item){
            arts.push(item);
            //}
          }
          return arts;
          //return this.count;
    },

    submit: function(title, pic) {
        var itemId = Blockchain.transaction.hash;
        var userId = Blockchain.transaction.from;
             
        var item = new ArtItem();

        item.art = {
            userId: userId,
            title: title,
            pic: pic,
            itemId: itemId
        };
        
        this.art.put(itemId, item);
        
        //keep track of ids
        this.ids.put(this.count, itemId);
        //increment
        var count = new BigNumber(this.count).plus(1);
        this.count = count;
    }
};
module.exports = Artwork;