(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9226],{51873:(e,a,t)=>{var i=t(9325).Symbol;e.exports=i},72552:(e,a,t)=>{var i=t(51873),r=t(659),s=t(59350),n=i?i.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":n&&n in Object(e)?r(e):s(e)}},54128:(e,a,t)=>{var i=t(31800),r=/^\s+/;e.exports=function(e){return e?e.slice(0,i(e)+1).replace(r,""):e}},34840:(e,a,t)=>{var i="object"==typeof t.g&&t.g&&t.g.Object===Object&&t.g;e.exports=i},659:(e,a,t)=>{var i=t(51873),r=Object.prototype,s=r.hasOwnProperty,n=r.toString,c=i?i.toStringTag:void 0;e.exports=function(e){var a=s.call(e,c),t=e[c];try{e[c]=void 0;var i=!0}catch(e){}var r=n.call(e);return i&&(a?e[c]=t:delete e[c]),r}},59350:e=>{var a=Object.prototype.toString;e.exports=function(e){return a.call(e)}},9325:(e,a,t)=>{var i=t(34840),r="object"==typeof self&&self&&self.Object===Object&&self,s=i||r||Function("return this")();e.exports=s},31800:e=>{var a=/\s/;e.exports=function(e){for(var t=e.length;t--&&a.test(e.charAt(t)););return t}},38221:(e,a,t)=>{var i=t(23805),r=t(10124),s=t(99374),n=Math.max,c=Math.min;e.exports=function(e,a,t){var o,l,d,x,u,m,h=0,v=!1,g=!1,f=!0;if("function"!=typeof e)throw TypeError("Expected a function");function j(a){var t=o,i=l;return o=l=void 0,h=a,x=e.apply(i,t)}function _(e){var t=e-m,i=e-h;return void 0===m||t>=a||t<0||g&&i>=d}function p(){var e,t,i,s=r();if(_(s))return k(s);u=setTimeout(p,(e=s-m,t=s-h,i=a-e,g?c(i,d-t):i))}function k(e){return(u=void 0,f&&o)?j(e):(o=l=void 0,x)}function w(){var e,t=r(),i=_(t);if(o=arguments,l=this,m=t,i){if(void 0===u)return h=e=m,u=setTimeout(p,a),v?j(e):x;if(g)return clearTimeout(u),u=setTimeout(p,a),j(m)}return void 0===u&&(u=setTimeout(p,a)),x}return a=s(a)||0,i(t)&&(v=!!t.leading,d=(g="maxWait"in t)?n(s(t.maxWait)||0,a):d,f="trailing"in t?!!t.trailing:f),w.cancel=function(){void 0!==u&&clearTimeout(u),h=0,o=m=l=u=void 0},w.flush=function(){return void 0===u?x:k(r())},w}},23805:e=>{e.exports=function(e){var a=typeof e;return null!=e&&("object"==a||"function"==a)}},40346:e=>{e.exports=function(e){return null!=e&&"object"==typeof e}},44394:(e,a,t)=>{var i=t(72552),r=t(40346);e.exports=function(e){return"symbol"==typeof e||r(e)&&"[object Symbol]"==i(e)}},10124:(e,a,t)=>{var i=t(9325);e.exports=function(){return i.Date.now()}},99374:(e,a,t)=>{var i=t(54128),r=t(23805),s=t(44394),n=0/0,c=/^[-+]0x[0-9a-f]+$/i,o=/^0b[01]+$/i,l=/^0o[0-7]+$/i,d=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(s(e))return n;if(r(e)){var a="function"==typeof e.valueOf?e.valueOf():e;e=r(a)?a+"":a}if("string"!=typeof e)return 0===e?e:+e;e=i(e);var t=o.test(e);return t||l.test(e)?d(e.slice(2),t?2:8):c.test(e)?n:+e}},36022:(e,a,t)=>{"use strict";t.d(a,{A:()=>b});var i=t(67538),r=t.n(i),s=t(96540),n=[".services.jsx-3937535467{margin:var(--s-element) auto;height:inherit;}","@media (max-width:1100px){.services.jsx-3937535467{margin:0;max-width:100vw;}}"];n.__hash="3937535467";var c=t(71261),o=t(86715),l=[".d-flex.jsx-2452027782,.marketing-program-card.jsx-2452027782,.marketing-details__create-account.jsx-2452027782,.marketing-details__header.jsx-2452027782,.marketing-details.jsx-2452027782{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".marketing-details.jsx-2452027782{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-1);border:solid 3px var(--gray-100-o);border-radius:var(--border-radius);box-shadow:inset 0 0 var(--s-12) var(--s-12) var(--gray-70-o),inset calc(var(--s-11) * -1) calc(var(--s-11) * -1) var(--s-12) var(--s-12) var(--gray-90);padding:var(--s-element) var(--s-1);background-color:var(--gray-80);margin:var(--s-1);}","@media (max-width:1100px){.marketing-details.jsx-2452027782{width:var(--s-9-width);}}",".marketing-details__header.jsx-2452027782{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-1);}",".marketing-details__header--title.jsx-2452027782{color:var(--gray-50);width:100%;text-align:center;font-size:var(--s-2);text-transform:uppercase;}",".marketing-details__header--body.jsx-2452027782{padding:0 var(--s-1);color:var(--gray-30);}",".marketing-details__create-account.jsx-2452027782{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-3);width:var(--s-1-width);padding:0 var(--s-1);}",".marketing-details__create-account--header.jsx-2452027782{font-size:var(--s-1);text-transform:capitalize;}",".marketing-details__create-account--body.jsx-2452027782{font-family:Game;color:var(--gray-50);}",".marketing-details__create-account--action.jsx-2452027782{margin-top:var(--s-1);width:400px;}",".marketing-program-card.jsx-2452027782{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:var(--s-9-width);height:100%;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;padding:var(--s-element) var(--s-9) var(--s-9);--ui-icon-color:var(--primary-10);--ui-icon-size:calc((var(--s-element) * 1.3));background-color:var(--gray-90);border-radius:var(--border-radius);-webkit-transition:all 0.5s ease-in;transition:all 0.5s ease-in;}",".marketing-program-card.jsx-2452027782 p.jsx-2452027782{margin:var(--s-element) 0;text-transform:capitalize;}","@media (max-width:900px){.marketing-program-card.jsx-2452027782{--ui-icon-size:100px;}.marketing-program-card.jsx-2452027782 p.jsx-2452027782{font-size:var(--s-3);}}",".marketing-program-card.jsx-2452027782:hover{background-color:var(--gray-80);box-shadow:inset var(--s-11) var(--s-11) var(--s-12) var(--s-12) var(--gray-90),inset calc(var(--s-12) * -1) calc(var(--s-12) * -1) var(--s-12) var(--s-12) var(--gray-70);}"];l.__hash="2452027782";var d=t(86753),x=t(42834),u=t(31998),m=t(27515),h=t(2543),v=t(74848);let g=function(e){var a=e.setView,t=function(e){return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(r(),{id:l.__hash,children:l}),(0,v.jsxs)("div",{onClick:a,className:"jsx-".concat(l.__hash)+" marketing-program-card",children:[(0,v.jsx)(x.o,{icon:"fa-".concat(e.name)}),(0,v.jsxs)("p",{className:"jsx-".concat(l.__hash),children:[e.name," Marketing"]}),(0,v.jsxs)(u.A,{onClick:function(){return a("method")},children:["$",(null==e?void 0:e.cost)||"41"," / lead"]}),(0,v.jsx)(u.A,{variant:"link",onClick:function(){return a("more-info")},children:"More Info"})]})]})};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(r(),{id:l.__hash,children:l}),(0,v.jsxs)("div",{className:"jsx-".concat(l.__hash)+" marketing-details",children:[(0,v.jsxs)("div",{className:"jsx-".concat(l.__hash)+" marketing-details__header",children:[(0,v.jsx)("div",{className:"jsx-".concat(l.__hash)+" marketing-details__header--title",children:"Sign up for marketing lists"}),(0,v.jsx)("div",{className:"jsx-".concat(l.__hash)+" marketing-details__header--body",children:"Target your audience using informed media buying across states and the whole country by using Deepturn data analytics and audience groups to identify the people who will be most receptive to your message, create tailored content, and deliver impactful and cost effective campaigns across DMAs."})]}),(0,v.jsxs)("div",{className:"jsx-".concat(l.__hash)+" marketing-details__create-account",children:[(0,v.jsxs)("div",{className:"jsx-".concat(l.__hash)+" marketing-details__create-account--header",children:[(0,h.capitalize)(m.A.merchant.name)," Free Tier"]}),(0,v.jsx)("div",{className:"jsx-".concat(l.__hash)+" marketing-details__create-account--body",children:"Gain free, knowledge of ".concat((0,h.capitalize)(m.A.merchant.name),"'s products & services")}),(0,v.jsx)("div",{className:"jsx-".concat(l.__hash)+" marketing-details__create-account--action",children:(0,v.jsx)(u.A,{variant:"lite round",children:"create a free account"})})]}),(0,v.jsxs)(d.A,{gapY:20,xs:1,md:3,gap:10,variant:"card",children:[(0,v.jsx)(t,{name:"google",cost:100,className:"jsx-".concat(l.__hash)}),(0,v.jsx)(t,{name:"tiktok",className:"jsx-".concat(l.__hash)}),(0,v.jsx)(t,{name:"instagram",className:"jsx-".concat(l.__hash)})]})]})]})};var f=[".d-flex.jsx-1329959207,.marketing-product-card.jsx-1329959207,.marketing-details__create-account.jsx-1329959207,.marketing-details__header.jsx-1329959207,.marketing-details.jsx-1329959207,.marketing-list.jsx-1329959207{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".marketing-list.jsx-1329959207{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-1);height:-webkit-max-content;height:-moz-max-content;height:max-content;padding-bottom:200px;}",".marketing-details.jsx-1329959207{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-1);border:3px solid var(--gray-100-o);border-radius:var(--border-radius);box-shadow:inset 0 0 var(--s-12) var(--s-12) var(--gray-70-o),inset calc(var(--s-11) * -1) calc(var(--s-11) * -1) var(--s-12) var(--s-12) var(--gray-90);padding:var(--s-element) var(--s-1);background-color:var(--gray-80);max-width:100%;}","@media (max-width:1100px){.marketing-details.jsx-1329959207{padding:var(--s-1) var(--s-9);}}",".marketing-details__header.jsx-1329959207{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-1);}",".marketing-details__header--title.jsx-1329959207{color:var(--gray-50);width:100%;text-align:center;text-transform:uppercase;font-size:var(--s-2);}","@media (max-width:1100px){.marketing-details__header--title.jsx-1329959207{font-size:var(--s-5);width:auto;}}",".marketing-details__header--body.jsx-1329959207{padding:0 var(--s-1);max-width:100%;width:100%;color:var(--gray-30);}","@media (max-width:1100px){.marketing-details__header--body.jsx-1329959207{padding:0;text-align:center;overflow:hidden;font-size:var(--s-7);}}",".marketing-details__create-account.jsx-1329959207{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-3);width:100%;padding:0 var(--s-1);}",".marketing-details__create-account--header.jsx-1329959207{font-size:var(--s-1);text-transform:capitalize;}",".marketing-details__create-account--body.jsx-1329959207{font-family:Game;color:var(--gray-50);}",".marketing-details__create-account--action.jsx-1329959207{margin-top:var(--s-1);max-width:100%;}",".marketing-product-card.jsx-1329959207{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;cursor:pointer;width:var(--s-9-width);min-height:160px;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;padding:var(--s-element) var(--s-9) var(--s-9);--ui-icon-color:var(--primary-10);--ui-icon-size:calc(var(--s-element) * 1.3);background-color:var(--gray-90);border-radius:var(--border-radius);-webkit-transition:all 0.5s ease-in;transition:all 0.5s ease-in;}",".marketing-product-card.jsx-1329959207 p.jsx-1329959207{margin:var(--s-element) 0;text-transform:capitalize;}","@media (max-width:900px){.marketing-product-card.jsx-1329959207{--ui-icon-size:100px;}.marketing-product-card.jsx-1329959207 p.jsx-1329959207{font-size:var(--s-3);}}",".marketing-product-card.jsx-1329959207:hover{background-color:var(--gray-80);box-shadow:inset var(--s-11) var(--s-11) var(--s-12) var(--s-12) var(--gray-90),inset calc(var(--s-12) * -1) calc(var(--s-12) * -1) var(--s-12) var(--s-12) var(--gray-70);}"];f.__hash="1329959207";var j=t(70205),_=t(13097),p=t(73001),k=t(20384);let w=function(e){var a=e.setDetails,t=(0,j.Q)(),i=t.products,s=t.loading;return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(r(),{id:f.__hash,children:f}),(0,v.jsxs)("div",{className:"jsx-".concat(f.__hash)+" marketing-list",children:[(0,v.jsx)("h1",{className:"jsx-".concat(f.__hash),children:"Marketing Products"}),(0,v.jsxs)("div",{className:"jsx-".concat(f.__hash)+" marketing-details",children:[(0,v.jsxs)("div",{className:"jsx-".concat(f.__hash)+" marketing-details__header",children:[(0,v.jsx)("div",{className:"jsx-".concat(f.__hash)+" marketing-details__header--title",children:"Sign up for marketing lists"}),(0,v.jsx)("div",{className:"jsx-".concat(f.__hash)+" marketing-details__header--body",children:"Target your audience using informed media buying across states and the whole country by using Deepturn data analytics and audience groups to identify the people who will be most receptive to your message, create tailored content, and deliver impactful and cost effective campaigns across DMAs."}),(0,v.jsxs)("div",{className:"jsx-".concat(f.__hash)+" marketing-details__create-account",children:[(0,v.jsxs)("div",{className:"jsx-".concat(f.__hash)+" marketing-details__create-account--header",children:[(0,k.A)(m.A.merchant.name)," Free Tier"]}),(0,v.jsx)("div",{className:"jsx-".concat(f.__hash)+" marketing-details__create-account--body",children:"Gain free, knowledge of ".concat((0,k.A)(m.A.merchant.name),"'s products & services")}),(0,v.jsx)("div",{className:"jsx-".concat(f.__hash)+" marketing-details__create-account--action",children:(0,v.jsx)(u.A,{variant:"lite round",children:"create a free account"})})]})]}),s?(0,v.jsx)(p.A,{}):(0,v.jsx)(d.A,{gapY:20,xs:1,md:3,gap:10,children:null!=i&&(null==i?void 0:i.map(function(e,t){return(0,v.jsxs)("div",{onClick:function(){return a(e)},className:"jsx-".concat(f.__hash)+" marketing-product-card",children:[(0,v.jsx)("h3",{className:"jsx-".concat(f.__hash),children:e.name}),(0,v.jsx)(_.A,{product:e,goToCart:!0,btnText:null==e?void 0:e.name})]},"".concat(e.id,"-").concat(t))}))})]})]})]})},b=function(){var e=(0,s.useState)(),a=e[0],t=e[1],i=(0,s.useState)(),l=i[0];i[1];var d=function(e){Object.keys(u).includes(e)&&t(e)},x=(0,o.useRouter)().query,u={data:(0,v.jsx)(v.Fragment,{children:"data acquisition"}),marketing:(0,v.jsx)(w,{setDetails:d}),"marketing-details":(0,v.jsx)(g,{setView:d})},m=(null==x?void 0:x.sid)&&String(x.sid);return(0,s.useEffect)(function(){m&&!a&&t(m)},[x,void 0!=l]),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(r(),{id:n.__hash,children:n}),(0,v.jsxs)("div",{className:"jsx-".concat(n.__hash)+" services",children:[(0,v.jsx)(c.A,{currentView:a,views:u}),"method"==a&&(0,v.jsx)(v.Fragment,{})]})]})}},71261:(e,a,t)=>{"use strict";t.d(a,{A:()=>u});var i=t(67538),r=t.n(i),s=t(96540),n=[".d-flex.jsx-1816589771,.ui-view-layout__view.jsx-1816589771,.ui-view-layout__header.jsx-1816589771,.ui-view-layout__actions.jsx-1816589771,.ui-view-layout.jsx-1816589771,.back-btn.jsx-1816589771{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".back-btn.jsx-1816589771{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:100%;height:var(--s-element);}",".ui-view-layout.jsx-1816589771{position:relative;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:100%;overflow-x:hidden;min-height:100%;}",".ui-view-layout.start.jsx-1816589771>*.back-btn.jsx-1816589771{display:none;}",".ui-view-layout--anchor.jsx-1816589771{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:var(--s-9-width);min-height:100%;margin:0;}",".ui-view-layout__actions.jsx-1816589771{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;gap:var(--s-9);}",".ui-view-layout__view.jsx-1816589771{-webkit-flex:1;-ms-flex:1;flex:1;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-4);}","@media (max-width:1100px){.ui-view-layout__view.jsx-1816589771{max-width:var(--s-9-width);margin:auto;border-radius:var(--border-radius);height:auto;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;}}",".ui-view-layout__header.jsx-1816589771,.ui-view-layout__actions.jsx-1816589771{width:100%;}",".ui-view-layout__header.jsx-1816589771{width:var(--s-4-width);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;padding:0 var(--s-4) var(--s-9);}","@media (max-width:1100px){.ui-view-layout__header.jsx-1816589771{width:var(--s-9-width);padding:0 var(--s-9) var(--s-9);}}",".ui-view-layout__header-title.jsx-1816589771{font-size:var(--s-1);--ui-icon-color:var(--primary-50);color:var(--primary-50);text-transform:capitalize;}",".current.jsx-1816589771{position:absolute;top:calc(var(--s-4) * 0.5);color:var(--gray-30-o);right:var(--s-9);height:var(--s-6);line-height:1;}"];n.__hash="1816589771";var c=t(73001),o=t(38242),l=function(e,a){var t=(0,s.useState)([]),i=t[0],r=t[1],n=(0,s.useState)(),c=n[0],l=n[1],d=function(a){var t=String(a);e&&e[t]&&(l(e[t]),r(function(e){return[].concat((0,o.A)(e),[t])}))};return(0,s.useEffect)(function(){a&&null!=e&&e[a]&&i[i.length-1]!==a&&d(a)},[e,a]),{view:c,setView:d,last:i[i.length-1],goBack:function(){r(function(a){if(a.length>1){var t=a.slice(0,-1);return l(e[t[t.length-1]]),t}return a})}}},d=t(31998),x=t(74848);let u=function(e){var a=e.views,t=e.currentView,i=(e.onChange,e.view),s=e.title,o=e.actions,u=void 0!==o&&o,m=e.showTitle,h=e.backBtn,v=e.variant,g=l(a,t),f=g.view,j=(g.setView,g.goBack),_=g.last;return a&&f?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(r(),{id:n.__hash,children:n}),(0,x.jsxs)("div",{className:"jsx-".concat(n.__hash)+" "+"ui-view-layout ".concat(v?"ui-view-layout--".concat(v):""),children:["loading"==t&&(0,x.jsx)(c.A,{position:"fixed"}),!!(void 0!==h&&h&&"start"!==_)&&(0,x.jsx)("div",{className:"jsx-".concat(n.__hash)+" back-btn",children:(0,x.jsx)("div",{className:"jsx-".concat(n.__hash),children:(0,x.jsx)(d.A,{traits:{beforeIcon:"fa-chevron-left"},variant:"flat",onClick:j,children:"Back"})})}),void 0!==m&&m&&"start"!==_&&(0,x.jsx)("div",{className:"jsx-".concat(n.__hash)+" ui-view-layout__header",children:(0,x.jsx)("div",{className:"jsx-".concat(n.__hash)+" ui-view-layout__header-title",children:s})}),u&&(0,x.jsx)("div",{className:"jsx-".concat(n.__hash)+" d-flex justify-end g-10 s-10",children:Object.values(u).map(function(e,a){return(0,x.jsx)("div",{className:"jsx-".concat(n.__hash),children:(0,x.jsx)(d.A,{onClick:function(){return e.onClick(e.label)},children:e.label})},a)})}),(0,x.jsx)("div",{"data-view":t,className:"jsx-".concat(n.__hash)+" ui-view-layout__view",children:i||f||(0,x.jsx)("div",{className:"jsx-".concat(n.__hash),children:"View not found"})})]})]}):(0,x.jsx)(c.A,{position:"fixed"})}}}]);