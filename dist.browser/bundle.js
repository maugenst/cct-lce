(()=>{var t={599:t=>{"use strict";const{AbortController:e,AbortSignal:n}="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0;t.exports=e,t.exports.AbortSignal=n,t.exports.default=e},300:(t,e)=>{"use strict";var n=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==n)return n;throw new Error("unable to locate global object")}();t.exports=e=n.fetch,n.fetch&&(e.default=n.fetch.bind(n)),e.Headers=n.Headers,e.Request=n.Request,e.Response=n.Response},395:(t,e)=>{"use strict";var n;Object.defineProperty(e,"__esModule",{value:!0}),e.BandwidthMode=void 0,(n=e.BandwidthMode||(e.BandwidthMode={})).big="big",n.small="small"},898:(t,e)=>{"use strict";var n;Object.defineProperty(e,"__esModule",{value:!0}),e.Speed=void 0,(n=e.Speed||(e.Speed={})).good="GOOD",n.ok="OK",n.bad="BAD",n.nothing="NOTHING"},623:function(t,e,n){"use strict";var r=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(o,a){function i(t){try{c(r.next(t))}catch(t){a(t)}}function s(t){try{c(r.throw(t))}catch(t){a(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,s)}c((r=r.apply(t,e||[])).next())}))},o=this&&this.__generator||function(t,e){var n,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function s(a){return function(s){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!((o=(o=i.trys).length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=e.call(t,i)}catch(t){a=[6,t],r=0}finally{n=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,s])}}};Object.defineProperty(e,"__esModule",{value:!0}),e.CCT=void 0;var a=n(614),i=n(300),s=n(898),c=n(940),u=n(944),d=n(395),l=function(){function t(){this.runningLatency=!1,this.runningBandwidth=!1}return t.prototype.fetchDatacenterInformationRequest=function(t){return r(this,void 0,void 0,(function(){return o(this,(function(e){switch(e.label){case 0:return e.trys.push([0,2,,3]),[4,(0,i.default)(t).then((function(t){return t.json()}))];case 1:return[2,e.sent()];case 2:return e.sent(),[2,[]];case 3:return[2]}}))}))},t.prototype.fetchDatacenterInformation=function(t){return r(this,void 0,void 0,(function(){var e;return o(this,(function(n){switch(n.label){case 0:return e=this,[4,this.fetchDatacenterInformationRequest(t)];case 1:return e.allDatacenters=n.sent(),this.datacenters=this.allDatacenters,this.clean(),this.lce=new c.LCE(this.datacenters),[2]}}))}))},t.prototype.setFilters=function(t){this.datacenters=t?this.allDatacenters.filter((function(e){return Object.keys(t).every((function(n){return t[n].includes(e[n])}))})):this.allDatacenters,this.lce=new c.LCE(this.datacenters)},t.prototype.stopMeasurements=function(){return r(this,void 0,void 0,(function(){return o(this,(function(t){return this.runningLatency=!1,this.runningBandwidth=!1,this.lce.terminate(),[2]}))}))},t.prototype.startLatencyChecks=function(t){return r(this,void 0,void 0,(function(){return o(this,(function(e){switch(e.label){case 0:return this.runningLatency=!0,[4,this.startMeasurementForLatency(t)];case 1:return e.sent(),this.runningLatency=!1,[2]}}))}))},t.prototype.startMeasurementForLatency=function(t){var e;return r(this,void 0,void 0,(function(){var n,r,a,i,s;return o(this,(function(c){switch(c.label){case 0:n=0,c.label=1;case 1:if(!(n<t))return[3,6];r=function(t){var n,r,i,s;return o(this,(function(o){switch(o.label){case 0:return n=a.datacenters[t],[4,a.lce.getLatencyForId(n.id)];case 1:return r=o.sent(),a.runningLatency?(r&&r.latency&&(i=a.datacenters.findIndex((function(t){return t.id===n.id})),null===(e=a.datacenters[i].latencies)||void 0===e||e.push(r.latency),s=u.Util.getAverageLatency(a.datacenters[i].latencies),a.datacenters[i].averageLatency=s,a.datacenters[i].latencyJudgement=a.judgeLatency(s)),[2]):[2,{value:void 0}]}}))},a=this,i=0,c.label=2;case 2:return i<this.datacenters.length?[5,r(i)]:[3,5];case 3:if("object"==typeof(s=c.sent()))return[2,s.value];c.label=4;case 4:return i++,[3,2];case 5:return n++,[3,1];case 6:return[2]}}))}))},t.prototype.startBandwidthChecks=function(t){var e=t.datacenter,n=t.iterations,a=t.bandwidthMode;return r(this,void 0,void 0,(function(){var t,r=this;return o(this,(function(o){switch(o.label){case 0:return this.runningBandwidth=!0,Array.isArray(e)?(t=[],e.forEach((function(e){t.push(r.startMeasurementForBandwidth(e,n,a))})),[4,Promise.all(t).catch((function(t){return console.log(t,"erro111r")}))]):[3,2];case 1:return o.sent(),console.log("promiseAllEnded"),[3,4];case 2:return[4,this.startMeasurementForBandwidth(e,n,a)];case 3:o.sent(),o.label=4;case 4:return this.runningBandwidth=!1,[2]}}))}))},t.prototype.startMeasurementForBandwidth=function(t,e,n){var a;return void 0===n&&(n=d.BandwidthMode.big),r(this,void 0,void 0,(function(){var r,i,s,c;return o(this,(function(o){switch(o.label){case 0:console.log("start"),r=0,o.label=1;case 1:return r<e?[4,this.lce.getBandwidthForId(t.id,{bandwidthMode:n})]:[3,4];case 2:if(i=o.sent(),!this.runningBandwidth)return console.log("stop"),[2];i&&i.bandwidth&&(console.log("push"),s=this.datacenters.findIndex((function(e){return e.id===t.id})),null===(a=this.datacenters[s].bandwidths)||void 0===a||a.push(i.bandwidth),c=u.Util.getAverageBandwidth(this.datacenters[s].bandwidths),this.datacenters[s].averageBandwidth=c,this.datacenters[s].bandwidthJudgement=this.judgeBandwidth(c)),o.label=3;case 3:return r++,[3,1];case 4:return[2]}}))}))},t.prototype.judgeLatency=function(t){return t<170?s.Speed.good:t>=170&&t<280?s.Speed.ok:s.Speed.bad},t.prototype.judgeBandwidth=function(t){return t.megaBitsPerSecond>1?s.Speed.good:t.megaBitsPerSecond<=1&&t.megaBitsPerSecond>.3?s.Speed.ok:s.Speed.bad},t.prototype.getCurrentDatacentersSorted=function(){return u.Util.sortDatacenters(this.datacenters),this.datacenters},t.prototype.getAddress=function(){return r(this,void 0,void 0,(function(){var t,e=this;return o(this,(function(n){return t={address:"",latitude:0,longitude:0},[2,new Promise((function(n){navigator&&(null===navigator||void 0===navigator?void 0:navigator.geolocation)?navigator.geolocation.getCurrentPosition((function(a){return r(e,void 0,void 0,(function(){return o(this,(function(e){switch(e.label){case 0:return t.latitude=a.coords.latitude,t.longitude=a.coords.longitude,[4,(new google.maps.Geocoder).geocode({location:new google.maps.LatLng(t.latitude,t.longitude)},(function(e,r){"OK"===r?(t.address=e[0].formatted_address,n(t)):(t.address="",t.latitude=0,t.longitude=0,n(t))}))];case 1:return e.sent(),[2]}}))}))}),(function(){n(t)})):n(t)}))]}))}))},t.prototype.storeRequest=function(t){return r(this,void 0,void 0,(function(){return o(this,(function(e){switch(e.label){case 0:return[4,(0,i.default)("https://cct.demo-education.cloud.sap/measurement",{method:"post",body:t,headers:{"Content-Type":"application/json"}}).then((function(t){return t.json()}))];case 1:return[2,e.sent()]}}))}))},t.prototype.store=function(t){return void 0===t&&(t={address:"Dietmar-Hopp-Allee 16, 69190 Walldorf, Germany",latitude:49.2933756,longitude:8.6421212}),r(this,void 0,void 0,(function(){var e,n;return o(this,(function(r){switch(r.label){case 0:e=[],this.datacenters.forEach((function(t){e.push({id:t.id,latency:"".concat(t.averageLatency.toFixed(2)),averageBandwidth:t.averageBandwidth.megaBitsPerSecond.toFixed(2)})})),n=JSON.stringify({uid:(0,a.v4)(),address:t.address,latitude:t.latitude,longitude:t.longitude,data:e},null,4),r.label=1;case 1:return r.trys.push([1,3,,4]),[4,this.storeRequest(n)];case 2:return[2,"OK"===r.sent().status];case 3:return r.sent(),[2,!1];case 4:return[2]}}))}))},t.prototype.clean=function(){this.datacenters.forEach((function(t){t.position=0,t.averageLatency=0,t.averageBandwidth={bitsPerSecond:0,kiloBitsPerSecond:0,megaBitsPerSecond:0},t.latencies=[],t.bandwidths=[]}))},t}();e.CCT=l},940:function(t,e,n){"use strict";var r=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(o,a){function i(t){try{c(r.next(t))}catch(t){a(t)}}function s(t){try{c(r.throw(t))}catch(t){a(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,s)}c((r=r.apply(t,e||[])).next())}))},o=this&&this.__generator||function(t,e){var n,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function s(a){return function(s){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!((o=(o=i.trys).length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=e.call(t,i)}catch(t){a=[6,t],r=0}finally{n=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,s])}}};Object.defineProperty(e,"__esModule",{value:!0}),e.LCE=void 0;var a=n(300),i=n(395),s=n(599),c=function(){function t(t){this.datacenters=t,this.cancelableLatencyRequests=[],this.cancelableBandwidthRequests=[],this.terminateAllCalls=!1}return t.prototype.runLatencyCheckForAll=function(){return r(this,void 0,void 0,(function(){var t,e,n,r=this;return o(this,(function(o){switch(o.label){case 0:return t=[],this.datacenters.forEach((function(e){t.push(r.getLatencyFor(e))})),[4,Promise.all(t)];case 1:return e=o.sent(),(n=e.filter((function(t){return null!==t}))).sort(this.compare),this.cancelableLatencyRequests=[],[2,n]}}))}))},t.prototype.runBandwidthCheckForAll=function(){return r(this,void 0,void 0,(function(){var t,e,n,r,a;return o(this,(function(o){switch(o.label){case 0:t=[],e=0,n=this.datacenters,o.label=1;case 1:return e<n.length?(r=n[e],this.terminateAllCalls?[3,4]:[4,this.getBandwidthFor(r)]):[3,4];case 2:(a=o.sent())&&t.push(a),o.label=3;case 3:return e++,[3,1];case 4:return this.cancelableBandwidthRequests=[],[2,t]}}))}))},t.prototype.getBandwidthForId=function(t,e){console.log("getBandwidthForId");var n=this.datacenters.find((function(e){return e.id===t}));return n?this.getBandwidthFor(n,e):null},t.prototype.getLatencyForId=function(t){var e=this.datacenters.find((function(e){return e.id===t}));return e?this.getLatencyFor(e):null},t.prototype.getLatencyFor=function(t){return r(this,void 0,void 0,(function(){var e,n;return o(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),e=Date.now(),[4,this.latencyFetch("https://".concat(t.ip,"/drone/index.html"))];case 1:return r.sent(),n=Date.now(),[2,{id:t.id,latency:n-e,cloud:t.cloud,name:t.name,town:t.town,country:t.country,latitude:t.latitude,longitude:t.longitude,ip:t.ip,timestamp:Date.now()}];case 2:return r.sent(),[2,null];case 3:return[2]}}))}))},t.prototype.getBandwidthFor=function(e,n){return void 0===n&&(n={bandwidthMode:i.BandwidthMode.big}),r(this,void 0,void 0,(function(){var r,a,i,s,c,u;return o(this,(function(o){switch(o.label){case 0:return r=Date.now(),[4,this.bandwidthFetch("https://".concat(e.ip,"/drone/").concat(n.bandwidthMode))];case 1:if(null===(a=o.sent()))return[3,6];i=Date.now(),s=void 0,o.label=2;case 2:return o.trys.push([2,4,,5]),[4,a.text()];case 3:return s=o.sent(),[3,5];case 4:return c=o.sent(),console.log(c),[2,null];case 5:return u=t.calcBandwidth(s.length,i-r),[2,{id:e.id,bandwidth:u,cloud:e.cloud,name:e.name,town:e.town,country:e.country,latitude:e.latitude,longitude:e.longitude,ip:e.ip}];case 6:return[2,null]}}))}))},t.prototype.bandwidthFetch=function(t){var e=new s.default,n=e.signal;return this.cancelableBandwidthRequests.push(e),this.abortableFetch(t,n)},t.prototype.latencyFetch=function(t){var e=new s.default,n=e.signal;return this.cancelableLatencyRequests.push(e),this.abortableFetch(t,n)},t.prototype.abortableFetch=function(t,e){return r(this,void 0,void 0,(function(){var n;return o(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,(0,a.default)(t,{signal:e})];case 1:return[2,r.sent()];case 2:return n=r.sent(),console.log(n),[2,null];case 3:return[2]}}))}))},t.prototype.compare=function(t,e){return t.latency<e.latency?-1:t.latency>e.latency?1:0},t.prototype.terminate=function(){this.terminateAllCalls=!0,this.cancelableLatencyRequests.forEach((function(t){t.abort()})),console.log(this.cancelableBandwidthRequests),this.cancelableBandwidthRequests.forEach((function(t){t.abort()})),this.cancelableLatencyRequests=[],this.cancelableBandwidthRequests=[],this.terminateAllCalls=!1},t.calcBandwidth=function(t,e){var n=8*t/(e/1e3),r=n/1e3;return{bitsPerSecond:n,kiloBitsPerSecond:r,megaBitsPerSecond:r/1e3}},t}();e.LCE=c},944:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Util=void 0;var n=function(){function t(){}return t.getAverageLatency=function(t){return t?t.reduce((function(t,e){return t+e}),0)/t.length:-1},t.getAverageBandwidth=function(t){if(t){var e=t.reduce((function(t,e){return{bitsPerSecond:t.bitsPerSecond+e.bitsPerSecond,kiloBitsPerSecond:t.kiloBitsPerSecond+e.kiloBitsPerSecond,megaBitsPerSecond:t.megaBitsPerSecond+e.megaBitsPerSecond}}));return{bitsPerSecond:e.bitsPerSecond/t.length,kiloBitsPerSecond:e.kiloBitsPerSecond/t.length,megaBitsPerSecond:e.megaBitsPerSecond/t.length}}return{bitsPerSecond:-1,kiloBitsPerSecond:-1,megaBitsPerSecond:-1}},t.sortDatacenters=function(t){return t.sort((function(t,e){return t.averageLatency-e.averageLatency})),t.forEach((function(t,e){t.position=e+1})),t},t.getTop3=function(e){return t.sortDatacenters(e).slice(0,3)},t.sleep=function(t){return new Promise((function(e){return setTimeout(e,t)}))},t}();e.Util=n},614:(t,e,n)=>{"use strict";var r;n.r(e),n.d(e,{NIL:()=>I,parse:()=>y,stringify:()=>d,v1:()=>v,v3:()=>A,v4:()=>C,v5:()=>R,validate:()=>s,version:()=>M});var o=new Uint8Array(16);function a(){if(!r&&!(r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(o)}const i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,s=function(t){return"string"==typeof t&&i.test(t)};for(var c=[],u=0;u<256;++u)c.push((u+256).toString(16).substr(1));const d=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(c[t[e+0]]+c[t[e+1]]+c[t[e+2]]+c[t[e+3]]+"-"+c[t[e+4]]+c[t[e+5]]+"-"+c[t[e+6]]+c[t[e+7]]+"-"+c[t[e+8]]+c[t[e+9]]+"-"+c[t[e+10]]+c[t[e+11]]+c[t[e+12]]+c[t[e+13]]+c[t[e+14]]+c[t[e+15]]).toLowerCase();if(!s(n))throw TypeError("Stringified UUID is invalid");return n};var l,h,f=0,p=0;const v=function(t,e,n){var r=e&&n||0,o=e||new Array(16),i=(t=t||{}).node||l,s=void 0!==t.clockseq?t.clockseq:h;if(null==i||null==s){var c=t.random||(t.rng||a)();null==i&&(i=l=[1|c[0],c[1],c[2],c[3],c[4],c[5]]),null==s&&(s=h=16383&(c[6]<<8|c[7]))}var u=void 0!==t.msecs?t.msecs:Date.now(),v=void 0!==t.nsecs?t.nsecs:p+1,y=u-f+(v-p)/1e4;if(y<0&&void 0===t.clockseq&&(s=s+1&16383),(y<0||u>f)&&void 0===t.nsecs&&(v=0),v>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");f=u,p=v,h=s;var g=(1e4*(268435455&(u+=122192928e5))+v)%4294967296;o[r++]=g>>>24&255,o[r++]=g>>>16&255,o[r++]=g>>>8&255,o[r++]=255&g;var b=u/4294967296*1e4&268435455;o[r++]=b>>>8&255,o[r++]=255&b,o[r++]=b>>>24&15|16,o[r++]=b>>>16&255,o[r++]=s>>>8|128,o[r++]=255&s;for(var w=0;w<6;++w)o[r+w]=i[w];return e||d(o)},y=function(t){if(!s(t))throw TypeError("Invalid UUID");var e,n=new Uint8Array(16);return n[0]=(e=parseInt(t.slice(0,8),16))>>>24,n[1]=e>>>16&255,n[2]=e>>>8&255,n[3]=255&e,n[4]=(e=parseInt(t.slice(9,13),16))>>>8,n[5]=255&e,n[6]=(e=parseInt(t.slice(14,18),16))>>>8,n[7]=255&e,n[8]=(e=parseInt(t.slice(19,23),16))>>>8,n[9]=255&e,n[10]=(e=parseInt(t.slice(24,36),16))/1099511627776&255,n[11]=e/4294967296&255,n[12]=e>>>24&255,n[13]=e>>>16&255,n[14]=e>>>8&255,n[15]=255&e,n};function g(t,e,n){function r(t,r,o,a){if("string"==typeof t&&(t=function(t){t=unescape(encodeURIComponent(t));for(var e=[],n=0;n<t.length;++n)e.push(t.charCodeAt(n));return e}(t)),"string"==typeof r&&(r=y(r)),16!==r.length)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");var i=new Uint8Array(16+t.length);if(i.set(r),i.set(t,r.length),(i=n(i))[6]=15&i[6]|e,i[8]=63&i[8]|128,o){a=a||0;for(var s=0;s<16;++s)o[a+s]=i[s];return o}return d(i)}try{r.name=t}catch(t){}return r.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",r.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",r}function b(t){return 14+(t+64>>>9<<4)+1}function w(t,e){var n=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(n>>16)<<16|65535&n}function m(t,e,n,r,o,a){return w((i=w(w(e,t),w(r,a)))<<(s=o)|i>>>32-s,n);var i,s}function B(t,e,n,r,o,a,i){return m(e&n|~e&r,t,e,o,a,i)}function S(t,e,n,r,o,a,i){return m(e&r|n&~r,t,e,o,a,i)}function P(t,e,n,r,o,a,i){return m(e^n^r,t,e,o,a,i)}function L(t,e,n,r,o,a,i){return m(n^(e|~r),t,e,o,a,i)}const A=g("v3",48,(function(t){if("string"==typeof t){var e=unescape(encodeURIComponent(t));t=new Uint8Array(e.length);for(var n=0;n<e.length;++n)t[n]=e.charCodeAt(n)}return function(t){for(var e=[],n=32*t.length,r="0123456789abcdef",o=0;o<n;o+=8){var a=t[o>>5]>>>o%32&255,i=parseInt(r.charAt(a>>>4&15)+r.charAt(15&a),16);e.push(i)}return e}(function(t,e){t[e>>5]|=128<<e%32,t[b(e)-1]=e;for(var n=1732584193,r=-271733879,o=-1732584194,a=271733878,i=0;i<t.length;i+=16){var s=n,c=r,u=o,d=a;n=B(n,r,o,a,t[i],7,-680876936),a=B(a,n,r,o,t[i+1],12,-389564586),o=B(o,a,n,r,t[i+2],17,606105819),r=B(r,o,a,n,t[i+3],22,-1044525330),n=B(n,r,o,a,t[i+4],7,-176418897),a=B(a,n,r,o,t[i+5],12,1200080426),o=B(o,a,n,r,t[i+6],17,-1473231341),r=B(r,o,a,n,t[i+7],22,-45705983),n=B(n,r,o,a,t[i+8],7,1770035416),a=B(a,n,r,o,t[i+9],12,-1958414417),o=B(o,a,n,r,t[i+10],17,-42063),r=B(r,o,a,n,t[i+11],22,-1990404162),n=B(n,r,o,a,t[i+12],7,1804603682),a=B(a,n,r,o,t[i+13],12,-40341101),o=B(o,a,n,r,t[i+14],17,-1502002290),n=S(n,r=B(r,o,a,n,t[i+15],22,1236535329),o,a,t[i+1],5,-165796510),a=S(a,n,r,o,t[i+6],9,-1069501632),o=S(o,a,n,r,t[i+11],14,643717713),r=S(r,o,a,n,t[i],20,-373897302),n=S(n,r,o,a,t[i+5],5,-701558691),a=S(a,n,r,o,t[i+10],9,38016083),o=S(o,a,n,r,t[i+15],14,-660478335),r=S(r,o,a,n,t[i+4],20,-405537848),n=S(n,r,o,a,t[i+9],5,568446438),a=S(a,n,r,o,t[i+14],9,-1019803690),o=S(o,a,n,r,t[i+3],14,-187363961),r=S(r,o,a,n,t[i+8],20,1163531501),n=S(n,r,o,a,t[i+13],5,-1444681467),a=S(a,n,r,o,t[i+2],9,-51403784),o=S(o,a,n,r,t[i+7],14,1735328473),n=P(n,r=S(r,o,a,n,t[i+12],20,-1926607734),o,a,t[i+5],4,-378558),a=P(a,n,r,o,t[i+8],11,-2022574463),o=P(o,a,n,r,t[i+11],16,1839030562),r=P(r,o,a,n,t[i+14],23,-35309556),n=P(n,r,o,a,t[i+1],4,-1530992060),a=P(a,n,r,o,t[i+4],11,1272893353),o=P(o,a,n,r,t[i+7],16,-155497632),r=P(r,o,a,n,t[i+10],23,-1094730640),n=P(n,r,o,a,t[i+13],4,681279174),a=P(a,n,r,o,t[i],11,-358537222),o=P(o,a,n,r,t[i+3],16,-722521979),r=P(r,o,a,n,t[i+6],23,76029189),n=P(n,r,o,a,t[i+9],4,-640364487),a=P(a,n,r,o,t[i+12],11,-421815835),o=P(o,a,n,r,t[i+15],16,530742520),n=L(n,r=P(r,o,a,n,t[i+2],23,-995338651),o,a,t[i],6,-198630844),a=L(a,n,r,o,t[i+7],10,1126891415),o=L(o,a,n,r,t[i+14],15,-1416354905),r=L(r,o,a,n,t[i+5],21,-57434055),n=L(n,r,o,a,t[i+12],6,1700485571),a=L(a,n,r,o,t[i+3],10,-1894986606),o=L(o,a,n,r,t[i+10],15,-1051523),r=L(r,o,a,n,t[i+1],21,-2054922799),n=L(n,r,o,a,t[i+8],6,1873313359),a=L(a,n,r,o,t[i+15],10,-30611744),o=L(o,a,n,r,t[i+6],15,-1560198380),r=L(r,o,a,n,t[i+13],21,1309151649),n=L(n,r,o,a,t[i+4],6,-145523070),a=L(a,n,r,o,t[i+11],10,-1120210379),o=L(o,a,n,r,t[i+2],15,718787259),r=L(r,o,a,n,t[i+9],21,-343485551),n=w(n,s),r=w(r,c),o=w(o,u),a=w(a,d)}return[n,r,o,a]}(function(t){if(0===t.length)return[];for(var e=8*t.length,n=new Uint32Array(b(e)),r=0;r<e;r+=8)n[r>>5]|=(255&t[r/8])<<r%32;return n}(t),8*t.length))})),C=function(t,e,n){var r=(t=t||{}).random||(t.rng||a)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,e){n=n||0;for(var o=0;o<16;++o)e[n+o]=r[o];return e}return d(r)};function k(t,e,n,r){switch(t){case 0:return e&n^~e&r;case 1:case 3:return e^n^r;case 2:return e&n^e&r^n&r}}function F(t,e){return t<<e|t>>>32-e}const R=g("v5",80,(function(t){var e=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof t){var r=unescape(encodeURIComponent(t));t=[];for(var o=0;o<r.length;++o)t.push(r.charCodeAt(o))}else Array.isArray(t)||(t=Array.prototype.slice.call(t));t.push(128);for(var a=t.length/4+2,i=Math.ceil(a/16),s=new Array(i),c=0;c<i;++c){for(var u=new Uint32Array(16),d=0;d<16;++d)u[d]=t[64*c+4*d]<<24|t[64*c+4*d+1]<<16|t[64*c+4*d+2]<<8|t[64*c+4*d+3];s[c]=u}s[i-1][14]=8*(t.length-1)/Math.pow(2,32),s[i-1][14]=Math.floor(s[i-1][14]),s[i-1][15]=8*(t.length-1)&4294967295;for(var l=0;l<i;++l){for(var h=new Uint32Array(80),f=0;f<16;++f)h[f]=s[l][f];for(var p=16;p<80;++p)h[p]=F(h[p-3]^h[p-8]^h[p-14]^h[p-16],1);for(var v=n[0],y=n[1],g=n[2],b=n[3],w=n[4],m=0;m<80;++m){var B=Math.floor(m/20),S=F(v,5)+k(B,y,g,b)+w+e[B]+h[m]>>>0;w=b,b=g,g=F(y,30)>>>0,y=v,v=S}n[0]=n[0]+v>>>0,n[1]=n[1]+y>>>0,n[2]=n[2]+g>>>0,n[3]=n[3]+b>>>0,n[4]=n[4]+w>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]})),I="00000000-0000-0000-0000-000000000000",M=function(t){if(!s(t))throw TypeError("Invalid UUID");return parseInt(t.substr(14,1),16)}}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var a=e[r]={exports:{}};return t[r].call(a.exports,a,a.exports,n),a.exports}n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var r=n(623);CctLce=r})();