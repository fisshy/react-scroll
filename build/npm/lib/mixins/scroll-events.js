
var Events = {
	registered : {},
	scrollEvent : {
		register: function(evtName, callback) {
			Events.registered[evtName] = callback;
		},
		remove: function(evtName) {
			Events.registered[evtName] = null;
		}
	}
};

module.exports = Events;