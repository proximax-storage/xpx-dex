(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-74c3efe8"],{"8d83e":function(e,a,t){"use strict";t.r(a);var s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("v-col",{attrs:{cols:"12"}},[t("v-select",{staticClass:"pt-1",attrs:{items:e.itemsNamespace,"item-disabled":e.itemsNamespace.disabled,"item-text":"namespaceName.name","item-value":"idToHex",loading:e.loading,attach:"",dense:"",color:e.inputStyle,hint:e.form.selectNamespace.namespaceName.name+", alias: ("+e.form.selectNamespace.aliasType+")","persistent-hint":"","return-object":"",label:"Select name (optional)"},on:{change:function(a){return e.triggerClick(a)}},model:{value:e.form.selectNamespace,callback:function(a){e.$set(e.form,"selectNamespace",a)},expression:"form.selectNamespace"}})],1)},c=[],n=(t("99af"),t("d81d"),t("b0c0"),t("5530")),o=t("5220"),m=t("2f62"),i={data:function(){return{inputStyle:"inputStyle",form:{selectNamespace:null},rootNamespace:[{namespaceInfo:null,namespaceName:{name:"New Root Namespace"},idToHex:null,disabled:!1,aliasType:"none"}]}},computed:Object(n["a"])(Object(n["a"])(Object(n["a"])({},Object(m["c"])("namespaceStore",["namespacesFromAddress","loading"])),Object(m["c"])("accountStore",["currentAccount"])),{},{itemsNamespace:function(){return this.getNamespacesFromAddress()},errorSelect:function(){var e=!1;return this.form.selectNamespace.namespaceInfo&&(e=this.form.selectNamespace.namespaceInfo.hasAlias()),e}}),methods:{disabledNamespaceList:function(e){var a=e.map((function(e){return{namespaceName:{name:e.namespaceName.name},disabled:Boolean(!e.namespaceInfo.active||3===e.namespaceInfo.depth),idToHex:e.idToHex,namespaceInfo:e.namespaceInfo,aliasType:e.namespaceInfo.hasAlias()?Object(o["a"])(e.namespaceInfo.alias.type):"none"}}));return a},getNamespacesFromAddress:function(){var e=null,a=this.rootNamespace;return e=this.namespacesFromAddress(this.currentAccount.simpleWallet.address.address),e&&(a=this.rootNamespace.concat(this.disabledNamespaceList(e))),a},triggerClick:function(e){this.$emit("action",e)}},beforeMount:function(){this.form.selectNamespace=this.rootNamespace[0],this.$emit("action",this.form.selectNamespace)}},r=i,l=t("2877"),p=t("6544"),d=t.n(p),u=t("62ad"),f=t("b974"),N=Object(l["a"])(r,s,c,!1,null,null,null);a["default"]=N.exports;d()(N,{VCol:u["a"],VSelect:f["a"]})}}]);
//# sourceMappingURL=chunk-74c3efe8.f4582d81.js.map