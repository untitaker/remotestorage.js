(function(){function c(c,d,e){a[c]=e;var f=c.substring(0,c.lastIndexOf("/")+1);b[c]=[];for(var g=0;g<d.length;g++)d[g].substring(0,2)=="./"&&(d[g]=d[g].substring(2)),b[c].push(f+d[g])}function d(c){if(c=="require")return function(){};var e=b[c],f={};for(var g=0;g<e.length;g++)f[e[g]]=d(e[g]);var h=[];for(var g=0;g<e.length;g++)h.push(f[e[g]]);return a[c].apply({},h)}var a={},b={};c("lib/platform",[],function(){function a(a){var b=!1,c;a.timeout&&(c=window.setTimeout(function(){b=!0,a.error("timeout")},a.timeout));var d=new XMLHttpRequest;a.method||(a.method="GET"),d.open(a.method,a.url,!0);if(a.headers)for(var e in a.headers)d.setRequestHeader(e,a.headers[e]);d.onreadystatechange=function(){d.readyState==4&&!b&&(c&&window.clearTimeout(c),d.status==200||d.status==201||d.status==204?a.success(d.responseText):a.error(d.status))},typeof a.data=="string"?d.send(a.data):d.send()}function b(a){var b=new XDomainRequest;b.timeout=a.timeout||3e3,b.open(a.method,a.url),b.onload=function(){b.status==200||b.status==201||b.status==204?a.success(xhr.responseText):a.error(xhr.status)},b.onerror=function(){err("unknown error")},b.ontimeout=function(){err(timeout)},a.data?b.send(a.data):b.send()}function c(a){var b=require("http"),c=require("https"),d=require("url");a.method||(a.method="GET"),a.data||(a.data=null);var e=d.parse(a.url),f={method:a.method,host:e.hostname,path:e.path,port:e.port?port:e.protocol=="https:"?443:80,headers:a.headers},g,h,i=e.protocol=="https:"?c:b,j=i.request(f,function(b){var c="";b.setEncoding("utf8"),b.on("data",function(a){c+=a}),b.on("end",function(){g&&clearTimeout(g),h||(b.statusCode==200||b.statusCode==201||b.statusCode==204?a.success(c):a.error(b.statusCode))})});j.on("error",function(b){a.error(b.message)}),a.timeout&&(g=setTimeout(function(){a.error("timeout"),h=!0},a.timeout)),a.data?j.end(a.data):j.end()}function d(a,b){var c=(new DOMParser).parseFromString(a,"text/xml"),d=c.getElementsByTagName("Link"),e={Link:[]};for(var f=0;f<d.length;f++){var g={};for(var h=0;h<d[f].attributes.length;h++)g[d[f].attributes[h].name]=d[f].attributes[h].value;g.rel&&e.Link.push({"@":g})}b(null,e)}function e(a,b){var c=require("xml2js");(new c.Parser).parseString(a,b)}return typeof window=="undefined"?{ajax:c,parseXml:e}:window.XDomainRequest?{ajax:b,parseXml:d}:{ajax:a,parseXml:d}}),c("lib/couch",["./platform"],function(a){function c(a){if(!b){try{b=JSON.parse(localStorage.getItem("_shadowCouchRev"))}catch(c){}b||(b={})}return b[a]}function d(a,c){if(!b)try{b=JSON.parse(localStorage.getItem("_shadowCouchRev"))}catch(d){}b||(b={}),b[a]=c,localStorage.setItem("_shadowCouchRev",JSON.stringify(b))}function e(b,c,d,e,f){var g={url:c,method:b,error:function(a){a==404?f(null,undefined):f(a,null)},success:function(a){f(null,a)},timeout:3e3};e&&(g.headers={Authorization:"Bearer "+e}),g.fields={withCredentials:"true"},b!="GET"&&(g.data=d),a.ajax(g)}function f(a,b,c){e("GET",a,null,b,function(b,e){if(b)c(b,e);else{var f;try{f=JSON.parse(e)}catch(g){}f&&f._rev?(d(a,f._rev),c(null,f.value)):typeof e=="undefined"?c(null,undefined):c("unparsable data from couch")}})}function g(a,b,f,g){var h=c(a),i={value:b};h&&(i._rev=h),e("PUT",a,JSON.stringify(i),f,function(c,h){if(c)c==409?e("GET",a,null,f,function(c,h){if(c)g("after 409, got a "+c);else{var j;try{j=JSON.parse(h)._rev}catch(k){}j?(i={value:b,_rev:j},d(a,j),e("PUT",a,JSON.stringify(i),f,function(a,b){a?g("after 409, second attempt got "+a):g(null)})):g("after 409, got unparseable JSON")}}):g(c);else{var i;try{i=JSON.parse(h)}catch(j){}i&&i.rev&&d(a,i.rev),g(null)}})}function h(a,b,f){var g=c(a);e("DELETE",a+(g?"?rev="+g:""),null,b,function(c,g){c==409?e("GET",a,null,b,function(c,g){if(c)f("after 409, got a "+c);else{var h;try{h=JSON.parse(g)._rev}catch(i){}h?(d(a,h),e("DELETE",a+"?rev="+h,null,b,function(b,c){b?f("after 409, second attempt got "+b):(d(a,undefined),f(null))})):f("after 409, got unparseable JSON")}}):(c||d(a,undefined),f(c))})}var b=null;return{get:f,put:g,"delete":h}}),c("lib/dav",["./platform"],function(a){function b(b,c,d,e,f,g){var h={url:c,method:b,error:function(a){a==404?f(null,undefined):f(a,null)},success:function(a){f(null,a)},timeout:3e3};h.headers={Authorization:"Bearer "+e,"Content-Type":"text/plain;charset=UTF-8"},h.fields={withCredentials:"true"},b!="GET"&&(h.data=d),a.ajax(h)}function c(a,c,d){b("GET",a,null,c,d)}function d(a,c,d,e){b("PUT",a,c,d,e)}function e(a,c,d){b("DELETE",a,null,c,d)}return{get:c,put:d,"delete":e}}),c("lib/webfinger",["./platform"],function(a){function b(a,b){var c=a.split("@");c.length<2?b("That is not a user address. There is no @-sign in it"):c.length>2?b("That is not a user address. There is more than one @-sign in it"):/^[\.0-9A-Za-z]+$/.test(c[0])?/^[\.0-9A-Za-z\-]+$/.test(c[1])?b(null,["https://"+c[1]+"/.well-known/host-meta","http://"+c[1]+"/.well-known/host-meta"]):b('That is not a user address. There are non-dotalphanumeric symbols after the @-sign: "'+c[1]+'"'):b('That is not a user address. There are non-dotalphanumeric symbols before the @-sign: "'+c[0]+'"')}function c(b,f,g){var h=b.shift();h?a.ajax({url:h,success:function(a){e(a,function(e,h){e?d(a,function(a,d){a?c(b,f,g):g(null,d)}):g(null,h)})},error:function(a){c(b,f,g)},timeout:f}):g("could not fetch xrd")}function d(b,c){a.parseXml(b,function(a,b){if(a)c(a);else if(b&&b.Link){var d={};if(b.Link&&b.Link["@"])b.Link["@"].rel&&(d[b.Link["@"].rel]=b.Link["@"]);else for(var e=0;e<b.Link.length;e++)b.Link[e]["@"]&&b.Link[e]["@"].rel&&(d[b.Link[e]["@"].rel]=b.Link[e]["@"]);c(null,d)}else c("found valid xml but with no Link elements in there")})}function e(a,b){var c;try{c=JSON.parse(a)}catch(d){b("not valid JSON");return}var e={};if(c&&c.links)for(var f=0;f<c.links.length;f++)e[c.links[f].rel]=c.links[f];b(null,e)}function f(a,d,e){b(a,function(b,f){b?e(err):c(f,d.timeout,function(b,f){if(b)e("could not fetch host-meta for "+a);else if(f.lrdd&&f.lrdd.template){var g=f.lrdd.template.split("{uri}"),h=[g.join("acct:"+a),g.join(a)];c(h,d.timeout,function(b,c){if(b)e("could not fetch lrdd for "+a);else if(c.remoteStorage&&c.remoteStorage.auth&&c.remoteStorage.api&&c.remoteStorage.template){var d={};if(c["remoteStorage"]["api"]=="simple")d.type="pds-remotestorage-00#simple";else if(c["remoteStorage"]["api"]=="WebDAV")d.type="pds-remotestorage-00#webdav";else if(c["remoteStorage"]["api"]=="CouchDB")d.type="pds-remotestorage-00#couchdb";else{e("api not recognized");return}var f=c.remoteStorage.template.split("{category}");f[0].substring(f[0].length-1)=="/"?d.href=f[0].substring(0,f[0].length-1):d.href=f[0],f.length==2&&f[1]!="/"&&(d.legacySuffix=f[1]),d.auth={type:"pds-oauth2-00",href:c.remoteStorage.auth},e(null,d)}else e("could not extract storageInfo from lrdd")})}else e("could not extract lrdd template from host-meta")})})}return{getStorageInfo:f}}),c("lib/hardcoded",["./platform"],function(a){function c(b,c,d){a.ajax({url:"http://proxy.unhosted.org/lookup?q=acct:"+b,success:function(a){var b;try{b=JSON.parse(a)}catch(c){}b?d(null,b):d("err: unparsable response from IrisCouch check")},error:function(a){d("err: during IrisCouch test:"+a)},timeout:c.timeout})}function d(a){var b=a.split("@");return["libredocs","mail","browserid","me"].indexOf(b[0])==-1?b[0]+"@iriscouch.com":b[2].substring(0,b[2].indexOf("."))+"@iriscouch.com"}function e(a,d,e){var f=a.split("@");if(f.length<2)e("That is not a user address. There is no @-sign in it");else if(f.length>2)e("That is not a user address. There is more than one @-sign in it");else if(!/^[\.0-9A-Za-z]+$/.test(f[0]))e('That is not a user address. There are non-dotalphanumeric symbols before the @-sign: "'+f[0]+'"');else if(!/^[\.0-9A-Za-z\-]+$/.test(f[1]))e('That is not a user address. There are non-dotalphanumeric symbols after the @-sign: "'+f[1]+'"');else{while(f[1].indexOf(".")!=-1){if(b[f[1]]){blueprint=b[f[1]],e(null,{type:"pds-remotestorage-00#"+blueprint.api,auth:{type:"pds-oauth2-00",href:blueprint.authPrefix+a},href:blueprint.templatePrefix+a});return}f[1]=f[1].substring(f[1].indexOf(".")+1)}new Date<new Date("9/9/2012")?c(a,d,e):e("err: not a guessable domain, and fakefinger-migration has ended")}}var b={"iriscouch.com":{api:"couchdb",authPrefix:"http://proxy.unhosted.org/OAuth.html?userAddress=",templatePrefix:"http://proxy.unhosted.org/IrisCouch/"}};return function(){var a={api:"simple",authPrefix:"http://surf.unhosted.org:4000/_oauth/",templatePrefix:"http://surf.unhosted.org:4000/"},c=["leidenuniv.nl","leiden.edu","uva.nl","vu.nl","eur.nl","maastrichtuniversity.nl","ru.nl","rug.nl","uu.nl","tudelft.nl","utwente.nl","tue.nl","tilburguniversity.edu","wur.nl","wageningenuniversity.nl","ou.nl","lumc.nl","amc.nl"];for(var d=0;d<c.length;d++)b[c[d]]=a}(),{guessStorageInfo:e}}),c("remoteStorage",["require","./lib/platform","./lib/couch","./lib/dav","./lib/webfinger","./lib/hardcoded"],function(a,b,c,d,e,f){var g=function(a,b){e.getStorageInfo(a,{timeout:3e3},function(c,d){c?f.guessStorageInfo(a,{timeout:3e3},function(a,c){b(a,c)}):b(c,d)})},h=function(a,b,c){if(a.type.split("#")[0]=="pds-remotestorage-00")scopeParts=b;else{scopeParts=[];for(category in b)category=="public"?scopeParts.push("legacy:full"):scopeParts.push(category+":full")}var d=["redirect_uri="+encodeURIComponent(c),"scope="+encodeURIComponent(scopeParts.join(",")),"response_type=token","client_id="+encodeURIComponent(c)];return a.auth.href+(a.auth.href.indexOf("?")===-1?"?":"&")+d.join("&")},i=function(a,b){b(a==="pds-remotestorage-00#couchdb"?c:d)},j=function(a,b,c,d){return a.href+"/"+b+"/"+c+a.legacySuffix?a.legacySuffix:"/"+(d[0]=="_"?"u":"")+d},k=function(a,b,c){return b=="public"?(zone="public",b="legacy"):zone="private",{get:function(d,e){typeof d!="string"?e('argument "key" should be a string'):i(a.type,function(f){f.get(j(a,zone,b,d),c,e)})},put:function(d,e,f){typeof d!="string"?f('argument "key" should be a string'):typeof e!="string"?f('argument "value" should be a string'):i(a.type,function(g){g.put(j(a,zone,b,d),e,c,f)})},"delete":function(d,e){typeof d!="string"?e('argument "key" should be a string'):i(a.type,function(f){f["delete"](j(a,zone,b,d),c,e)})}}},l=function(){var a,b;if(location.hash.length>0){a=location.hash.split("&");for(var c=0;c<a.length;c++){a[c][0]=="#"&&(a[c]=a[c].substring(1));if(a[c].substring(0,"access_token=".length)=="access_token=")return a[c].substring("access_token=".length)}}return null};return{getStorageInfo:g,createOAuthAddress:h,createClient:k,receiveToken:l}}),remoteStorage=d("remoteStorage")})()