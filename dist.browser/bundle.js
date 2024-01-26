(()=>{var e={599:e=>{"use strict";const{AbortController:t,AbortSignal:n}="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0;e.exports=t,e.exports.AbortSignal=n,e.exports.default=t},187:e=>{"use strict";var t,n="object"==typeof Reflect?Reflect:null,r=n&&"function"==typeof n.apply?n.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};t=n&&"function"==typeof n.ownKeys?n.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var o=Number.isNaN||function(e){return e!=e};function i(){i.init.call(this)}e.exports=i,e.exports.once=function(e,t){return new Promise((function(n,r){function o(n){e.removeListener(t,i),r(n)}function i(){"function"==typeof e.removeListener&&e.removeListener("error",o),n([].slice.call(arguments))}v(e,t,i,{once:!0}),"error"!==t&&function(e,t,n){"function"==typeof e.on&&v(e,"error",t,{once:!0})}(e,o)}))},i.EventEmitter=i,i.prototype._events=void 0,i.prototype._eventsCount=0,i.prototype._maxListeners=void 0;var a=10;function s(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function u(e){return void 0===e._maxListeners?i.defaultMaxListeners:e._maxListeners}function c(e,t,n,r){var o,i,a,c;if(s(n),void 0===(i=e._events)?(i=e._events=Object.create(null),e._eventsCount=0):(void 0!==i.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),i=e._events),a=i[t]),void 0===a)a=i[t]=n,++e._eventsCount;else if("function"==typeof a?a=i[t]=r?[n,a]:[a,n]:r?a.unshift(n):a.push(n),(o=u(e))>0&&a.length>o&&!a.warned){a.warned=!0;var d=new Error("Possible EventEmitter memory leak detected. "+a.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");d.name="MaxListenersExceededWarning",d.emitter=e,d.type=t,d.count=a.length,c=d,console&&console.warn&&console.warn(c)}return e}function d(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function l(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},o=d.bind(r);return o.listener=n,r.wrapFn=o,o}function f(e,t,n){var r=e._events;if(void 0===r)return[];var o=r[t];return void 0===o?[]:"function"==typeof o?n?[o.listener||o]:[o]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(o):p(o,o.length)}function h(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function p(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}function v(e,t,n,r){if("function"==typeof e.on)r.once?e.once(t,n):e.on(t,n);else{if("function"!=typeof e.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e);e.addEventListener(t,(function o(i){r.once&&e.removeEventListener(t,o),n(i)}))}}Object.defineProperty(i,"defaultMaxListeners",{enumerable:!0,get:function(){return a},set:function(e){if("number"!=typeof e||e<0||o(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");a=e}}),i.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},i.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||o(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},i.prototype.getMaxListeners=function(){return u(this)},i.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var o="error"===e,i=this._events;if(void 0!==i)o=o&&void 0===i.error;else if(!o)return!1;if(o){var a;if(t.length>0&&(a=t[0]),a instanceof Error)throw a;var s=new Error("Unhandled error."+(a?" ("+a.message+")":""));throw s.context=a,s}var u=i[e];if(void 0===u)return!1;if("function"==typeof u)r(u,this,t);else{var c=u.length,d=p(u,c);for(n=0;n<c;++n)r(d[n],this,t)}return!0},i.prototype.addListener=function(e,t){return c(this,e,t,!1)},i.prototype.on=i.prototype.addListener,i.prototype.prependListener=function(e,t){return c(this,e,t,!0)},i.prototype.once=function(e,t){return s(t),this.on(e,l(this,e,t)),this},i.prototype.prependOnceListener=function(e,t){return s(t),this.prependListener(e,l(this,e,t)),this},i.prototype.removeListener=function(e,t){var n,r,o,i,a;if(s(t),void 0===(r=this._events))return this;if(void 0===(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(o=-1,i=n.length-1;i>=0;i--)if(n[i]===t||n[i].listener===t){a=n[i].listener,o=i;break}if(o<0)return this;0===o?n.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(n,o),1===n.length&&(r[e]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",e,a||t)}return this},i.prototype.off=i.prototype.removeListener,i.prototype.removeAllListeners=function(e){var t,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var o,i=Object.keys(n);for(r=0;r<i.length;++r)"removeListener"!==(o=i[r])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},i.prototype.listeners=function(e){return f(this,e,!0)},i.prototype.rawListeners=function(e){return f(this,e,!1)},i.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):h.call(e,t)},i.prototype.listenerCount=h,i.prototype.eventNames=function(){return this._eventsCount>0?t(this._events):[]}},300:(e,t)=>{"use strict";var n=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==n)return n;throw new Error("unable to locate global object")}();e.exports=t=n.fetch,n.fetch&&(t.default=n.fetch.bind(n)),t.Headers=n.Headers,t.Request=n.Request,t.Response=n.Response},395:(e,t)=>{"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),t.BandwidthMode=void 0,(n=t.BandwidthMode||(t.BandwidthMode={})).big="big",n.small="small"},898:(e,t)=>{"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),t.Speed=void 0,(n=t.Speed||(t.Speed={})).good="GOOD",n.ok="OK",n.bad="BAD",n.nothing="NOTHING"},623:function(e,t,n){"use strict";var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},r.apply(this,arguments)},o=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{u(r.next(e))}catch(e){i(e)}}function s(e){try{u(r.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}u((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},a=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))};Object.defineProperty(t,"__esModule",{value:!0}),t.CCT=void 0;var s=n(429),u=n(300),c=n(898),d=n(940),l=n(944),f=n(395),h="CCT_DATA",p=function(){function e(){this.storage=[],this.runningLatency=!1,this.runningBandwidth=!1}return e.prototype.fetchDatacenterInformationRequest=function(e){return o(this,void 0,void 0,(function(){return i(this,(function(t){switch(t.label){case 0:return t.trys.push([0,2,,3]),[4,(0,u.default)(e).then((function(e){return e.json()}))];case 1:return[2,t.sent()];case 2:return t.sent(),[2,[]];case 3:return[2]}}))}))},e.prototype.fetchDatacenterInformation=function(e){return o(this,void 0,void 0,(function(){var t;return i(this,(function(n){switch(n.label){case 0:return t=this,[4,this.fetchDatacenterInformationRequest(e)];case 1:return t.allDatacenters=n.sent(),this.datacenters=this.allDatacenters,this.storage=this.allDatacenters.map((function(e){return{id:e.id,latencies:[],bandwidths:[],shouldSave:!1}})),this.clean(),this.readLocalStorage(),this.lce=new d.LCE(this.datacenters),[2]}}))}))},e.prototype.setFilters=function(e){this.datacenters=e?this.allDatacenters.filter((function(t){return Object.keys(e).every((function(n){return"tags"===n?e[n].some((function(e){return t[n].toLowerCase().includes(e.toLowerCase())})):e[n].map((function(e){return e.toLowerCase()})).includes(t[n].toLowerCase())}))})):this.allDatacenters,this.lce.updateDatacenters(this.datacenters)},e.prototype.stopMeasurements=function(){this.runningLatency=!1,this.runningBandwidth=!1,this.lce.terminate()},e.prototype.startLatencyChecks=function(e){var t=e.iterations,n=e.saveToLocalStorage,r=void 0!==n&&n,a=e.save,s=void 0===a||a;return o(this,void 0,void 0,(function(){var e,n,o;return i(this,(function(i){switch(i.label){case 0:for(this.runningLatency=!0,e=[],n=0;n<this.datacenters.length;n++)o=this.datacenters[n],e.push(this.startMeasurementForLatency({iterations:t,dc:o,saveToLocalStorage:r,save:s}));return[4,Promise.all(e)];case 1:return i.sent(),this.runningLatency=!1,[2]}}))}))},e.prototype.startMeasurementForLatency=function(e){var t,n=e.iterations,r=e.dc,a=e.saveToLocalStorage,s=void 0!==a&&a,u=e.save,c=void 0!==u&&u;return o(this,void 0,void 0,(function(){var e,o,a,u,d;return i(this,(function(i){switch(i.label){case 0:e=0,i.label=1;case 1:return e<n?[4,this.lce.getLatencyForId(r.id)]:[3,4];case 2:if(o=i.sent(),!this.runningLatency)return[2];o&&o.latency&&c&&(a=this.datacenters.findIndex((function(e){return e.id===r.id})),u={value:o.latency,timestamp:o.timestamp},null===(t=this.datacenters[a].latencies)||void 0===t||t.push(u),d=l.Util.getAverageLatency(this.datacenters[a].latencies),this.datacenters[a].averageLatency=d,this.datacenters[a].latencyJudgement=this.judgeLatency(d),this.addDataToStorage(r.id,u),s&&this.setLocalStorage()),i.label=3;case 3:return e++,[3,1];case 4:return[2]}}))}))},e.prototype.startBandwidthChecks=function(e){var t=e.iterations,n=e.bandwidthMode,r=e.saveToLocalStorage,a=void 0!==r&&r,s=e.save,u=void 0===s||s;return o(this,void 0,void 0,(function(){var e,r,o;return i(this,(function(i){switch(i.label){case 0:for(this.runningBandwidth=!0,e=[],r=0;r<this.datacenters.length;r++)o=this.datacenters[r],e.push(this.startMeasurementForBandwidth({iterations:t,dc:o,bandwidthMode:n,saveToLocalStorage:a,save:u}));return[4,Promise.all(e)];case 1:return i.sent(),this.runningBandwidth=!1,[2]}}))}))},e.prototype.startMeasurementForBandwidth=function(e){var t,n=e.iterations,r=e.dc,a=e.bandwidthMode,s=void 0===a?f.BandwidthMode.big:a,u=e.saveToLocalStorage,c=void 0!==u&&u,d=e.save,h=void 0!==d&&d;return o(this,void 0,void 0,(function(){var e,o,a,u,d;return i(this,(function(i){switch(i.label){case 0:e=0,i.label=1;case 1:return e<n?[4,this.lce.getBandwidthForId(r.id,{bandwidthMode:s})]:[3,4];case 2:if(o=i.sent(),!this.runningBandwidth)return[2];o&&o.bandwidth&&h&&(a=this.datacenters.findIndex((function(e){return e.id===r.id})),u={value:o.bandwidth,timestamp:o.timestamp},null===(t=this.datacenters[a].bandwidths)||void 0===t||t.push(u),d=l.Util.getAverageBandwidth(this.datacenters[a].bandwidths),this.datacenters[a].averageBandwidth=d,this.datacenters[a].bandwidthJudgement=this.judgeBandwidth(d),this.addDataToStorage(r.id,u),c&&this.setLocalStorage()),i.label=3;case 3:return e++,[3,1];case 4:return[2]}}))}))},e.prototype.judgeLatency=function(e){return e<170?c.Speed.good:e>=170&&e<280?c.Speed.ok:c.Speed.bad},e.prototype.judgeBandwidth=function(e){return e.megaBitsPerSecond>1?c.Speed.good:e.megaBitsPerSecond<=1&&e.megaBitsPerSecond>.3?c.Speed.ok:c.Speed.bad},e.prototype.getCurrentDatacentersSorted=function(){return l.Util.sortDatacenters(this.datacenters),this.datacenters},e.prototype.getAddress=function(){return o(this,void 0,void 0,(function(){var e,t=this;return i(this,(function(n){return e={address:"",latitude:0,longitude:0},[2,new Promise((function(n){navigator&&(null===navigator||void 0===navigator?void 0:navigator.geolocation)?navigator.geolocation.getCurrentPosition((function(r){return o(t,void 0,void 0,(function(){return i(this,(function(t){switch(t.label){case 0:return e.latitude=r.coords.latitude,e.longitude=r.coords.longitude,[4,(new google.maps.Geocoder).geocode({location:new google.maps.LatLng(e.latitude,e.longitude)},(function(t,r){"OK"===r?(e.address=t[0].formatted_address,n(e)):(e.address="",e.latitude=0,e.longitude=0,n(e))}))];case 1:return t.sent(),[2]}}))}))}),(function(){n(e)})):n(e)}))]}))}))},e.prototype.storeRequest=function(e){return o(this,void 0,void 0,(function(){return i(this,(function(t){switch(t.label){case 0:return[4,(0,u.default)("https://cct.demo-education.cloud.sap/measurement",{method:"post",body:e,headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()}))];case 1:return[2,t.sent()]}}))}))},e.prototype.store=function(e){return void 0===e&&(e={address:"Dietmar-Hopp-Allee 16, 69190 Walldorf, Germany",latitude:49.2933756,longitude:8.6421212}),o(this,void 0,void 0,(function(){var t,n;return i(this,(function(r){switch(r.label){case 0:t=[],this.storage=this.storage.map((function(e){var n;return e.shouldSave?(t.push({id:e.id,latency:"".concat(null===(n=l.Util.getAverageLatency(e.latencies))||void 0===n?void 0:n.toFixed(2)),averageBandwidth:l.Util.getAverageBandwidth(e.bandwidths).megaBitsPerSecond.toFixed(2)}),{id:e.id,latencies:[],bandwidths:[],shouldSave:!1}):e})),n=JSON.stringify({uid:(0,s.v4)(),address:e.address,latitude:e.latitude,longitude:e.longitude,data:t},null,4),r.label=1;case 1:return r.trys.push([1,3,,4]),[4,this.storeRequest(n)];case 2:return[2,"OK"===r.sent().status];case 3:return r.sent(),[2,!1];case 4:return[2]}}))}))},e.prototype.addDataToStorage=function(e,t){this.storage=this.storage.map((function(n){if(n.id===e){var r="value"in t&&"number"==typeof t.value,o=r?a(a([],n.latencies,!0),[t],!1):n.latencies,i=r?n.bandwidths:a(a([],n.bandwidths,!0),[t],!1);return{id:n.id,latencies:o,bandwidths:i,shouldSave:o.length>=16}}return n}))},e.prototype.setLocalStorage=function(){window.localStorage.removeItem(h);var e=this.allDatacenters.map((function(e){return{id:e.id,latencies:e.latencies,averageLatency:e.averageLatency,latencyJudgement:e.latencyJudgement,bandwidths:e.bandwidths,averageBandwidth:e.averageBandwidth,bandwidthJudgement:e.bandwidthJudgement}}));window.localStorage.setItem(h,JSON.stringify(e))},e.prototype.readLocalStorage=function(){var e=window.localStorage.getItem(h);if(e){var t=JSON.parse(e);this.allDatacenters=this.allDatacenters.map((function(e){var n=t.find((function(t){return t.id===e.id}));return n?r(r({},e),{averageLatency:n.averageLatency,latencyJudgement:n.latencyJudgement,averageBandwidth:n.averageBandwidth,bandwidthJudgement:n.bandwidthJudgement,latencies:n.latencies,bandwidths:n.bandwidths}):e})),window.localStorage.removeItem(h)}},e.prototype.subscribe=function(e,t){this.lce&&this.lce.on(e,t)},e.prototype.unsubscribe=function(e,t){this.lce&&this.lce.off(e,t)},e.prototype.clean=function(){this.datacenters.forEach((function(e){e.position=0,e.averageLatency=0,e.averageBandwidth={bitsPerSecond:0,kiloBitsPerSecond:0,megaBitsPerSecond:0},e.latencies=[],e.bandwidths=[]}))},e}();t.CCT=p},940:function(e,t,n){"use strict";var r,o=this&&this.__extends||(r=function(e,t){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},r(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),i=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{u(r.next(e))}catch(e){i(e)}}function s(e){try{u(r.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}u((r=r.apply(e,t||[])).next())}))},a=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.LCE=void 0;var s=n(300),u=n(187),c=n(395),d=n(599),l=function(e){function t(t){var n=e.call(this)||this;return n.datacenters=t,n.cancelableLatencyRequests=[],n.cancelableBandwidthRequests=[],n.terminateAllCalls=!1,n}return o(t,e),t.prototype.updateDatacenters=function(e){this.datacenters=e},t.prototype.runLatencyCheckForAll=function(){return i(this,void 0,void 0,(function(){var e,t,n,r=this;return a(this,(function(o){switch(o.label){case 0:return e=[],this.datacenters.forEach((function(t){e.push(r.getLatencyFor(t))})),[4,Promise.all(e)];case 1:return t=o.sent(),(n=t.filter((function(e){return null!==e}))).sort(this.compare),this.cancelableLatencyRequests=[],[2,n]}}))}))},t.prototype.runBandwidthCheckForAll=function(){return i(this,void 0,void 0,(function(){var e,t,n,r,o;return a(this,(function(i){switch(i.label){case 0:e=[],t=0,n=this.datacenters,i.label=1;case 1:return t<n.length?(r=n[t],this.terminateAllCalls?[3,4]:[4,this.getBandwidthFor(r)]):[3,4];case 2:(o=i.sent())&&e.push(o),i.label=3;case 3:return t++,[3,1];case 4:return this.cancelableBandwidthRequests=[],[2,e]}}))}))},t.prototype.getBandwidthForId=function(e,t){var n=this.datacenters.find((function(t){return t.id===e}));return n?this.getBandwidthFor(n,t):null},t.prototype.getLatencyForId=function(e){var t=this.datacenters.find((function(t){return t.id===e}));return t?this.getLatencyFor(t):null},t.prototype.getLatencyFor=function(e){return i(this,void 0,void 0,(function(){var t,n;return a(this,(function(r){switch(r.label){case 0:return t=Date.now(),[4,this.latencyFetch("https://".concat(e.ip,"/drone/index.html"))];case 1:return r.sent(),n=Date.now(),this.emit("latency"),[2,{id:e.id,latency:n-t,cloud:e.cloud,name:e.name,town:e.town,country:e.country,latitude:e.latitude,longitude:e.longitude,ip:e.ip,timestamp:Date.now()}]}}))}))},t.prototype.getBandwidthFor=function(e,n){return void 0===n&&(n={bandwidthMode:c.BandwidthMode.big}),i(this,void 0,void 0,(function(){var r,o,i,s,u,c;return a(this,(function(a){switch(a.label){case 0:return r=Date.now(),[4,this.bandwidthFetch("https://".concat(e.ip,"/drone/").concat(n.bandwidthMode))];case 1:if(o=a.sent(),i=Date.now(),null===o)return[3,6];this.emit("bandwidth"),s=void 0,a.label=2;case 2:return a.trys.push([2,4,,5]),[4,o.text()];case 3:return s=a.sent(),[3,5];case 4:return u=a.sent(),console.log(u),[2,null];case 5:return c=t.calcBandwidth(s.length,i-r),[2,{id:e.id,bandwidth:c,cloud:e.cloud,name:e.name,town:e.town,country:e.country,latitude:e.latitude,longitude:e.longitude,ip:e.ip,timestamp:Date.now()}];case 6:return[2,null]}}))}))},t.prototype.bandwidthFetch=function(e){var t=new d.default;return this.cancelableBandwidthRequests.push(t),this.abortableFetch(e,t)},t.prototype.latencyFetch=function(e){var t=new d.default;return this.cancelableLatencyRequests.push(t),this.abortableFetch(e,t)},t.prototype.abortableFetch=function(e,t,n){return void 0===n&&(n=3e3),i(this,void 0,void 0,(function(){var r,o,i,u;return a(this,(function(a){switch(a.label){case 0:return a.trys.push([0,2,,3]),r=setTimeout((function(){return t.abort()}),n),o=new URLSearchParams({t:"".concat(Date.now())}).toString(),[4,(0,s.default)("".concat(e,"?").concat(o),{signal:t.signal})];case 1:return i=a.sent(),clearTimeout(r),[2,i];case 2:return u=a.sent(),console.log(u),[2,null];case 3:return[2]}}))}))},t.prototype.compare=function(e,t){return e.latency<t.latency?-1:e.latency>t.latency?1:0},t.prototype.terminate=function(){this.terminateAllCalls=!0,this.cancelableLatencyRequests.forEach((function(e){e.abort()})),this.cancelableBandwidthRequests.forEach((function(e){e.abort()})),this.cancelableLatencyRequests=[],this.cancelableBandwidthRequests=[],this.terminateAllCalls=!1},t.calcBandwidth=function(e,t){var n=8*e/(t/1e3),r=n/1e3;return{bitsPerSecond:n,kiloBitsPerSecond:r,megaBitsPerSecond:r/1e3}},t}(u.EventEmitter);t.LCE=l},944:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Util=void 0;var n=function(){function e(){}return e.getAverageLatency=function(e){return e&&0!==e.length?e.reduce((function(e,t){return e+t.value}),0)/e.length:-1},e.getAverageBandwidth=function(e){if(e&&e.length){var t=e.reduce((function(e,t){return{bitsPerSecond:e.bitsPerSecond+t.value.bitsPerSecond,kiloBitsPerSecond:e.kiloBitsPerSecond+t.value.kiloBitsPerSecond,megaBitsPerSecond:e.megaBitsPerSecond+t.value.megaBitsPerSecond}}),{bitsPerSecond:0,kiloBitsPerSecond:0,megaBitsPerSecond:0}),n=e.length;return{bitsPerSecond:t.bitsPerSecond/n,kiloBitsPerSecond:t.kiloBitsPerSecond/n,megaBitsPerSecond:t.megaBitsPerSecond/n}}return{bitsPerSecond:-1,kiloBitsPerSecond:-1,megaBitsPerSecond:-1}},e.sortDatacenters=function(e){return e.sort((function(e,t){return e.averageLatency-t.averageLatency})),e.forEach((function(e,t){e.position=t+1})),e},e.getTop3=function(t){return e.sortDatacenters(t).slice(0,3)},e.sleep=function(e){return new Promise((function(t){return setTimeout(t,e)}))},e}();t.Util=n},429:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"NIL",{enumerable:!0,get:function(){return s.default}}),Object.defineProperty(t,"parse",{enumerable:!0,get:function(){return l.default}}),Object.defineProperty(t,"stringify",{enumerable:!0,get:function(){return d.default}}),Object.defineProperty(t,"v1",{enumerable:!0,get:function(){return r.default}}),Object.defineProperty(t,"v3",{enumerable:!0,get:function(){return o.default}}),Object.defineProperty(t,"v4",{enumerable:!0,get:function(){return i.default}}),Object.defineProperty(t,"v5",{enumerable:!0,get:function(){return a.default}}),Object.defineProperty(t,"validate",{enumerable:!0,get:function(){return c.default}}),Object.defineProperty(t,"version",{enumerable:!0,get:function(){return u.default}});var r=f(n(990)),o=f(n(237)),i=f(n(355)),a=f(n(764)),s=f(n(314)),u=f(n(464)),c=f(n(435)),d=f(n(8)),l=f(n(222));function f(e){return e&&e.__esModule?e:{default:e}}},163:(e,t)=>{"use strict";function n(e){return 14+(e+64>>>9<<4)+1}function r(e,t){const n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function o(e,t,n,o,i,a){return r((s=r(r(t,e),r(o,a)))<<(u=i)|s>>>32-u,n);var s,u}function i(e,t,n,r,i,a,s){return o(t&n|~t&r,e,t,i,a,s)}function a(e,t,n,r,i,a,s){return o(t&r|n&~r,e,t,i,a,s)}function s(e,t,n,r,i,a,s){return o(t^n^r,e,t,i,a,s)}function u(e,t,n,r,i,a,s){return o(n^(t|~r),e,t,i,a,s)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=function(e){if("string"==typeof e){const t=unescape(encodeURIComponent(e));e=new Uint8Array(t.length);for(let n=0;n<t.length;++n)e[n]=t.charCodeAt(n)}return function(e){const t=[],n=32*e.length,r="0123456789abcdef";for(let o=0;o<n;o+=8){const n=e[o>>5]>>>o%32&255,i=parseInt(r.charAt(n>>>4&15)+r.charAt(15&n),16);t.push(i)}return t}(function(e,t){e[t>>5]|=128<<t%32,e[n(t)-1]=t;let o=1732584193,c=-271733879,d=-1732584194,l=271733878;for(let t=0;t<e.length;t+=16){const n=o,f=c,h=d,p=l;o=i(o,c,d,l,e[t],7,-680876936),l=i(l,o,c,d,e[t+1],12,-389564586),d=i(d,l,o,c,e[t+2],17,606105819),c=i(c,d,l,o,e[t+3],22,-1044525330),o=i(o,c,d,l,e[t+4],7,-176418897),l=i(l,o,c,d,e[t+5],12,1200080426),d=i(d,l,o,c,e[t+6],17,-1473231341),c=i(c,d,l,o,e[t+7],22,-45705983),o=i(o,c,d,l,e[t+8],7,1770035416),l=i(l,o,c,d,e[t+9],12,-1958414417),d=i(d,l,o,c,e[t+10],17,-42063),c=i(c,d,l,o,e[t+11],22,-1990404162),o=i(o,c,d,l,e[t+12],7,1804603682),l=i(l,o,c,d,e[t+13],12,-40341101),d=i(d,l,o,c,e[t+14],17,-1502002290),c=i(c,d,l,o,e[t+15],22,1236535329),o=a(o,c,d,l,e[t+1],5,-165796510),l=a(l,o,c,d,e[t+6],9,-1069501632),d=a(d,l,o,c,e[t+11],14,643717713),c=a(c,d,l,o,e[t],20,-373897302),o=a(o,c,d,l,e[t+5],5,-701558691),l=a(l,o,c,d,e[t+10],9,38016083),d=a(d,l,o,c,e[t+15],14,-660478335),c=a(c,d,l,o,e[t+4],20,-405537848),o=a(o,c,d,l,e[t+9],5,568446438),l=a(l,o,c,d,e[t+14],9,-1019803690),d=a(d,l,o,c,e[t+3],14,-187363961),c=a(c,d,l,o,e[t+8],20,1163531501),o=a(o,c,d,l,e[t+13],5,-1444681467),l=a(l,o,c,d,e[t+2],9,-51403784),d=a(d,l,o,c,e[t+7],14,1735328473),c=a(c,d,l,o,e[t+12],20,-1926607734),o=s(o,c,d,l,e[t+5],4,-378558),l=s(l,o,c,d,e[t+8],11,-2022574463),d=s(d,l,o,c,e[t+11],16,1839030562),c=s(c,d,l,o,e[t+14],23,-35309556),o=s(o,c,d,l,e[t+1],4,-1530992060),l=s(l,o,c,d,e[t+4],11,1272893353),d=s(d,l,o,c,e[t+7],16,-155497632),c=s(c,d,l,o,e[t+10],23,-1094730640),o=s(o,c,d,l,e[t+13],4,681279174),l=s(l,o,c,d,e[t],11,-358537222),d=s(d,l,o,c,e[t+3],16,-722521979),c=s(c,d,l,o,e[t+6],23,76029189),o=s(o,c,d,l,e[t+9],4,-640364487),l=s(l,o,c,d,e[t+12],11,-421815835),d=s(d,l,o,c,e[t+15],16,530742520),c=s(c,d,l,o,e[t+2],23,-995338651),o=u(o,c,d,l,e[t],6,-198630844),l=u(l,o,c,d,e[t+7],10,1126891415),d=u(d,l,o,c,e[t+14],15,-1416354905),c=u(c,d,l,o,e[t+5],21,-57434055),o=u(o,c,d,l,e[t+12],6,1700485571),l=u(l,o,c,d,e[t+3],10,-1894986606),d=u(d,l,o,c,e[t+10],15,-1051523),c=u(c,d,l,o,e[t+1],21,-2054922799),o=u(o,c,d,l,e[t+8],6,1873313359),l=u(l,o,c,d,e[t+15],10,-30611744),d=u(d,l,o,c,e[t+6],15,-1560198380),c=u(c,d,l,o,e[t+13],21,1309151649),o=u(o,c,d,l,e[t+4],6,-145523070),l=u(l,o,c,d,e[t+11],10,-1120210379),d=u(d,l,o,c,e[t+2],15,718787259),c=u(c,d,l,o,e[t+9],21,-343485551),o=r(o,n),c=r(c,f),d=r(d,h),l=r(l,p)}return[o,c,d,l]}(function(e){if(0===e.length)return[];const t=8*e.length,r=new Uint32Array(n(t));for(let n=0;n<t;n+=8)r[n>>5]|=(255&e[n/8])<<n%32;return r}(e),8*e.length))}},790:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};t.default=n},314:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,t.default="00000000-0000-0000-0000-000000000000"},222:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=(r=n(435))&&r.__esModule?r:{default:r};t.default=function(e){if(!(0,o.default)(e))throw TypeError("Invalid UUID");let t;const n=new Uint8Array(16);return n[0]=(t=parseInt(e.slice(0,8),16))>>>24,n[1]=t>>>16&255,n[2]=t>>>8&255,n[3]=255&t,n[4]=(t=parseInt(e.slice(9,13),16))>>>8,n[5]=255&t,n[6]=(t=parseInt(e.slice(14,18),16))>>>8,n[7]=255&t,n[8]=(t=parseInt(e.slice(19,23),16))>>>8,n[9]=255&t,n[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,n[11]=t/4294967296&255,n[12]=t>>>24&255,n[13]=t>>>16&255,n[14]=t>>>8&255,n[15]=255&t,n}},58:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,t.default=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i},319:(e,t)=>{"use strict";let n;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){if(!n&&(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!n))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(r)};const r=new Uint8Array(16)},757:(e,t)=>{"use strict";function n(e,t,n,r){switch(e){case 0:return t&n^~t&r;case 1:case 3:return t^n^r;case 2:return t&n^t&r^n&r}}function r(e,t){return e<<t|e>>>32-t}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=function(e){const t=[1518500249,1859775393,2400959708,3395469782],o=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){const t=unescape(encodeURIComponent(e));e=[];for(let n=0;n<t.length;++n)e.push(t.charCodeAt(n))}else Array.isArray(e)||(e=Array.prototype.slice.call(e));e.push(128);const i=e.length/4+2,a=Math.ceil(i/16),s=new Array(a);for(let t=0;t<a;++t){const n=new Uint32Array(16);for(let r=0;r<16;++r)n[r]=e[64*t+4*r]<<24|e[64*t+4*r+1]<<16|e[64*t+4*r+2]<<8|e[64*t+4*r+3];s[t]=n}s[a-1][14]=8*(e.length-1)/Math.pow(2,32),s[a-1][14]=Math.floor(s[a-1][14]),s[a-1][15]=8*(e.length-1)&4294967295;for(let e=0;e<a;++e){const i=new Uint32Array(80);for(let t=0;t<16;++t)i[t]=s[e][t];for(let e=16;e<80;++e)i[e]=r(i[e-3]^i[e-8]^i[e-14]^i[e-16],1);let a=o[0],u=o[1],c=o[2],d=o[3],l=o[4];for(let e=0;e<80;++e){const o=Math.floor(e/20),s=r(a,5)+n(o,u,c,d)+l+t[o]+i[e]>>>0;l=d,d=c,c=r(u,30)>>>0,u=a,a=s}o[0]=o[0]+a>>>0,o[1]=o[1]+u>>>0,o[2]=o[2]+c>>>0,o[3]=o[3]+d>>>0,o[4]=o[4]+l>>>0}return[o[0]>>24&255,o[0]>>16&255,o[0]>>8&255,255&o[0],o[1]>>24&255,o[1]>>16&255,o[1]>>8&255,255&o[1],o[2]>>24&255,o[2]>>16&255,o[2]>>8&255,255&o[2],o[3]>>24&255,o[3]>>16&255,o[3]>>8&255,255&o[3],o[4]>>24&255,o[4]>>16&255,o[4]>>8&255,255&o[4]]}},8:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,t.unsafeStringify=a;var r,o=(r=n(435))&&r.__esModule?r:{default:r};const i=[];for(let e=0;e<256;++e)i.push((e+256).toString(16).slice(1));function a(e,t=0){return(i[e[t+0]]+i[e[t+1]]+i[e[t+2]]+i[e[t+3]]+"-"+i[e[t+4]]+i[e[t+5]]+"-"+i[e[t+6]]+i[e[t+7]]+"-"+i[e[t+8]]+i[e[t+9]]+"-"+i[e[t+10]]+i[e[t+11]]+i[e[t+12]]+i[e[t+13]]+i[e[t+14]]+i[e[t+15]]).toLowerCase()}t.default=function(e,t=0){const n=a(e,t);if(!(0,o.default)(n))throw TypeError("Stringified UUID is invalid");return n}},990:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=(r=n(319))&&r.__esModule?r:{default:r},i=n(8);let a,s,u=0,c=0;t.default=function(e,t,n){let r=t&&n||0;const d=t||new Array(16);let l=(e=e||{}).node||a,f=void 0!==e.clockseq?e.clockseq:s;if(null==l||null==f){const t=e.random||(e.rng||o.default)();null==l&&(l=a=[1|t[0],t[1],t[2],t[3],t[4],t[5]]),null==f&&(f=s=16383&(t[6]<<8|t[7]))}let h=void 0!==e.msecs?e.msecs:Date.now(),p=void 0!==e.nsecs?e.nsecs:c+1;const v=h-u+(p-c)/1e4;if(v<0&&void 0===e.clockseq&&(f=f+1&16383),(v<0||h>u)&&void 0===e.nsecs&&(p=0),p>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");u=h,c=p,s=f,h+=122192928e5;const y=(1e4*(268435455&h)+p)%4294967296;d[r++]=y>>>24&255,d[r++]=y>>>16&255,d[r++]=y>>>8&255,d[r++]=255&y;const g=h/4294967296*1e4&268435455;d[r++]=g>>>8&255,d[r++]=255&g,d[r++]=g>>>24&15|16,d[r++]=g>>>16&255,d[r++]=f>>>8|128,d[r++]=255&f;for(let e=0;e<6;++e)d[r+e]=l[e];return t||(0,i.unsafeStringify)(d)}},237:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=i(n(925)),o=i(n(163));function i(e){return e&&e.__esModule?e:{default:e}}var a=(0,r.default)("v3",48,o.default);t.default=a},925:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.URL=t.DNS=void 0,t.default=function(e,t,n){function r(e,r,a,s){var u;if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));const t=[];for(let n=0;n<e.length;++n)t.push(e.charCodeAt(n));return t}(e)),"string"==typeof r&&(r=(0,i.default)(r)),16!==(null===(u=r)||void 0===u?void 0:u.length))throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let c=new Uint8Array(16+e.length);if(c.set(r),c.set(e,r.length),c=n(c),c[6]=15&c[6]|t,c[8]=63&c[8]|128,a){s=s||0;for(let e=0;e<16;++e)a[s+e]=c[e];return a}return(0,o.unsafeStringify)(c)}try{r.name=e}catch(e){}return r.DNS=a,r.URL=s,r};var r,o=n(8),i=(r=n(222))&&r.__esModule?r:{default:r};const a="6ba7b810-9dad-11d1-80b4-00c04fd430c8";t.DNS=a;const s="6ba7b811-9dad-11d1-80b4-00c04fd430c8";t.URL=s},355:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a(n(790)),o=a(n(319)),i=n(8);function a(e){return e&&e.__esModule?e:{default:e}}t.default=function(e,t,n){if(r.default.randomUUID&&!t&&!e)return r.default.randomUUID();const a=(e=e||{}).random||(e.rng||o.default)();if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,t){n=n||0;for(let e=0;e<16;++e)t[n+e]=a[e];return t}return(0,i.unsafeStringify)(a)}},764:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=i(n(925)),o=i(n(757));function i(e){return e&&e.__esModule?e:{default:e}}var a=(0,r.default)("v5",80,o.default);t.default=a},435:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=(r=n(58))&&r.__esModule?r:{default:r};t.default=function(e){return"string"==typeof e&&o.default.test(e)}},464:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=(r=n(435))&&r.__esModule?r:{default:r};t.default=function(e){if(!(0,o.default)(e))throw TypeError("Invalid UUID");return parseInt(e.slice(14,15),16)}}},t={},n=function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}(623);CctLce=n})();