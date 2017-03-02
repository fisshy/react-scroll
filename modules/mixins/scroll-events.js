
var Events = {
	registered : {},
	scrollEvent : {
		register: function(evtName, callback) {
			Events.registered[evtName] = callback;
		},
		remove: function(evtName) {
			delete Events.registered[evtName];
		}
	}
};

module.exports = Events;
