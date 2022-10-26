(()=>{var e={599:e=>{"use strict";const{AbortController:t,AbortSignal:n}="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0;e.exports=t,e.exports.AbortSignal=n,e.exports.default=t},187:e=>{"use strict";var t,n="object"==typeof Reflect?Reflect:null,r=n&&"function"==typeof n.apply?n.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};t=n&&"function"==typeof n.ownKeys?n.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var i=Number.isNaN||function(e){return e!=e};function o(){o.init.call(this)}e.exports=o,e.exports.once=function(e,t){return new Promise((function(n,r){function i(n){e.removeListener(t,o),r(n)}function o(){"function"==typeof e.removeListener&&e.removeListener("error",i),n([].slice.call(arguments))}v(e,t,o,{once:!0}),"error"!==t&&function(e,t,n){"function"==typeof e.on&&v(e,"error",t,{once:!0})}(e,i)}))},o.EventEmitter=o,o.prototype._events=void 0,o.prototype._eventsCount=0,o.prototype._maxListeners=void 0;var a=10;function s(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function u(e){return void 0===e._maxListeners?o.defaultMaxListeners:e._maxListeners}function c(e,t,n,r){var i,o,a,c;if(s(n),void 0===(o=e._events)?(o=e._events=Object.create(null),e._eventsCount=0):(void 0!==o.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),o=e._events),a=o[t]),void 0===a)a=o[t]=n,++e._eventsCount;else if("function"==typeof a?a=o[t]=r?[n,a]:[a,n]:r?a.unshift(n):a.push(n),(i=u(e))>0&&a.length>i&&!a.warned){a.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+a.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=e,l.type=t,l.count=a.length,c=l,console&&console.warn&&console.warn(c)}return e}function l(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function d(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},i=l.bind(r);return i.listener=n,r.wrapFn=i,i}function f(e,t,n){var r=e._events;if(void 0===r)return[];var i=r[t];return void 0===i?[]:"function"==typeof i?n?[i.listener||i]:[i]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(i):p(i,i.length)}function h(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function p(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}function v(e,t,n,r){if("function"==typeof e.on)r.once?e.once(t,n):e.on(t,n);else{if("function"!=typeof e.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e);e.addEventListener(t,(function i(o){r.once&&e.removeEventListener(t,i),n(o)}))}}Object.defineProperty(o,"defaultMaxListeners",{enumerable:!0,get:function(){return a},set:function(e){if("number"!=typeof e||e<0||i(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");a=e}}),o.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},o.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||i(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},o.prototype.getMaxListeners=function(){return u(this)},o.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var i="error"===e,o=this._events;if(void 0!==o)i=i&&void 0===o.error;else if(!i)return!1;if(i){var a;if(t.length>0&&(a=t[0]),a instanceof Error)throw a;var s=new Error("Unhandled error."+(a?" ("+a.message+")":""));throw s.context=a,s}var u=o[e];if(void 0===u)return!1;if("function"==typeof u)r(u,this,t);else{var c=u.length,l=p(u,c);for(n=0;n<c;++n)r(l[n],this,t)}return!0},o.prototype.addListener=function(e,t){return c(this,e,t,!1)},o.prototype.on=o.prototype.addListener,o.prototype.prependListener=function(e,t){return c(this,e,t,!0)},o.prototype.once=function(e,t){return s(t),this.on(e,d(this,e,t)),this},o.prototype.prependOnceListener=function(e,t){return s(t),this.prependListener(e,d(this,e,t)),this},o.prototype.removeListener=function(e,t){var n,r,i,o,a;if(s(t),void 0===(r=this._events))return this;if(void 0===(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,o=n.length-1;o>=0;o--)if(n[o]===t||n[o].listener===t){a=n[o].listener,i=o;break}if(i<0)return this;0===i?n.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(n,i),1===n.length&&(r[e]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",e,a||t)}return this},o.prototype.off=o.prototype.removeListener,o.prototype.removeAllListeners=function(e){var t,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var i,o=Object.keys(n);for(r=0;r<o.length;++r)"removeListener"!==(i=o[r])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},o.prototype.listeners=function(e){return f(this,e,!0)},o.prototype.rawListeners=function(e){return f(this,e,!1)},o.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):h.call(e,t)},o.prototype.listenerCount=h,o.prototype.eventNames=function(){return this._eventsCount>0?t(this._events):[]}},300:(e,t)=>{"use strict";var n=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==n)return n;throw new Error("unable to locate global object")}();e.exports=t=n.fetch,n.fetch&&(t.default=n.fetch.bind(n)),t.Headers=n.Headers,t.Request=n.Request,t.Response=n.Response},395:(e,t)=>{"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),t.BandwidthMode=void 0,(n=t.BandwidthMode||(t.BandwidthMode={})).big="big",n.small="small"},898:(e,t)=>{"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),t.Speed=void 0,(n=t.Speed||(t.Speed={})).good="GOOD",n.ok="OK",n.bad="BAD",n.nothing="NOTHING"},623:function(e,t,n){"use strict";var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},r.apply(this,arguments)},i=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{u(r.next(e))}catch(e){o(e)}}function s(e){try{u(r.throw(e))}catch(e){o(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}u((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!((i=(i=a.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},a=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var r,i=0,o=t.length;i<o;i++)!r&&i in t||(r||(r=Array.prototype.slice.call(t,0,i)),r[i]=t[i]);return e.concat(r||Array.prototype.slice.call(t))};Object.defineProperty(t,"__esModule",{value:!0}),t.CCT=void 0;var s=n(429),u=n(300),c=n(898),l=n(940),d=n(944),f=n(395),h="CCT_DATA",p=function(){function e(){this.storage=[],this.runningLatency=!1,this.runningBandwidth=!1}return e.prototype.fetchDatacenterInformationRequest=function(e){return i(this,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return t.trys.push([0,2,,3]),[4,(0,u.default)(e).then((function(e){return e.json()}))];case 1:return[2,t.sent()];case 2:return t.sent(),[2,[]];case 3:return[2]}}))}))},e.prototype.fetchDatacenterInformation=function(e){return i(this,void 0,void 0,(function(){var t;return o(this,(function(n){switch(n.label){case 0:return t=this,[4,this.fetchDatacenterInformationRequest(e)];case 1:return t.allDatacenters=n.sent(),this.datacenters=this.allDatacenters,this.storage=this.allDatacenters.map((function(e){return{id:e.id,latencies:[],bandwidths:[],shouldSave:!1}})),this.clean(),this.readLocalStorage(),this.lce=new l.LCE(this.datacenters),[2]}}))}))},e.prototype.setFilters=function(e){this.datacenters=e?this.allDatacenters.filter((function(t){return Object.keys(e).every((function(n){return e[n].includes(t[n])}))})):this.allDatacenters,this.lce=new l.LCE(this.datacenters)},e.prototype.stopMeasurements=function(){this.runningLatency=!1,this.runningBandwidth=!1,this.lce.terminate()},e.prototype.startLatencyChecks=function(e){var t=e.iterations,n=e.saveToLocalStorage,r=void 0!==n&&n,a=e.save,s=void 0===a||a;return i(this,void 0,void 0,(function(){return o(this,(function(e){switch(e.label){case 0:return this.runningLatency=!0,[4,this.startMeasurementForLatency({iterations:t,saveToLocalStorage:r,save:s})];case 1:return e.sent(),this.runningLatency=!1,[2]}}))}))},e.prototype.startMeasurementForLatency=function(e){var t,n=e.iterations,r=e.saveToLocalStorage,a=void 0!==r&&r,s=e.save,u=void 0!==s&&s;return i(this,void 0,void 0,(function(){var e,r,i,s,c;return o(this,(function(l){switch(l.label){case 0:e=0,l.label=1;case 1:if(!(e<n))return[3,6];r=function(e){var n,r,s,c;return o(this,(function(o){switch(o.label){case 0:return n=i.datacenters[e],[4,i.lce.getLatencyForId(n.id)];case 1:return r=o.sent(),i.runningLatency?(r&&r.latency&&(s=i.datacenters.findIndex((function(e){return e.id===n.id})),null===(t=i.datacenters[s].latencies)||void 0===t||t.push(r.latency),c=d.Util.getAverageLatency(i.datacenters[s].latencies),i.datacenters[s].averageLatency=c,i.datacenters[s].latencyJudgement=i.judgeLatency(c),u&&i.addDataToStorage(n.id,r.latency),a&&i.setLocalStorage()),[2]):[2,{value:void 0}]}}))},i=this,s=0,l.label=2;case 2:return s<this.datacenters.length?[5,r(s)]:[3,5];case 3:if("object"==typeof(c=l.sent()))return[2,c.value];l.label=4;case 4:return s++,[3,2];case 5:return e++,[3,1];case 6:return[2]}}))}))},e.prototype.startBandwidthChecks=function(e){var t=e.datacenter,n=e.iterations,r=e.bandwidthMode,a=e.saveToLocalStorage,s=void 0!==a&&a,u=e.save,c=void 0===u||u;return i(this,void 0,void 0,(function(){var e,i=this;return o(this,(function(o){switch(o.label){case 0:return this.runningBandwidth=!0,Array.isArray(t)?(e=[],t.forEach((function(t){e.push(i.startMeasurementForBandwidth(t,n,r,s,c))})),[4,Promise.all(e)]):[3,2];case 1:return o.sent(),[3,4];case 2:return[4,this.startMeasurementForBandwidth(t,n,r,s,c)];case 3:o.sent(),o.label=4;case 4:return this.runningBandwidth=!1,[2]}}))}))},e.prototype.startMeasurementForBandwidth=function(e,t,n,r,a){var s;return void 0===n&&(n=f.BandwidthMode.big),i(this,void 0,void 0,(function(){var i,u,c,l;return o(this,(function(o){switch(o.label){case 0:i=0,o.label=1;case 1:return i<t?[4,this.lce.getBandwidthForId(e.id,{bandwidthMode:n})]:[3,4];case 2:if(u=o.sent(),!this.runningBandwidth)return[2];u&&u.bandwidth&&(c=this.datacenters.findIndex((function(t){return t.id===e.id})),null===(s=this.datacenters[c].bandwidths)||void 0===s||s.push(u.bandwidth),l=d.Util.getAverageBandwidth(this.datacenters[c].bandwidths),this.datacenters[c].averageBandwidth=l,this.datacenters[c].bandwidthJudgement=this.judgeBandwidth(l),a&&this.addDataToStorage(e.id,u.bandwidth),r&&this.setLocalStorage()),o.label=3;case 3:return i++,[3,1];case 4:return[2]}}))}))},e.prototype.judgeLatency=function(e){return e<170?c.Speed.good:e>=170&&e<280?c.Speed.ok:c.Speed.bad},e.prototype.judgeBandwidth=function(e){return e.megaBitsPerSecond>1?c.Speed.good:e.megaBitsPerSecond<=1&&e.megaBitsPerSecond>.3?c.Speed.ok:c.Speed.bad},e.prototype.getCurrentDatacentersSorted=function(){return d.Util.sortDatacenters(this.datacenters),this.datacenters},e.prototype.getAddress=function(){return i(this,void 0,void 0,(function(){var e,t=this;return o(this,(function(n){return e={address:"",latitude:0,longitude:0},[2,new Promise((function(n){navigator&&(null===navigator||void 0===navigator?void 0:navigator.geolocation)?navigator.geolocation.getCurrentPosition((function(r){return i(t,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return e.latitude=r.coords.latitude,e.longitude=r.coords.longitude,[4,(new google.maps.Geocoder).geocode({location:new google.maps.LatLng(e.latitude,e.longitude)},(function(t,r){"OK"===r?(e.address=t[0].formatted_address,n(e)):(e.address="",e.latitude=0,e.longitude=0,n(e))}))];case 1:return t.sent(),[2]}}))}))}),(function(){n(e)})):n(e)}))]}))}))},e.prototype.storeRequest=function(e){return i(this,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return[4,(0,u.default)("https://cct.demo-education.cloud.sap/measurement",{method:"post",body:e,headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()}))];case 1:return[2,t.sent()]}}))}))},e.prototype.store=function(e){return void 0===e&&(e={address:"Dietmar-Hopp-Allee 16, 69190 Walldorf, Germany",latitude:49.2933756,longitude:8.6421212}),i(this,void 0,void 0,(function(){var t,n;return o(this,(function(r){switch(r.label){case 0:t=[],this.storage=this.storage.map((function(e){var n;return e.shouldSave?(t.push({id:e.id,latency:"".concat(null===(n=d.Util.getAverageLatency(e.latencies))||void 0===n?void 0:n.toFixed(2)),averageBandwidth:d.Util.getAverageBandwidth(e.bandwidths).megaBitsPerSecond.toFixed(2)}),{id:e.id,latencies:[],bandwidths:[],shouldSave:!1}):e})),n=JSON.stringify({uid:(0,s.v4)(),address:e.address,latitude:e.latitude,longitude:e.longitude,data:t},null,4),r.label=1;case 1:return r.trys.push([1,3,,4]),[4,this.storeRequest(n)];case 2:return[2,"OK"===r.sent().status];case 3:return r.sent(),[2,!1];case 4:return[2]}}))}))},e.prototype.addDataToStorage=function(e,t){this.storage=this.storage.map((function(n){if(n.id===e){var r="number"==typeof t,i=r?a(a([],n.latencies,!0),[t],!1):n.latencies,o=r?n.bandwidths:a(a([],n.bandwidths,!0),[t],!1);return{id:n.id,latencies:i,bandwidths:o,shouldSave:i.length>=16}}return n}))},e.prototype.setLocalStorage=function(){window.localStorage.removeItem(h);var e=this.allDatacenters.map((function(e){return{id:e.id,latencies:e.latencies,averageLatency:e.averageLatency,latencyJudgement:e.latencyJudgement,bandwidths:e.bandwidths,averageBandwidth:e.averageBandwidth,bandwidthJudgement:e.bandwidthJudgement}}));window.localStorage.setItem(h,JSON.stringify(e))},e.prototype.readLocalStorage=function(){var e=window.localStorage.getItem(h);if(e){var t=JSON.parse(e);this.allDatacenters=this.allDatacenters.map((function(e){var n=t.find((function(t){return t.id===e.id}));return n?r(r({},e),{averageLatency:n.averageLatency,latencyJudgement:n.latencyJudgement,averageBandwidth:n.averageBandwidth,bandwidthJudgement:n.bandwidthJudgement,latencies:n.latencies,bandwidths:n.bandwidths}):e})),window.localStorage.removeItem(h)}},e.prototype.subscribe=function(e,t){this.lce&&this.lce.on(e,t)},e.prototype.unsubscribe=function(e,t){this.lce&&this.lce.off(e,t)},e.prototype.clean=function(){this.datacenters.forEach((function(e){e.position=0,e.averageLatency=0,e.averageBandwidth={bitsPerSecond:0,kiloBitsPerSecond:0,megaBitsPerSecond:0},e.latencies=[],e.bandwidths=[]}))},e}();t.CCT=p},940:function(e,t,n){"use strict";var r,i=this&&this.__extends||(r=function(e,t){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},r(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),o=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function a(e){try{u(r.next(e))}catch(e){o(e)}}function s(e){try{u(r.throw(e))}catch(e){o(e)}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}u((r=r.apply(e,t||[])).next())}))},a=this&&this.__generator||function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!((i=(i=a.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.LCE=void 0;var s=n(300),u=n(187),c=n(395),l=n(599),d=function(e){function t(t){var n=e.call(this)||this;return n.datacenters=t,n.cancelableLatencyRequests=[],n.cancelableBandwidthRequests=[],n.terminateAllCalls=!1,n}return i(t,e),t.prototype.runLatencyCheckForAll=function(){return o(this,void 0,void 0,(function(){var e,t,n,r=this;return a(this,(function(i){switch(i.label){case 0:return e=[],this.datacenters.forEach((function(t){e.push(r.getLatencyFor(t))})),[4,Promise.all(e)];case 1:return t=i.sent(),(n=t.filter((function(e){return null!==e}))).sort(this.compare),this.cancelableLatencyRequests=[],[2,n]}}))}))},t.prototype.runBandwidthCheckForAll=function(){return o(this,void 0,void 0,(function(){var e,t,n,r,i;return a(this,(function(o){switch(o.label){case 0:e=[],t=0,n=this.datacenters,o.label=1;case 1:return t<n.length?(r=n[t],this.terminateAllCalls?[3,4]:[4,this.getBandwidthFor(r)]):[3,4];case 2:(i=o.sent())&&e.push(i),o.label=3;case 3:return t++,[3,1];case 4:return this.cancelableBandwidthRequests=[],[2,e]}}))}))},t.prototype.getBandwidthForId=function(e,t){var n=this.datacenters.find((function(t){return t.id===e}));return n?this.getBandwidthFor(n,t):null},t.prototype.getLatencyForId=function(e){var t=this.datacenters.find((function(t){return t.id===e}));return t?this.getLatencyFor(t):null},t.prototype.getLatencyFor=function(e){return o(this,void 0,void 0,(function(){var t,n,r;return a(this,(function(i){switch(i.label){case 0:return t=Date.now(),[4,this.latencyFetch("https://".concat(e.ip,"/drone/index.html"))];case 1:return n=i.sent(),r=Date.now(),n?(this.emit("latency"),[2,{id:e.id,latency:r-t,cloud:e.cloud,name:e.name,town:e.town,country:e.country,latitude:e.latitude,longitude:e.longitude,ip:e.ip,timestamp:Date.now()}]):[2,null]}}))}))},t.prototype.getBandwidthFor=function(e,n){return void 0===n&&(n={bandwidthMode:c.BandwidthMode.big}),o(this,void 0,void 0,(function(){var r,i,o,s,u,c;return a(this,(function(a){switch(a.label){case 0:return r=Date.now(),[4,this.bandwidthFetch("https://".concat(e.ip,"/drone/").concat(n.bandwidthMode))];case 1:if(null===(i=a.sent()))return[3,6];this.emit("bandwidth"),o=Date.now(),s=void 0,a.label=2;case 2:return a.trys.push([2,4,,5]),[4,i.text()];case 3:return s=a.sent(),[3,5];case 4:return u=a.sent(),console.log(u),[2,null];case 5:return c=t.calcBandwidth(s.length,o-r),[2,{id:e.id,bandwidth:c,cloud:e.cloud,name:e.name,town:e.town,country:e.country,latitude:e.latitude,longitude:e.longitude,ip:e.ip}];case 6:return[2,null]}}))}))},t.prototype.bandwidthFetch=function(e){var t=new l.default,n=t.signal;return this.cancelableBandwidthRequests.push(t),this.abortableFetch(e,n)},t.prototype.latencyFetch=function(e){var t=new l.default,n=t.signal;return this.cancelableLatencyRequests.push(t),this.abortableFetch(e,n)},t.prototype.abortableFetch=function(e,t){return o(this,void 0,void 0,(function(){var n;return a(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,(0,s.default)(e,{signal:t})];case 1:return[2,r.sent()];case 2:return n=r.sent(),console.log(n),[2,null];case 3:return[2]}}))}))},t.prototype.compare=function(e,t){return e.latency<t.latency?-1:e.latency>t.latency?1:0},t.prototype.terminate=function(){this.terminateAllCalls=!0,this.cancelableLatencyRequests.forEach((function(e){e.abort()})),this.cancelableBandwidthRequests.forEach((function(e){e.abort()})),this.cancelableLatencyRequests=[],this.cancelableBandwidthRequests=[],this.terminateAllCalls=!1},t.calcBandwidth=function(e,t){var n=8*e/(t/1e3),r=n/1e3;return{bitsPerSecond:n,kiloBitsPerSecond:r,megaBitsPerSecond:r/1e3}},t}(u.EventEmitter);t.LCE=d},944:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Util=void 0;var n=function(){function e(){}return e.getAverageLatency=function(e){return e?e.reduce((function(e,t){return e+t}),0)/e.length:-1},e.getAverageBandwidth=function(e){if(e&&e.length){var t=e.reduce((function(e,t){return{bitsPerSecond:e.bitsPerSecond+t.bitsPerSecond,kiloBitsPerSecond:e.kiloBitsPerSecond+t.kiloBitsPerSecond,megaBitsPerSecond:e.megaBitsPerSecond+t.megaBitsPerSecond}}));return{bitsPerSecond:t.bitsPerSecond/e.length,kiloBitsPerSecond:t.kiloBitsPerSecond/e.length,megaBitsPerSecond:t.megaBitsPerSecond/e.length}}return{bitsPerSecond:-1,kiloBitsPerSecond:-1,megaBitsPerSecond:-1}},e.sortDatacenters=function(e){return e.sort((function(e,t){return e.averageLatency-t.averageLatency})),e.forEach((function(e,t){e.position=t+1})),e},e.getTop3=function(t){return e.sortDatacenters(t).slice(0,3)},e.sleep=function(e){return new Promise((function(t){return setTimeout(t,e)}))},e}();t.Util=n},429:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"NIL",{enumerable:!0,get:function(){return s.default}}),Object.defineProperty(t,"parse",{enumerable:!0,get:function(){return d.default}}),Object.defineProperty(t,"stringify",{enumerable:!0,get:function(){return l.default}}),Object.defineProperty(t,"v1",{enumerable:!0,get:function(){return r.default}}),Object.defineProperty(t,"v3",{enumerable:!0,get:function(){return i.default}}),Object.defineProperty(t,"v4",{enumerable:!0,get:function(){return o.default}}),Object.defineProperty(t,"v5",{enumerable:!0,get:function(){return a.default}}),Object.defineProperty(t,"validate",{enumerable:!0,get:function(){return c.default}}),Object.defineProperty(t,"version",{enumerable:!0,get:function(){return u.default}});var r=f(n(990)),i=f(n(237)),o=f(n(355)),a=f(n(764)),s=f(n(314)),u=f(n(464)),c=f(n(435)),l=f(n(8)),d=f(n(222));function f(e){return e&&e.__esModule?e:{default:e}}},163:(e,t)=>{"use strict";function n(e){return 14+(e+64>>>9<<4)+1}function r(e,t){const n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function i(e,t,n,i,o,a){return r((s=r(r(t,e),r(i,a)))<<(u=o)|s>>>32-u,n);var s,u}function o(e,t,n,r,o,a,s){return i(t&n|~t&r,e,t,o,a,s)}function a(e,t,n,r,o,a,s){return i(t&r|n&~r,e,t,o,a,s)}function s(e,t,n,r,o,a,s){return i(t^n^r,e,t,o,a,s)}function u(e,t,n,r,o,a,s){return i(n^(t|~r),e,t,o,a,s)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=function(e){if("string"==typeof e){const t=unescape(encodeURIComponent(e));e=new Uint8Array(t.length);for(let n=0;n<t.length;++n)e[n]=t.charCodeAt(n)}return function(e){const t=[],n=32*e.length,r="0123456789abcdef";for(let i=0;i<n;i+=8){const n=e[i>>5]>>>i%32&255,o=parseInt(r.charAt(n>>>4&15)+r.charAt(15&n),16);t.push(o)}return t}(function(e,t){e[t>>5]|=128<<t%32,e[n(t)-1]=t;let i=1732584193,c=-271733879,l=-1732584194,d=271733878;for(let t=0;t<e.length;t+=16){const n=i,f=c,h=l,p=d;i=o(i,c,l,d,e[t],7,-680876936),d=o(d,i,c,l,e[t+1],12,-389564586),l=o(l,d,i,c,e[t+2],17,606105819),c=o(c,l,d,i,e[t+3],22,-1044525330),i=o(i,c,l,d,e[t+4],7,-176418897),d=o(d,i,c,l,e[t+5],12,1200080426),l=o(l,d,i,c,e[t+6],17,-1473231341),c=o(c,l,d,i,e[t+7],22,-45705983),i=o(i,c,l,d,e[t+8],7,1770035416),d=o(d,i,c,l,e[t+9],12,-1958414417),l=o(l,d,i,c,e[t+10],17,-42063),c=o(c,l,d,i,e[t+11],22,-1990404162),i=o(i,c,l,d,e[t+12],7,1804603682),d=o(d,i,c,l,e[t+13],12,-40341101),l=o(l,d,i,c,e[t+14],17,-1502002290),c=o(c,l,d,i,e[t+15],22,1236535329),i=a(i,c,l,d,e[t+1],5,-165796510),d=a(d,i,c,l,e[t+6],9,-1069501632),l=a(l,d,i,c,e[t+11],14,643717713),c=a(c,l,d,i,e[t],20,-373897302),i=a(i,c,l,d,e[t+5],5,-701558691),d=a(d,i,c,l,e[t+10],9,38016083),l=a(l,d,i,c,e[t+15],14,-660478335),c=a(c,l,d,i,e[t+4],20,-405537848),i=a(i,c,l,d,e[t+9],5,568446438),d=a(d,i,c,l,e[t+14],9,-1019803690),l=a(l,d,i,c,e[t+3],14,-187363961),c=a(c,l,d,i,e[t+8],20,1163531501),i=a(i,c,l,d,e[t+13],5,-1444681467),d=a(d,i,c,l,e[t+2],9,-51403784),l=a(l,d,i,c,e[t+7],14,1735328473),c=a(c,l,d,i,e[t+12],20,-1926607734),i=s(i,c,l,d,e[t+5],4,-378558),d=s(d,i,c,l,e[t+8],11,-2022574463),l=s(l,d,i,c,e[t+11],16,1839030562),c=s(c,l,d,i,e[t+14],23,-35309556),i=s(i,c,l,d,e[t+1],4,-1530992060),d=s(d,i,c,l,e[t+4],11,1272893353),l=s(l,d,i,c,e[t+7],16,-155497632),c=s(c,l,d,i,e[t+10],23,-1094730640),i=s(i,c,l,d,e[t+13],4,681279174),d=s(d,i,c,l,e[t],11,-358537222),l=s(l,d,i,c,e[t+3],16,-722521979),c=s(c,l,d,i,e[t+6],23,76029189),i=s(i,c,l,d,e[t+9],4,-640364487),d=s(d,i,c,l,e[t+12],11,-421815835),l=s(l,d,i,c,e[t+15],16,530742520),c=s(c,l,d,i,e[t+2],23,-995338651),i=u(i,c,l,d,e[t],6,-198630844),d=u(d,i,c,l,e[t+7],10,1126891415),l=u(l,d,i,c,e[t+14],15,-1416354905),c=u(c,l,d,i,e[t+5],21,-57434055),i=u(i,c,l,d,e[t+12],6,1700485571),d=u(d,i,c,l,e[t+3],10,-1894986606),l=u(l,d,i,c,e[t+10],15,-1051523),c=u(c,l,d,i,e[t+1],21,-2054922799),i=u(i,c,l,d,e[t+8],6,1873313359),d=u(d,i,c,l,e[t+15],10,-30611744),l=u(l,d,i,c,e[t+6],15,-1560198380),c=u(c,l,d,i,e[t+13],21,1309151649),i=u(i,c,l,d,e[t+4],6,-145523070),d=u(d,i,c,l,e[t+11],10,-1120210379),l=u(l,d,i,c,e[t+2],15,718787259),c=u(c,l,d,i,e[t+9],21,-343485551),i=r(i,n),c=r(c,f),l=r(l,h),d=r(d,p)}return[i,c,l,d]}(function(e){if(0===e.length)return[];const t=8*e.length,r=new Uint32Array(n(t));for(let n=0;n<t;n+=8)r[n>>5]|=(255&e[n/8])<<n%32;return r}(e),8*e.length))}},790:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};t.default=n},314:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,t.default="00000000-0000-0000-0000-000000000000"},222:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,i=(r=n(435))&&r.__esModule?r:{default:r};t.default=function(e){if(!(0,i.default)(e))throw TypeError("Invalid UUID");let t;const n=new Uint8Array(16);return n[0]=(t=parseInt(e.slice(0,8),16))>>>24,n[1]=t>>>16&255,n[2]=t>>>8&255,n[3]=255&t,n[4]=(t=parseInt(e.slice(9,13),16))>>>8,n[5]=255&t,n[6]=(t=parseInt(e.slice(14,18),16))>>>8,n[7]=255&t,n[8]=(t=parseInt(e.slice(19,23),16))>>>8,n[9]=255&t,n[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,n[11]=t/4294967296&255,n[12]=t>>>24&255,n[13]=t>>>16&255,n[14]=t>>>8&255,n[15]=255&t,n}},58:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,t.default=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i},319:(e,t)=>{"use strict";let n;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){if(!n&&(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!n))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(r)};const r=new Uint8Array(16)},757:(e,t)=>{"use strict";function n(e,t,n,r){switch(e){case 0:return t&n^~t&r;case 1:case 3:return t^n^r;case 2:return t&n^t&r^n&r}}function r(e,t){return e<<t|e>>>32-t}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=function(e){const t=[1518500249,1859775393,2400959708,3395469782],i=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){const t=unescape(encodeURIComponent(e));e=[];for(let n=0;n<t.length;++n)e.push(t.charCodeAt(n))}else Array.isArray(e)||(e=Array.prototype.slice.call(e));e.push(128);const o=e.length/4+2,a=Math.ceil(o/16),s=new Array(a);for(let t=0;t<a;++t){const n=new Uint32Array(16);for(let r=0;r<16;++r)n[r]=e[64*t+4*r]<<24|e[64*t+4*r+1]<<16|e[64*t+4*r+2]<<8|e[64*t+4*r+3];s[t]=n}s[a-1][14]=8*(e.length-1)/Math.pow(2,32),s[a-1][14]=Math.floor(s[a-1][14]),s[a-1][15]=8*(e.length-1)&4294967295;for(let e=0;e<a;++e){const o=new Uint32Array(80);for(let t=0;t<16;++t)o[t]=s[e][t];for(let e=16;e<80;++e)o[e]=r(o[e-3]^o[e-8]^o[e-14]^o[e-16],1);let a=i[0],u=i[1],c=i[2],l=i[3],d=i[4];for(let e=0;e<80;++e){const i=Math.floor(e/20),s=r(a,5)+n(i,u,c,l)+d+t[i]+o[e]>>>0;d=l,l=c,c=r(u,30)>>>0,u=a,a=s}i[0]=i[0]+a>>>0,i[1]=i[1]+u>>>0,i[2]=i[2]+c>>>0,i[3]=i[3]+l>>>0,i[4]=i[4]+d>>>0}return[i[0]>>24&255,i[0]>>16&255,i[0]>>8&255,255&i[0],i[1]>>24&255,i[1]>>16&255,i[1]>>8&255,255&i[1],i[2]>>24&255,i[2]>>16&255,i[2]>>8&255,255&i[2],i[3]>>24&255,i[3]>>16&255,i[3]>>8&255,255&i[3],i[4]>>24&255,i[4]>>16&255,i[4]>>8&255,255&i[4]]}},8:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,t.unsafeStringify=a;var r,i=(r=n(435))&&r.__esModule?r:{default:r};const o=[];for(let e=0;e<256;++e)o.push((e+256).toString(16).slice(1));function a(e,t=0){return(o[e[t+0]]+o[e[t+1]]+o[e[t+2]]+o[e[t+3]]+"-"+o[e[t+4]]+o[e[t+5]]+"-"+o[e[t+6]]+o[e[t+7]]+"-"+o[e[t+8]]+o[e[t+9]]+"-"+o[e[t+10]]+o[e[t+11]]+o[e[t+12]]+o[e[t+13]]+o[e[t+14]]+o[e[t+15]]).toLowerCase()}t.default=function(e,t=0){const n=a(e,t);if(!(0,i.default)(n))throw TypeError("Stringified UUID is invalid");return n}},990:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,i=(r=n(319))&&r.__esModule?r:{default:r},o=n(8);let a,s,u=0,c=0;t.default=function(e,t,n){let r=t&&n||0;const l=t||new Array(16);let d=(e=e||{}).node||a,f=void 0!==e.clockseq?e.clockseq:s;if(null==d||null==f){const t=e.random||(e.rng||i.default)();null==d&&(d=a=[1|t[0],t[1],t[2],t[3],t[4],t[5]]),null==f&&(f=s=16383&(t[6]<<8|t[7]))}let h=void 0!==e.msecs?e.msecs:Date.now(),p=void 0!==e.nsecs?e.nsecs:c+1;const v=h-u+(p-c)/1e4;if(v<0&&void 0===e.clockseq&&(f=f+1&16383),(v<0||h>u)&&void 0===e.nsecs&&(p=0),p>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");u=h,c=p,s=f,h+=122192928e5;const y=(1e4*(268435455&h)+p)%4294967296;l[r++]=y>>>24&255,l[r++]=y>>>16&255,l[r++]=y>>>8&255,l[r++]=255&y;const g=h/4294967296*1e4&268435455;l[r++]=g>>>8&255,l[r++]=255&g,l[r++]=g>>>24&15|16,l[r++]=g>>>16&255,l[r++]=f>>>8|128,l[r++]=255&f;for(let e=0;e<6;++e)l[r+e]=d[e];return t||(0,o.unsafeStringify)(l)}},237:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=o(n(925)),i=o(n(163));function o(e){return e&&e.__esModule?e:{default:e}}var a=(0,r.default)("v3",48,i.default);t.default=a},925:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.URL=t.DNS=void 0,t.default=function(e,t,n){function r(e,r,a,s){var u;if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));const t=[];for(let n=0;n<e.length;++n)t.push(e.charCodeAt(n));return t}(e)),"string"==typeof r&&(r=(0,o.default)(r)),16!==(null===(u=r)||void 0===u?void 0:u.length))throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let c=new Uint8Array(16+e.length);if(c.set(r),c.set(e,r.length),c=n(c),c[6]=15&c[6]|t,c[8]=63&c[8]|128,a){s=s||0;for(let e=0;e<16;++e)a[s+e]=c[e];return a}return(0,i.unsafeStringify)(c)}try{r.name=e}catch(e){}return r.DNS=a,r.URL=s,r};var r,i=n(8),o=(r=n(222))&&r.__esModule?r:{default:r};const a="6ba7b810-9dad-11d1-80b4-00c04fd430c8";t.DNS=a;const s="6ba7b811-9dad-11d1-80b4-00c04fd430c8";t.URL=s},355:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a(n(790)),i=a(n(319)),o=n(8);function a(e){return e&&e.__esModule?e:{default:e}}t.default=function(e,t,n){if(r.default.randomUUID&&!t&&!e)return r.default.randomUUID();const a=(e=e||{}).random||(e.rng||i.default)();if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,t){n=n||0;for(let e=0;e<16;++e)t[n+e]=a[e];return t}return(0,o.unsafeStringify)(a)}},764:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=o(n(925)),i=o(n(757));function o(e){return e&&e.__esModule?e:{default:e}}var a=(0,r.default)("v5",80,i.default);t.default=a},435:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,i=(r=n(58))&&r.__esModule?r:{default:r};t.default=function(e){return"string"==typeof e&&i.default.test(e)}},464:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,i=(r=n(435))&&r.__esModule?r:{default:r};t.default=function(e){if(!(0,i.default)(e))throw TypeError("Invalid UUID");return parseInt(e.slice(14,15),16)}}},t={},n=function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={exports:{}};return e[r].call(o.exports,o,o.exports,n),o.exports}(623);CctLce=n})();