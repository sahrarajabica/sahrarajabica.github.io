/* SR-MS Solutions site extras, part 2: service finder, wave planner, section bars, call preferences, page titles. */
(function(){
"use strict";
var S=window.SRMS;if(!S)return;
var $=S.$,$$=S.$$,h=S.h,store=S.store;

/* ---- service finder (home) ---- */
var FQ1=["An individual or a small team","A business with a file server or old SharePoint","Already using Microsoft 365"];
var FQ2=[
["Move our files to the cloud","Cloud & Data Migration","svc-migration","We plan the move, map permissions and migrate in verified waves so nobody has to stop working."],
["Get more from Teams, SharePoint and OneDrive","Microsoft 365 Implementation","svc-m365","We set up sites, teams and sharing rules that match how you work, then train your people."],
["Get ready for Copilot and AI","AI Readiness & Advisory","svc-ai","We check your data, security and people, and fix what would make AI answers wrong or risky."],
["Control who can access what","Products & Solutions","products","Our access management and governance tools put requests, approvals and reports in one place."],
["Run a project well","Project Management Services","svc-pm","We plan, coordinate and report so your project has an owner and a finish line."],
["Build our team's IT skills","IT Coaching","svc-coaching","Coaching on real tasks builds skill and confidence at your own pace."],
["Not sure yet","Consultations","svc-consult","A single conversation is the quickest way to find the right first step."]
];
var FTIP=["For an individual or a small team, one consultation session is usually the right first step.","With a file server or older SharePoint, an inventory of your sources usually comes first.","Since you already use Microsoft 365, a review of your current setup usually comes first."];
function finder(){
var root=$("#finder");if(!root)return;
var st=store.get("finder",{}),res=h("div",{class:"result","aria-live":"polite"});
function group(key,label,opts){
var box=h("div",{class:"opts",role:"group","aria-label":label});
opts.forEach(function(o,i){
var id="fd-"+key+"-"+i,inp=h("input",{type:"radio",name:"fd-"+key,id:id});
inp.checked=st[key]===i;
inp.addEventListener("change",function(){st[key]=i;store.set("finder",st);result()});
box.appendChild(h("label",{class:"opt","for":id},[inp,h("span",{text:o})]));
});
return h("div",{},[h("span",{class:"fl",text:label}),box]);
}
function result(){
res.textContent="";
if(st.a==null||st.b==null){res.appendChild(h("span",{text:"Answer both questions and we will suggest where to start."}));return}
var r=FQ2[st.b],topic=(st.b===3||st.b===6)?"Book a consultation":r[1];
var summary="I used the service finder on your website.\nAbout us: "+FQ1[st.a]+"\nWhat we want: "+r[0]+"\nSuggested service: "+r[1]+"\n\nPlease contact me to discuss next steps.";
res.appendChild(h("span",{class:"group-h",text:"Suggested starting point"}));
res.appendChild(h("h3",{text:r[1]}));
res.appendChild(h("span",{text:r[3]+" "+FTIP[st.a]}));
res.appendChild(S.actions([["Book a consultation",function(){S.toContact(topic,summary)},"btn-primary"],["See this service",function(){S.go(r[2])}]]));
}
root.appendChild(h("div",{},[group("a","What best describes you?",FQ1),group("b","What do you want most?",FQ2.map(function(x){return x[0]}))]));
root.appendChild(h("div",{},[res]));
result();
}

/* ---- migration wave planner (tools) ---- */
function waves(){
var root=$("#tool-waves");if(!root)return;
var st=store.get("waves",null)||{rows:[["Finance share (example)",80],["Projects share (example)",150],["Home drives (example)",60]],max:200,every:7,start:""};
var out=h("div",{"aria-live":"polite"});
function save(){store.set("waves",st)}
function plan(){
var ws=[],cur=null;
st.rows.forEach(function(r){
var name=(r[0]||"").trim(),gb=Math.max(0,parseFloat(r[1])||0);if(!name)return;
if(!cur||(cur.items.length&&cur.gb+gb>st.max)){cur={items:[],gb:0};ws.push(cur)}
cur.items.push(name);cur.gb+=gb;
});
return ws;
}
function when(i){
if(!st.start)return null;
var d=new Date(st.start+"T00:00:00");d.setDate(d.getDate()+i*st.every);
return d.toLocaleDateString(undefined,{weekday:"short",year:"numeric",month:"short",day:"numeric"});
}
function text(){
return "Migration wave plan\n"+plan().map(function(w,i){var d=when(i);return "Wave "+(i+1)+(d?" ("+d+")":"")+": "+w.items.join(", ")+" - "+Math.round(w.gb)+" GB"}).join("\n");
}
function drawOut(){
out.textContent="";
var ws=plan();
if(!ws.length){out.appendChild(h("p",{class:"sx-empty",text:"Add at least one named source to see a plan."}));return}
var tb=h("tbody");
ws.forEach(function(w,i){tb.appendChild(h("tr",{},[h("td",{text:"Wave "+(i+1)}),h("td",{text:when(i)||"Set a first wave date"}),h("td",{text:w.items.join(", ")}),h("td",{text:Math.round(w.gb)+" GB"})]))});
out.appendChild(h("table",{class:"wp-table"},[h("thead",{},[h("tr",{},["Wave","Date","Sources","Size"].map(function(t){return h("th",{scope:"col",text:t})}))]),tb]));
}
function draw(){
root.textContent="";
root.appendChild(h("h2",{text:"Migration wave planner"}));
root.appendChild(h("p",{text:"List what you need to move, in the order you want to move it. The planner groups your sources into waves that stay under the size you set. It is a planning aid based on your own numbers, not an estimate of effort."}));
var rows=h("div",{class:"wp-rows"});
st.rows.forEach(function(r,i){
var n=h("input",{type:"text",value:r[0],placeholder:"Source name","aria-label":"Name of source "+(i+1)}),g=h("input",{type:"number",min:"0",value:String(r[1]),placeholder:"GB","aria-label":"Size in GB of source "+(i+1)});
n.addEventListener("input",function(){r[0]=n.value;save();drawOut()});
g.addEventListener("input",function(){r[1]=g.value;save();drawOut()});
rows.appendChild(h("div",{class:"wp-row"},[n,g,h("button",{type:"button","aria-label":"Remove source "+(i+1),text:"×",onclick:function(){st.rows.splice(i,1);save();draw()}})]));
});
root.appendChild(h("div",{},[h("span",{class:"fl",text:"Sources, with size in GB"}),rows]));
root.appendChild(S.actions([["Add a source",function(){st.rows.push(["",0]);save();draw();var a=$$(".wp-row input[type=text]",root);a[a.length-1].focus()}]]));
var mx=h("input",{type:"number",min:"1",id:"wp-max",value:String(st.max)}),sd=h("input",{type:"date",id:"wp-start",value:st.start});
var ev=h("select",{id:"wp-every"},[[7,"Every week"],[14,"Every 2 weeks"],[28,"Every 4 weeks"]].map(function(o){var op=h("option",{value:String(o[0]),text:o[1]});if(o[0]===st.every)op.selected=true;return op}));
mx.addEventListener("input",function(){st.max=Math.max(1,parseFloat(mx.value)||1);save();drawOut()});
ev.addEventListener("change",function(){st.every=parseInt(ev.value,10);save();drawOut()});
sd.addEventListener("input",function(){st.start=sd.value;save();drawOut()});
root.appendChild(h("div",{class:"wp-set"},[h("div",{class:"field"},[h("label",{"for":"wp-max",text:"Largest wave (GB)"}),mx]),h("div",{class:"field"},[h("label",{"for":"wp-every",text:"How often"}),ev]),h("div",{class:"field"},[h("label",{"for":"wp-start",text:"First wave date"}),sd])]));
root.appendChild(out);drawOut();
root.appendChild(S.actions([["Send plan with my request",function(){S.toContact("Cloud & Data Migration",text()+"\n\nPlease contact me to discuss this plan.")},"btn-primary"],["Copy plan",function(){S.copy(this,text())}],["Print",function(){window.print()}],["Reset",function(){store.set("waves",null);waves()}]]));
}
draw();
}

/* ---- section bar under the page header ---- */
function subnav(viewId,items,label){
var view=document.getElementById(viewId);if(!view||items.length<2)return;
var wrap=h("div",{class:"wrap"}),btns=[];
items.forEach(function(it){
var b=h("button",{type:"button",text:it[0],onclick:function(){window.scrollTo(0,it[1].getBoundingClientRect().top+window.pageYOffset-140)}});
btns.push(b);wrap.appendChild(b);
});
var head=$(".page-head",view);head.parentNode.insertBefore(h("nav",{class:"subnav","aria-label":label},[wrap]),head.nextSibling);
function spy(){
if(view.hidden)return;var on=0;
items.forEach(function(it,i){if(it[1].getBoundingClientRect().top<220)on=i});
btns.forEach(function(b,i){b.classList.toggle("on",i===on)});
}
window.addEventListener("scroll",spy,{passive:true});
window.addEventListener("hashchange",function(){setTimeout(spy,200)});spy();
}

/* ---- page title and focus follow the section being viewed ---- */
var NAMES={services:"Services",products:"Products",resources:"Resources",tools:"Planning tools",about:"About us",contact:"Contact",privacy:"Privacy"};
function titles(){
function cur(){return (location.hash||"").replace("#","")||"home"}
function set(){var n=NAMES[cur()];document.title=(n?n+" | ":"")+"SR-MS Solutions Inc."}
window.addEventListener("hashchange",function(){
set();var v=document.getElementById(cur()),t=v&&$("h1",v);
if(t){t.setAttribute("tabindex","-1");try{t.focus({preventScroll:true})}catch(e){}}
});
set();
}

/* ---- preferred call times on the contact form ---- */
function prefs(){
var msg=$("#f-msg"),form=$("#contact-form");if(!msg||!form)return;
var DAYS=["Mon","Tue","Wed","Thu","Fri"],st=store.get("prefs",{days:[],time:""}),tz="";
try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}
var days=h("div",{class:"opts",role:"group","aria-label":"Preferred days"});
DAYS.forEach(function(d){
var id="pf-"+d,inp=h("input",{type:"checkbox",id:id});inp.checked=st.days.indexOf(d)>=0;
inp.addEventListener("change",function(){st.days=st.days.filter(function(x){return x!==d});if(inp.checked)st.days.push(d);store.set("prefs",st)});
days.appendChild(h("label",{class:"opt","for":id},[inp,h("span",{text:d})]));
});
var time=h("div",{class:"opts",role:"group","aria-label":"Preferred time of day"});
["Morning","Afternoon","Either"].forEach(function(t){
var id="pf-"+t,inp=h("input",{type:"radio",name:"pf-time",id:id});inp.checked=st.time===t;
inp.addEventListener("change",function(){st.time=t;store.set("prefs",st)});
time.appendChild(h("label",{class:"opt","for":id},[inp,h("span",{text:t})]));
});
var fs=h("fieldset",{class:"pref"},[h("legend",{text:"When suits you for a call? (optional)"}),days,time,tz?h("small",{text:"Your time zone: "+tz.replace(/_/g," ")}):null]);
msg.parentNode.parentNode.insertBefore(fs,msg.parentNode.nextSibling);
form.addEventListener("submit",function(){
var ready=$("#f-ready"),pre=$("#f-ready-text");if(ready.hidden)return;
var d=DAYS.filter(function(x){return st.days.indexOf(x)>=0}),lines=[];
if(d.length)lines.push("Preferred days: "+d.join(", "));
if(st.time)lines.push("Time of day: "+st.time);
if(lines.length){if(tz)lines.push("Time zone: "+tz);pre.textContent+="\n\n"+lines.join("\n")}
});
}

/* ---- share links in the footer ---- */
function share(){
var legal=$(".legal");if(!legal)return;
var url=location.origin+location.pathname;
legal.parentNode.insertBefore(h("div",{class:"share"},[h("span",{text:"Share this site:"}),
h("a",{href:"https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent(url),target:"_blank",rel:"noopener",text:"LinkedIn"}),
h("a",{href:"mailto:?subject="+encodeURIComponent("SR-MS Solutions Inc.")+"&body="+encodeURIComponent(url),text:"Email"}),
h("button",{type:"button",text:"Copy link",onclick:function(){S.copy(this,url)}})]),legal);
}

/* ---- send the contact form by email through Web3Forms when a form key is configured ---- */
function sender(){
var form=$("#contact-form"),C=window.COMPANY||{},key=C.formKey||"";if(!form||!key)return;
var ready=$("#f-ready"),pre=$("#f-ready-text"),how=$("#f-ready-how"),title=$("h3",ready),acts=$(".cta-actions",ready);
var btn=$("button[type=submit]",form);btn.firstChild.nodeValue="Send my request";
var trap=h("input",{type:"checkbox",name:"botcheck",tabindex:"-1",autocomplete:"off","aria-hidden":"true",style:"display:none"});form.appendChild(trap);
function state(t,p,showMsg){title.textContent=t;how.textContent=p;pre.hidden=!showMsg;acts.hidden=!showMsg}
form.addEventListener("submit",function(){
if(ready.hidden)return;
if(trap.checked){state("Thank you","Your request has been received.",false);return}
var v=function(id){return $("#"+id).value.trim()},to=v("f-email");
state("Sending your request…","This takes a few seconds.",false);
fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({access_key:key,subject:"Website request: "+v("f-topic"),from_name:"SR-MS Solutions website",name:v("f-name"),email:to,company:v("f-company"),message:pre.textContent})})
.then(function(r){return r.json()}).then(function(d){
if(!d||!d.success)throw new Error("not sent");
state("Thank you, your request has been sent","We will reply to "+to+" as soon as we can.",false);
store.set("draft",{});
}).catch(function(){
state("We could not send your request automatically","Please try again in a few minutes"+(C.email?", or email the message below to "+C.email+".":". Your message is below so you can copy it."),true);
});
});
}

function bars(){
subnav("services",$$("#services .svc").map(function(s){return [$("h2",s).textContent,s]}),"Services on this page");
subnav("tools",[["Readiness check","#tool-ready"],["Copilot checklist","#tool-copilot"],["Brief builder","#tool-brief"],["Wave planner","#tool-waves"]].map(function(t){return [t[0],$(t[1])]}).filter(function(t){return t[1]}),"Tools on this page");
}
[finder,waves,bars,titles,prefs,share,sender].forEach(function(f){try{f()}catch(e){if(window.console)console.error(e)}});
})();
