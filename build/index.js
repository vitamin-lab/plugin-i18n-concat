"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1;descriptor.configurable=!0;"value"in descriptor&&(descriptor.writable=!0);Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){protoProps&&defineProperties(Constructor.prototype,protoProps);staticProps&&defineProperties(Constructor,staticProps);return Constructor}}();var exec=require("child_process").exec,merge=require("merge"),promise=require("promise"),jsonFileRegex=/.i18n_(.*).json$/i,I18nPlugin=function(){function I18nPlugin(options){!function(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,I18nPlugin);this.assetsPath=options.assetsPath;this.fileName=options.fileName}_createClass(I18nPlugin,[{key:"apply",value:function(compiler){var contentByLang={},assetsPath=this.assetsPath,fileName=this.fileName,mergeByLang=function(paths){var promises=[],promise=void 0,lang=void 0;paths.map(function(filePath){lang=jsonFileRegex.exec(filePath)[1];var path;(promise=(path=filePath,new Promise(function(resolve,reject){exec("cat "+path,function(error,stdout,stderr){error?reject(new Error(stderr)):resolve(JSON.parse(stdout))})}))).then(function(lang){return function(content){!contentByLang[lang]&&(contentByLang[lang]={});contentByLang[lang]=merge(contentByLang[lang],content)}}(lang));promises.push(promise)});return Promise.all(promises)};compiler.plugin("emit",function(compilation,callback){var exportToJson=function(lang){compilation.assets[fileName+".i18n_"+lang+".json"]={filePath:function(){return fileName+".i18n_"+lang+".json"},source:function(){return JSON.stringify(contentByLang[lang])},size:function(){return 1}}};new promise(function(resolve,reject){exec("find "+assetsPath+' -name "*.i18n_*.json"',function(error,stdout,stderr){error?reject(new Error(stderr)):resolve(stdout.split("\n").filter(function(path){return jsonFileRegex.exec(path)}))})}).then(mergeByLang).then(function(){return Object.keys(contentByLang).forEach(exportToJson)}).done(callback)})}}]);return I18nPlugin}();module.exports=I18nPlugin;