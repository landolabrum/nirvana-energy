(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4875],{51873:(t,e,r)=>{var i=r(9325).Symbol;t.exports=i},72552:(t,e,r)=>{var i=r(51873),n=r(659),o=r(59350),a=i?i.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":a&&a in Object(t)?n(t):o(t)}},54128:(t,e,r)=>{var i=r(31800),n=/^\s+/;t.exports=function(t){return t?t.slice(0,i(t)+1).replace(n,""):t}},34840:(t,e,r)=>{var i="object"==typeof r.g&&r.g&&r.g.Object===Object&&r.g;t.exports=i},659:(t,e,r)=>{var i=r(51873),n=Object.prototype,o=n.hasOwnProperty,a=n.toString,c=i?i.toStringTag:void 0;t.exports=function(t){var e=o.call(t,c),r=t[c];try{t[c]=void 0;var i=!0}catch(t){}var n=a.call(t);return i&&(e?t[c]=r:delete t[c]),n}},59350:t=>{var e=Object.prototype.toString;t.exports=function(t){return e.call(t)}},9325:(t,e,r)=>{var i=r(34840),n="object"==typeof self&&self&&self.Object===Object&&self,o=i||n||Function("return this")();t.exports=o},31800:t=>{var e=/\s/;t.exports=function(t){for(var r=t.length;r--&&e.test(t.charAt(r)););return r}},38221:(t,e,r)=>{var i=r(23805),n=r(10124),o=r(99374),a=Math.max,c=Math.min;t.exports=function(t,e,r){var s,l,u,d,f,p,b=0,h=!1,x=!1,m=!0;if("function"!=typeof t)throw TypeError("Expected a function");function v(e){var r=s,i=l;return s=l=void 0,b=e,d=t.apply(i,r)}function g(t){var r=t-p,i=t-b;return void 0===p||r>=e||r<0||x&&i>=u}function j(){var t,r,i,o=n();if(g(o))return y(o);f=setTimeout(j,(t=o-p,r=o-b,i=e-t,x?c(i,u-r):i))}function y(t){return(f=void 0,m&&s)?v(t):(s=l=void 0,d)}function w(){var t,r=n(),i=g(r);if(s=arguments,l=this,p=r,i){if(void 0===f)return b=t=p,f=setTimeout(j,e),h?v(t):d;if(x)return clearTimeout(f),f=setTimeout(j,e),v(p)}return void 0===f&&(f=setTimeout(j,e)),d}return e=o(e)||0,i(r)&&(h=!!r.leading,u=(x="maxWait"in r)?a(o(r.maxWait)||0,e):u,m="trailing"in r?!!r.trailing:m),w.cancel=function(){void 0!==f&&clearTimeout(f),b=0,s=p=l=f=void 0},w.flush=function(){return void 0===f?d:y(n())},w}},23805:t=>{t.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}},40346:t=>{t.exports=function(t){return null!=t&&"object"==typeof t}},44394:(t,e,r)=>{var i=r(72552),n=r(40346);t.exports=function(t){return"symbol"==typeof t||n(t)&&"[object Symbol]"==i(t)}},10124:(t,e,r)=>{var i=r(9325);t.exports=function(){return i.Date.now()}},99374:(t,e,r)=>{var i=r(54128),n=r(23805),o=r(44394),a=0/0,c=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,l=/^0o[0-7]+$/i,u=parseInt;t.exports=function(t){if("number"==typeof t)return t;if(o(t))return a;if(n(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=n(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=i(t);var r=s.test(t);return r||l.test(t)?u(t.slice(2),r?2:8):c.test(t)?a:+t}},69551:(t,e,r)=>{"use strict";r.d(e,{A:()=>p});var i=r(73556),n=r(67538),o=r.n(n),a=r(96540),c=[".d-flex.jsx-2585598993,.product-build__body.jsx-2585598993,.product-build.jsx-2585598993{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:stretch;-webkit-justify-content:stretch;-ms-flex-pack:stretch;justify-content:stretch;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".product-build.jsx-2585598993{-webkit-align-items:stretch;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:relative;min-height:inherit;height:100%;gap:var(--s-9);width:100%;}","@media (max-width:1260px){.product-build.jsx-2585598993{width:var(--s-9-width);padding:0 var(--s-9);}}","@media (max-width:900px){.product-build.jsx-2585598993{margin:auto;width:var(--s-5-width);padding:0 var(--s-5);}}",".product-build--header.jsx-2585598993{font-size:var(--s-1);min-height:var(--s-1);margin-top:var(--s-1);color:var(--primary-30);}",".product-build__body.jsx-2585598993{gap:var(--s-9);-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;min-height:50vh;height:100%;}","@media (max-width:900px){.product-build__body.jsx-2585598993{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}}",".product-build__body--content.jsx-2585598993,.product-build__body--form.jsx-2585598993{border-radius:var(--border-radius);height:100%;background-color:var(--gray-20);-webkit-flex:1;-ms-flex:1;flex:1;height:inherit;min-height:inherit;width:var(--s-9-width);padding:var(--s-4) var(--s-9);}",".product-build__body--content.jsx-2585598993{overflow:hidden;height:-webkit-max-content;height:-moz-max-content;height:max-content;}"];c.__hash="2585598993";var s=r(21113),l=r(91863),u=r(74848);function d(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),r.push.apply(r,i)}return r}function f(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?d(Object(r),!0).forEach(function(e){(0,i.A)(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}let p=function(){var t=(0,a.useState)("loading"),e=t[0],r=t[1],i=(0,a.useState)([{name:"Usage",type:"select",options:[{label:"Residential",name:"residential"},{label:"Commercial",name:"commercial"},{label:"Off-Grid",name:"offgrid"}],value:"select"}]),n=i[0],d=i[1],p={products:(0,u.jsx)(s.A,{onSelect:console.log,hide:"header"})};return(0,a.useEffect)(function(){r("products")},[r]),(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(o(),{id:c.__hash,children:c}),(0,u.jsxs)("div",{className:"jsx-".concat(c.__hash)+" product-build",children:[(0,u.jsx)("div",{className:"jsx-".concat(c.__hash)+" product-build--header",children:"Product Build"}),(0,u.jsxs)("div",{className:"jsx-".concat(c.__hash)+" product-build__body ",children:[(0,u.jsx)("div",{className:"jsx-".concat(c.__hash)+" product-build__body--content ",children:null==p?void 0:p[e]}),(0,u.jsx)("div",{className:"jsx-".concat(c.__hash)+" product-build__body--form",children:(0,u.jsx)(l.A,{fields:n,onChange:function(t){var e=null==t?void 0:t.target,r=e.name,i=e.value;r&&d(function(t){return t.map(function(t){return t.name===r?f(f({},t),{},{value:(null==t?void 0:t.type)==="select"?i.name:i}):t})})}})})]})]})]})}}}]);