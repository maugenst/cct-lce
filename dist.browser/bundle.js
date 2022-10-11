(()=>{var t={599:t=>{"use strict";const{AbortController:e,AbortSignal:n}="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0;t.exports=e,t.exports.AbortSignal=n,t.exports.default=e},300:(t,e)=>{"use strict";var n=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==n)return n;throw new Error("unable to locate global object")}();t.exports=e=n.fetch,n.fetch&&(e.default=n.fetch.bind(n)),e.Headers=n.Headers,e.Request=n.Request,e.Response=n.Response},395:(t,e)=>{"use strict";var n;Object.defineProperty(e,"__esModule",{value:!0}),e.BandwidthMode=void 0,(n=e.BandwidthMode||(e.BandwidthMode={})).big="big",n.small="small"},898:(t,e)=>{"use strict";var n;Object.defineProperty(e,"__esModule",{value:!0}),e.Speed=void 0,(n=e.Speed||(e.Speed={})).good="GOOD",n.ok="OK",n.bad="BAD",n.nothing="NOTHING"},623:function(t,e,n){"use strict";var r=this&&this.__assign||function(){return r=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var a in e=arguments[n])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t},r.apply(this,arguments)},a=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(a,i){function o(t){try{c(r.next(t))}catch(t){i(t)}}function s(t){try{c(r.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,s)}c((r=r.apply(t,e||[])).next())}))},i=this&&this.__generator||function(t,e){var n,r,a,i,o={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,r&&(a=2&i[0]?r.return:i[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,i[1])).done)return a;switch(r=0,a&&(i=[2&i[0],a.value]),i[0]){case 0:case 1:a=i;break;case 4:return o.label++,{value:i[1],done:!1};case 5:o.label++,r=i[1],i=[0];continue;case 7:i=o.ops.pop(),o.trys.pop();continue;default:if(!((a=(a=o.trys).length>0&&a[a.length-1])||6!==i[0]&&2!==i[0])){o=0;continue}if(3===i[0]&&(!a||i[1]>a[0]&&i[1]<a[3])){o.label=i[1];break}if(6===i[0]&&o.label<a[1]){o.label=a[1],a=i;break}if(a&&o.label<a[2]){o.label=a[2],o.ops.push(i);break}a[2]&&o.ops.pop(),o.trys.pop();continue}i=e.call(t,o)}catch(t){i=[6,t],r=0}finally{n=a=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},o=this&&this.__spreadArray||function(t,e,n){if(n||2===arguments.length)for(var r,a=0,i=e.length;a<i;a++)!r&&a in e||(r||(r=Array.prototype.slice.call(e,0,a)),r[a]=e[a]);return t.concat(r||Array.prototype.slice.call(e))};Object.defineProperty(e,"__esModule",{value:!0}),e.CCT=void 0;var s=n(614),c=n(300),u=n(898),d=n(940),l=n(944),h=n(395),f="CCT_DATA",p=function(){function t(){this.storage=[],this.runningLatency=!1,this.runningBandwidth=!1}return t.prototype.fetchDatacenterInformationRequest=function(t){return a(this,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:return e.trys.push([0,2,,3]),[4,(0,c.default)(t).then((function(t){return t.json()}))];case 1:return[2,e.sent()];case 2:return e.sent(),[2,[]];case 3:return[2]}}))}))},t.prototype.fetchDatacenterInformation=function(t){return a(this,void 0,void 0,(function(){var e;return i(this,(function(n){switch(n.label){case 0:return e=this,[4,this.fetchDatacenterInformationRequest(t)];case 1:return e.allDatacenters=n.sent(),this.datacenters=this.allDatacenters,this.storage=this.allDatacenters.map((function(t){return{id:t.id,latencies:[],bandwidths:[],shouldSave:!1}})),this.clean(),this.readLocalStorage(),this.lce=new d.LCE(this.datacenters),[2]}}))}))},t.prototype.setFilters=function(t){this.datacenters=t?this.allDatacenters.filter((function(e){return Object.keys(t).every((function(n){return t[n].includes(e[n])}))})):this.allDatacenters,this.lce=new d.LCE(this.datacenters)},t.prototype.stopMeasurements=function(){this.runningLatency=!1,this.runningBandwidth=!1,this.lce.terminate()},t.prototype.startLatencyChecks=function(t,e){return void 0===e&&(e=!1),a(this,void 0,void 0,(function(){return i(this,(function(n){switch(n.label){case 0:return this.runningLatency=!0,[4,this.startMeasurementForLatency(t,e)];case 1:return n.sent(),this.runningLatency=!1,[2]}}))}))},t.prototype.startMeasurementForLatency=function(t,e){var n;return a(this,void 0,void 0,(function(){var r,a,o,s,c;return i(this,(function(u){switch(u.label){case 0:r=0,u.label=1;case 1:if(!(r<t))return[3,6];a=function(t){var r,a,s,c;return i(this,(function(i){switch(i.label){case 0:return r=o.datacenters[t],[4,o.lce.getLatencyForId(r.id)];case 1:return a=i.sent(),o.runningLatency?(a&&a.latency&&(s=o.datacenters.findIndex((function(t){return t.id===r.id})),null===(n=o.datacenters[s].latencies)||void 0===n||n.push(a.latency),c=l.Util.getAverageLatency(o.datacenters[s].latencies),o.datacenters[s].averageLatency=c,o.datacenters[s].latencyJudgement=o.judgeLatency(c),o.addDataToStorage(r.id,a.latency),e&&o.setLocalStorage()),[2]):[2,{value:void 0}]}}))},o=this,s=0,u.label=2;case 2:return s<this.datacenters.length?[5,a(s)]:[3,5];case 3:if("object"==typeof(c=u.sent()))return[2,c.value];u.label=4;case 4:return s++,[3,2];case 5:return r++,[3,1];case 6:return[2]}}))}))},t.prototype.startBandwidthChecks=function(t){var e=t.datacenter,n=t.iterations,r=t.bandwidthMode,o=t.saveToLocalStorage,s=void 0!==o&&o;return a(this,void 0,void 0,(function(){var t,a=this;return i(this,(function(i){switch(i.label){case 0:return this.runningBandwidth=!0,Array.isArray(e)?(t=[],e.forEach((function(e){t.push(a.startMeasurementForBandwidth(e,n,r,s))})),[4,Promise.all(t)]):[3,2];case 1:return i.sent(),[3,4];case 2:return[4,this.startMeasurementForBandwidth(e,n,r,s)];case 3:i.sent(),i.label=4;case 4:return this.runningBandwidth=!1,[2]}}))}))},t.prototype.startMeasurementForBandwidth=function(t,e,n,r){var o;return void 0===n&&(n=h.BandwidthMode.big),a(this,void 0,void 0,(function(){var a,s,c,u;return i(this,(function(i){switch(i.label){case 0:a=0,i.label=1;case 1:return a<e?[4,this.lce.getBandwidthForId(t.id,{bandwidthMode:n})]:[3,4];case 2:if(s=i.sent(),!this.runningBandwidth)return[2];s&&s.bandwidth&&(c=this.datacenters.findIndex((function(e){return e.id===t.id})),null===(o=this.datacenters[c].bandwidths)||void 0===o||o.push(s.bandwidth),u=l.Util.getAverageBandwidth(this.datacenters[c].bandwidths),this.datacenters[c].averageBandwidth=u,this.datacenters[c].bandwidthJudgement=this.judgeBandwidth(u),this.addDataToStorage(t.id,s.bandwidth),r&&this.setLocalStorage()),i.label=3;case 3:return a++,[3,1];case 4:return[2]}}))}))},t.prototype.judgeLatency=function(t){return t<170?u.Speed.good:t>=170&&t<280?u.Speed.ok:u.Speed.bad},t.prototype.judgeBandwidth=function(t){return t.megaBitsPerSecond>1?u.Speed.good:t.megaBitsPerSecond<=1&&t.megaBitsPerSecond>.3?u.Speed.ok:u.Speed.bad},t.prototype.getCurrentDatacentersSorted=function(){return l.Util.sortDatacenters(this.datacenters),this.datacenters},t.prototype.getAddress=function(){return a(this,void 0,void 0,(function(){var t,e=this;return i(this,(function(n){return t={address:"",latitude:0,longitude:0},[2,new Promise((function(n){navigator&&(null===navigator||void 0===navigator?void 0:navigator.geolocation)?navigator.geolocation.getCurrentPosition((function(r){return a(e,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:return t.latitude=r.coords.latitude,t.longitude=r.coords.longitude,[4,(new google.maps.Geocoder).geocode({location:new google.maps.LatLng(t.latitude,t.longitude)},(function(e,r){"OK"===r?(t.address=e[0].formatted_address,n(t)):(t.address="",t.latitude=0,t.longitude=0,n(t))}))];case 1:return e.sent(),[2]}}))}))}),(function(){n(t)})):n(t)}))]}))}))},t.prototype.storeRequest=function(t){return a(this,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:return[4,(0,c.default)("https://cct.demo-education.cloud.sap/measurement",{method:"post",body:t,headers:{"Content-Type":"application/json"}}).then((function(t){return t.json()}))];case 1:return[2,e.sent()]}}))}))},t.prototype.store=function(t){return void 0===t&&(t={address:"Dietmar-Hopp-Allee 16, 69190 Walldorf, Germany",latitude:49.2933756,longitude:8.6421212}),a(this,void 0,void 0,(function(){var e,n;return i(this,(function(r){switch(r.label){case 0:e=[],this.storage=this.storage.map((function(t){var n;return t.shouldSave?(e.push({id:t.id,latency:"".concat(null===(n=l.Util.getAverageLatency(t.latencies))||void 0===n?void 0:n.toFixed(2)),averageBandwidth:l.Util.getAverageBandwidth(t.bandwidths).megaBitsPerSecond.toFixed(2)}),{id:t.id,latencies:[],bandwidths:[],shouldSave:!1}):t})),n=JSON.stringify({uid:(0,s.v4)(),address:t.address,latitude:t.latitude,longitude:t.longitude,data:e},null,4),r.label=1;case 1:return r.trys.push([1,3,,4]),[4,this.storeRequest(n)];case 2:return[2,"OK"===r.sent().status];case 3:return r.sent(),[2,!1];case 4:return[2]}}))}))},t.prototype.addDataToStorage=function(t,e){this.storage=this.storage.map((function(n){if(n.id===t){var r="number"==typeof e,a=r?o(o([],n.latencies,!0),[e],!1):n.latencies,i=r?n.bandwidths:o(o([],n.bandwidths,!0),[e],!1);return{id:n.id,latencies:a,bandwidths:i,shouldSave:a.length>=16}}return n}))},t.prototype.setLocalStorage=function(){window.localStorage.clear();var t=this.allDatacenters.map((function(t){return{id:t.id,latencies:t.latencies,averageLatency:t.averageLatency,latencyJudgement:t.latencyJudgement,bandwidths:t.bandwidths,averageBandwidth:t.averageBandwidth,bandwidthJudgement:t.bandwidthJudgement}}));window.localStorage.setItem(f,JSON.stringify(t))},t.prototype.readLocalStorage=function(){var t=window.localStorage.getItem(f);if(t){var e=JSON.parse(t);this.allDatacenters=this.allDatacenters.map((function(t){var n=e.find((function(e){return e.id===t.id}));return n?r(r({},t),{averageLatency:n.averageLatency,latencyJudgement:n.latencyJudgement,averageBandwidth:n.averageBandwidth,bandwidthJudgement:n.bandwidthJudgement,latencies:n.latencies,bandwidths:n.bandwidths}):t})),window.localStorage.clear()}},t.prototype.clean=function(){this.datacenters.forEach((function(t){t.position=0,t.averageLatency=0,t.averageBandwidth={bitsPerSecond:0,kiloBitsPerSecond:0,megaBitsPerSecond:0},t.latencies=[],t.bandwidths=[]}))},t}();e.CCT=p},940:function(t,e,n){"use strict";var r=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(a,i){function o(t){try{c(r.next(t))}catch(t){i(t)}}function s(t){try{c(r.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,s)}c((r=r.apply(t,e||[])).next())}))},a=this&&this.__generator||function(t,e){var n,r,a,i,o={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,r&&(a=2&i[0]?r.return:i[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,i[1])).done)return a;switch(r=0,a&&(i=[2&i[0],a.value]),i[0]){case 0:case 1:a=i;break;case 4:return o.label++,{value:i[1],done:!1};case 5:o.label++,r=i[1],i=[0];continue;case 7:i=o.ops.pop(),o.trys.pop();continue;default:if(!((a=(a=o.trys).length>0&&a[a.length-1])||6!==i[0]&&2!==i[0])){o=0;continue}if(3===i[0]&&(!a||i[1]>a[0]&&i[1]<a[3])){o.label=i[1];break}if(6===i[0]&&o.label<a[1]){o.label=a[1],a=i;break}if(a&&o.label<a[2]){o.label=a[2],o.ops.push(i);break}a[2]&&o.ops.pop(),o.trys.pop();continue}i=e.call(t,o)}catch(t){i=[6,t],r=0}finally{n=a=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};Object.defineProperty(e,"__esModule",{value:!0}),e.LCE=void 0;var i=n(300),o=n(395),s=n(599),c=function(){function t(t){this.datacenters=t,this.cancelableLatencyRequests=[],this.cancelableBandwidthRequests=[],this.terminateAllCalls=!1}return t.prototype.runLatencyCheckForAll=function(){return r(this,void 0,void 0,(function(){var t,e,n,r=this;return a(this,(function(a){switch(a.label){case 0:return t=[],this.datacenters.forEach((function(e){t.push(r.getLatencyFor(e))})),[4,Promise.all(t)];case 1:return e=a.sent(),(n=e.filter((function(t){return null!==t}))).sort(this.compare),this.cancelableLatencyRequests=[],[2,n]}}))}))},t.prototype.runBandwidthCheckForAll=function(){return r(this,void 0,void 0,(function(){var t,e,n,r,i;return a(this,(function(a){switch(a.label){case 0:t=[],e=0,n=this.datacenters,a.label=1;case 1:return e<n.length?(r=n[e],this.terminateAllCalls?[3,4]:[4,this.getBandwidthFor(r)]):[3,4];case 2:(i=a.sent())&&t.push(i),a.label=3;case 3:return e++,[3,1];case 4:return this.cancelableBandwidthRequests=[],[2,t]}}))}))},t.prototype.getBandwidthForId=function(t,e){var n=this.datacenters.find((function(e){return e.id===t}));return n?this.getBandwidthFor(n,e):null},t.prototype.getLatencyForId=function(t){var e=this.datacenters.find((function(e){return e.id===t}));return e?this.getLatencyFor(e):null},t.prototype.getLatencyFor=function(t){return r(this,void 0,void 0,(function(){var e,n;return a(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),e=Date.now(),[4,this.latencyFetch("https://".concat(t.ip,"/drone/index.html"))];case 1:return r.sent(),n=Date.now(),[2,{id:t.id,latency:n-e,cloud:t.cloud,name:t.name,town:t.town,country:t.country,latitude:t.latitude,longitude:t.longitude,ip:t.ip,timestamp:Date.now()}];case 2:return r.sent(),[2,null];case 3:return[2]}}))}))},t.prototype.getBandwidthFor=function(e,n){return void 0===n&&(n={bandwidthMode:o.BandwidthMode.big}),r(this,void 0,void 0,(function(){var r,i,o,s,c,u;return a(this,(function(a){switch(a.label){case 0:return r=Date.now(),[4,this.bandwidthFetch("https://".concat(e.ip,"/drone/").concat(n.bandwidthMode))];case 1:if(null===(i=a.sent()))return[3,6];o=Date.now(),s=void 0,a.label=2;case 2:return a.trys.push([2,4,,5]),[4,i.text()];case 3:return s=a.sent(),[3,5];case 4:return c=a.sent(),console.log(c),[2,null];case 5:return u=t.calcBandwidth(s.length,o-r),[2,{id:e.id,bandwidth:u,cloud:e.cloud,name:e.name,town:e.town,country:e.country,latitude:e.latitude,longitude:e.longitude,ip:e.ip}];case 6:return[2,null]}}))}))},t.prototype.bandwidthFetch=function(t){var e=new s.default,n=e.signal;return this.cancelableBandwidthRequests.push(e),this.abortableFetch(t,n)},t.prototype.latencyFetch=function(t){var e=new s.default,n=e.signal;return this.cancelableLatencyRequests.push(e),this.abortableFetch(t,n)},t.prototype.abortableFetch=function(t,e){return r(this,void 0,void 0,(function(){var n;return a(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,(0,i.default)(t,{signal:e})];case 1:return[2,r.sent()];case 2:return n=r.sent(),console.log(n),[2,null];case 3:return[2]}}))}))},t.prototype.compare=function(t,e){return t.latency<e.latency?-1:t.latency>e.latency?1:0},t.prototype.terminate=function(){this.terminateAllCalls=!0,this.cancelableLatencyRequests.forEach((function(t){t.abort()})),this.cancelableBandwidthRequests.forEach((function(t){t.abort()})),this.cancelableLatencyRequests=[],this.cancelableBandwidthRequests=[],this.terminateAllCalls=!1},t.calcBandwidth=function(t,e){var n=8*t/(e/1e3),r=n/1e3;return{bitsPerSecond:n,kiloBitsPerSecond:r,megaBitsPerSecond:r/1e3}},t}();e.LCE=c},944:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Util=void 0;var n=function(){function t(){}return t.getAverageLatency=function(t){return t?t.reduce((function(t,e){return t+e}),0)/t.length:-1},t.getAverageBandwidth=function(t){if(t&&t.length){var e=t.reduce((function(t,e){return{bitsPerSecond:t.bitsPerSecond+e.bitsPerSecond,kiloBitsPerSecond:t.kiloBitsPerSecond+e.kiloBitsPerSecond,megaBitsPerSecond:t.megaBitsPerSecond+e.megaBitsPerSecond}}));return{bitsPerSecond:e.bitsPerSecond/t.length,kiloBitsPerSecond:e.kiloBitsPerSecond/t.length,megaBitsPerSecond:e.megaBitsPerSecond/t.length}}return{bitsPerSecond:-1,kiloBitsPerSecond:-1,megaBitsPerSecond:-1}},t.sortDatacenters=function(t){return t.sort((function(t,e){return t.averageLatency-e.averageLatency})),t.forEach((function(t,e){t.position=e+1})),t},t.getTop3=function(e){return t.sortDatacenters(e).slice(0,3)},t.sleep=function(t){return new Promise((function(e){return setTimeout(e,t)}))},t}();e.Util=n},614:(t,e,n)=>{"use strict";var r;n.r(e),n.d(e,{NIL:()=>F,parse:()=>g,stringify:()=>d,v1:()=>v,v3:()=>A,v4:()=>C,v5:()=>I,validate:()=>s,version:()=>M});var a=new Uint8Array(16);function i(){if(!r&&!(r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(a)}const o=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,s=function(t){return"string"==typeof t&&o.test(t)};for(var c=[],u=0;u<256;++u)c.push((u+256).toString(16).substr(1));const d=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(c[t[e+0]]+c[t[e+1]]+c[t[e+2]]+c[t[e+3]]+"-"+c[t[e+4]]+c[t[e+5]]+"-"+c[t[e+6]]+c[t[e+7]]+"-"+c[t[e+8]]+c[t[e+9]]+"-"+c[t[e+10]]+c[t[e+11]]+c[t[e+12]]+c[t[e+13]]+c[t[e+14]]+c[t[e+15]]).toLowerCase();if(!s(n))throw TypeError("Stringified UUID is invalid");return n};var l,h,f=0,p=0;const v=function(t,e,n){var r=e&&n||0,a=e||new Array(16),o=(t=t||{}).node||l,s=void 0!==t.clockseq?t.clockseq:h;if(null==o||null==s){var c=t.random||(t.rng||i)();null==o&&(o=l=[1|c[0],c[1],c[2],c[3],c[4],c[5]]),null==s&&(s=h=16383&(c[6]<<8|c[7]))}var u=void 0!==t.msecs?t.msecs:Date.now(),v=void 0!==t.nsecs?t.nsecs:p+1,g=u-f+(v-p)/1e4;if(g<0&&void 0===t.clockseq&&(s=s+1&16383),(g<0||u>f)&&void 0===t.nsecs&&(v=0),v>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");f=u,p=v,h=s;var y=(1e4*(268435455&(u+=122192928e5))+v)%4294967296;a[r++]=y>>>24&255,a[r++]=y>>>16&255,a[r++]=y>>>8&255,a[r++]=255&y;var w=u/4294967296*1e4&268435455;a[r++]=w>>>8&255,a[r++]=255&w,a[r++]=w>>>24&15|16,a[r++]=w>>>16&255,a[r++]=s>>>8|128,a[r++]=255&s;for(var b=0;b<6;++b)a[r+b]=o[b];return e||d(a)},g=function(t){if(!s(t))throw TypeError("Invalid UUID");var e,n=new Uint8Array(16);return n[0]=(e=parseInt(t.slice(0,8),16))>>>24,n[1]=e>>>16&255,n[2]=e>>>8&255,n[3]=255&e,n[4]=(e=parseInt(t.slice(9,13),16))>>>8,n[5]=255&e,n[6]=(e=parseInt(t.slice(14,18),16))>>>8,n[7]=255&e,n[8]=(e=parseInt(t.slice(19,23),16))>>>8,n[9]=255&e,n[10]=(e=parseInt(t.slice(24,36),16))/1099511627776&255,n[11]=e/4294967296&255,n[12]=e>>>24&255,n[13]=e>>>16&255,n[14]=e>>>8&255,n[15]=255&e,n};function y(t,e,n){function r(t,r,a,i){if("string"==typeof t&&(t=function(t){t=unescape(encodeURIComponent(t));for(var e=[],n=0;n<t.length;++n)e.push(t.charCodeAt(n));return e}(t)),"string"==typeof r&&(r=g(r)),16!==r.length)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");var o=new Uint8Array(16+t.length);if(o.set(r),o.set(t,r.length),(o=n(o))[6]=15&o[6]|e,o[8]=63&o[8]|128,a){i=i||0;for(var s=0;s<16;++s)a[i+s]=o[s];return a}return d(o)}try{r.name=t}catch(t){}return r.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",r.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",r}function w(t){return 14+(t+64>>>9<<4)+1}function b(t,e){var n=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(n>>16)<<16|65535&n}function m(t,e,n,r,a,i){return b((o=b(b(e,t),b(r,i)))<<(s=a)|o>>>32-s,n);var o,s}function S(t,e,n,r,a,i,o){return m(e&n|~e&r,t,e,a,i,o)}function B(t,e,n,r,a,i,o){return m(e&r|n&~r,t,e,a,i,o)}function L(t,e,n,r,a,i,o){return m(e^n^r,t,e,a,i,o)}function P(t,e,n,r,a,i,o){return m(n^(e|~r),t,e,a,i,o)}const A=y("v3",48,(function(t){if("string"==typeof t){var e=unescape(encodeURIComponent(t));t=new Uint8Array(e.length);for(var n=0;n<e.length;++n)t[n]=e.charCodeAt(n)}return function(t){for(var e=[],n=32*t.length,r="0123456789abcdef",a=0;a<n;a+=8){var i=t[a>>5]>>>a%32&255,o=parseInt(r.charAt(i>>>4&15)+r.charAt(15&i),16);e.push(o)}return e}(function(t,e){t[e>>5]|=128<<e%32,t[w(e)-1]=e;for(var n=1732584193,r=-271733879,a=-1732584194,i=271733878,o=0;o<t.length;o+=16){var s=n,c=r,u=a,d=i;n=S(n,r,a,i,t[o],7,-680876936),i=S(i,n,r,a,t[o+1],12,-389564586),a=S(a,i,n,r,t[o+2],17,606105819),r=S(r,a,i,n,t[o+3],22,-1044525330),n=S(n,r,a,i,t[o+4],7,-176418897),i=S(i,n,r,a,t[o+5],12,1200080426),a=S(a,i,n,r,t[o+6],17,-1473231341),r=S(r,a,i,n,t[o+7],22,-45705983),n=S(n,r,a,i,t[o+8],7,1770035416),i=S(i,n,r,a,t[o+9],12,-1958414417),a=S(a,i,n,r,t[o+10],17,-42063),r=S(r,a,i,n,t[o+11],22,-1990404162),n=S(n,r,a,i,t[o+12],7,1804603682),i=S(i,n,r,a,t[o+13],12,-40341101),a=S(a,i,n,r,t[o+14],17,-1502002290),n=B(n,r=S(r,a,i,n,t[o+15],22,1236535329),a,i,t[o+1],5,-165796510),i=B(i,n,r,a,t[o+6],9,-1069501632),a=B(a,i,n,r,t[o+11],14,643717713),r=B(r,a,i,n,t[o],20,-373897302),n=B(n,r,a,i,t[o+5],5,-701558691),i=B(i,n,r,a,t[o+10],9,38016083),a=B(a,i,n,r,t[o+15],14,-660478335),r=B(r,a,i,n,t[o+4],20,-405537848),n=B(n,r,a,i,t[o+9],5,568446438),i=B(i,n,r,a,t[o+14],9,-1019803690),a=B(a,i,n,r,t[o+3],14,-187363961),r=B(r,a,i,n,t[o+8],20,1163531501),n=B(n,r,a,i,t[o+13],5,-1444681467),i=B(i,n,r,a,t[o+2],9,-51403784),a=B(a,i,n,r,t[o+7],14,1735328473),n=L(n,r=B(r,a,i,n,t[o+12],20,-1926607734),a,i,t[o+5],4,-378558),i=L(i,n,r,a,t[o+8],11,-2022574463),a=L(a,i,n,r,t[o+11],16,1839030562),r=L(r,a,i,n,t[o+14],23,-35309556),n=L(n,r,a,i,t[o+1],4,-1530992060),i=L(i,n,r,a,t[o+4],11,1272893353),a=L(a,i,n,r,t[o+7],16,-155497632),r=L(r,a,i,n,t[o+10],23,-1094730640),n=L(n,r,a,i,t[o+13],4,681279174),i=L(i,n,r,a,t[o],11,-358537222),a=L(a,i,n,r,t[o+3],16,-722521979),r=L(r,a,i,n,t[o+6],23,76029189),n=L(n,r,a,i,t[o+9],4,-640364487),i=L(i,n,r,a,t[o+12],11,-421815835),a=L(a,i,n,r,t[o+15],16,530742520),n=P(n,r=L(r,a,i,n,t[o+2],23,-995338651),a,i,t[o],6,-198630844),i=P(i,n,r,a,t[o+7],10,1126891415),a=P(a,i,n,r,t[o+14],15,-1416354905),r=P(r,a,i,n,t[o+5],21,-57434055),n=P(n,r,a,i,t[o+12],6,1700485571),i=P(i,n,r,a,t[o+3],10,-1894986606),a=P(a,i,n,r,t[o+10],15,-1051523),r=P(r,a,i,n,t[o+1],21,-2054922799),n=P(n,r,a,i,t[o+8],6,1873313359),i=P(i,n,r,a,t[o+15],10,-30611744),a=P(a,i,n,r,t[o+6],15,-1560198380),r=P(r,a,i,n,t[o+13],21,1309151649),n=P(n,r,a,i,t[o+4],6,-145523070),i=P(i,n,r,a,t[o+11],10,-1120210379),a=P(a,i,n,r,t[o+2],15,718787259),r=P(r,a,i,n,t[o+9],21,-343485551),n=b(n,s),r=b(r,c),a=b(a,u),i=b(i,d)}return[n,r,a,i]}(function(t){if(0===t.length)return[];for(var e=8*t.length,n=new Uint32Array(w(e)),r=0;r<e;r+=8)n[r>>5]|=(255&t[r/8])<<r%32;return n}(t),8*t.length))})),C=function(t,e,n){var r=(t=t||{}).random||(t.rng||i)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,e){n=n||0;for(var a=0;a<16;++a)e[n+a]=r[a];return e}return d(r)};function D(t,e,n,r){switch(t){case 0:return e&n^~e&r;case 1:case 3:return e^n^r;case 2:return e&n^e&r^n&r}}function k(t,e){return t<<e|t>>>32-e}const I=y("v5",80,(function(t){var e=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof t){var r=unescape(encodeURIComponent(t));t=[];for(var a=0;a<r.length;++a)t.push(r.charCodeAt(a))}else Array.isArray(t)||(t=Array.prototype.slice.call(t));t.push(128);for(var i=t.length/4+2,o=Math.ceil(i/16),s=new Array(o),c=0;c<o;++c){for(var u=new Uint32Array(16),d=0;d<16;++d)u[d]=t[64*c+4*d]<<24|t[64*c+4*d+1]<<16|t[64*c+4*d+2]<<8|t[64*c+4*d+3];s[c]=u}s[o-1][14]=8*(t.length-1)/Math.pow(2,32),s[o-1][14]=Math.floor(s[o-1][14]),s[o-1][15]=8*(t.length-1)&4294967295;for(var l=0;l<o;++l){for(var h=new Uint32Array(80),f=0;f<16;++f)h[f]=s[l][f];for(var p=16;p<80;++p)h[p]=k(h[p-3]^h[p-8]^h[p-14]^h[p-16],1);for(var v=n[0],g=n[1],y=n[2],w=n[3],b=n[4],m=0;m<80;++m){var S=Math.floor(m/20),B=k(v,5)+D(S,g,y,w)+b+e[S]+h[m]>>>0;b=w,w=y,y=k(g,30)>>>0,g=v,v=B}n[0]=n[0]+v>>>0,n[1]=n[1]+g>>>0,n[2]=n[2]+y>>>0,n[3]=n[3]+w>>>0,n[4]=n[4]+b>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]})),F="00000000-0000-0000-0000-000000000000",M=function(t){if(!s(t))throw TypeError("Invalid UUID");return parseInt(t.substr(14,1),16)}}},e={};function n(r){var a=e[r];if(void 0!==a)return a.exports;var i=e[r]={exports:{}};return t[r].call(i.exports,i,i.exports,n),i.exports}n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var r=n(623);CctLce=r})();