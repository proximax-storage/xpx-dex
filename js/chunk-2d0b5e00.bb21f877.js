(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b5e00"],{"1b81":function(t,a,e){"use strict";e.r(a);var r=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-row",[e("v-col",{attrs:{cols:"12"}},[e("div",{staticClass:"display-1 font-weight-regular text-left primary--text",class:[t.colorText]},[t._v("Congratulations")]),e("div",{staticClass:"ma-2 ml-4 mx-auto"},[e("div",{staticClass:"caption font-weight-black pt-3"},[t._v("Your transaction has been successfully registered into blockchain.")])]),e("div",{staticClass:"ma-2 pt-4 ml-4 mx-auto"},[e("span",{staticClass:"body-1 font-weight-black"},[t._v("Hash :")]),e("span",[e("a",{attrs:{href:t.hrefAdd(t.txOfferInfo.hash),target:"_blank"}},[t._v(t._s(t.txOfferInfo.hash))])])])]),e("v-col",{staticClass:"caption d-flex",attrs:{cols:"6"}},[e("custom-buttons",{attrs:{align:"start",arrayBtn:t.getArrayBtn[0]},on:{action:t.action}})],1)],1)},n=[],s=(e("99af"),e("d3b7"),{props:["txOfferInfo","colorText","typeOfferColor"],data:function(){return{arrayBtn:null}},computed:{getArrayBtn:function(){var t=this.arrayBtn;return t}},components:{"custom-buttons":function(){return e.e("chunk-2d0ba196").then(e.bind(null,"3685"))}},methods:{action:function(t){switch(t){case"viewOfferts":this.$router.push({path:"/searchOfferts"});break;case"print":break}},hrefAdd:function(t){return"".concat(this.$store.getters.environment.explorerHash.url).concat(t)}},beforeMount:function(){this.arrayBtn=[{viewOfferts:{key:"viewOfferts",action:"viewOfferts",disabled:!1,color:"primary",textColor:"white--text",loading:!1,text:"view  offerts"}}]}}),o=s,i=e("2877"),c=e("6544"),l=e.n(c),f=e("62ad"),u=e("0fd9"),h=Object(i["a"])(o,r,n,!1,null,null,null);a["default"]=h.exports;l()(h,{VCol:f["a"],VRow:u["a"]})}}]);
//# sourceMappingURL=chunk-2d0b5e00.bb21f877.js.map