/* SR-MS Solutions site extras: tools, search, filters, page helpers. No data leaves the browser. */
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function h(tag,attrs,kids){var n=document.createElement(tag),k;for(k in attrs||{}){if(k==="text")n.textContent=attrs[k];else if(k.slice(0,2)==="on")n.addEventListener(k.slice(2),attrs[k]);else n.setAttribute(k,attrs[k]);}(kids||[]).forEach(function(c){if(c)n.appendChild(c)});return n}
var store={get:function(k,d){try{var v=localStorage.getItem("srms."+k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem("srms."+k,JSON.stringify(v))}catch(e){}}};
function go(view,target){
if(location.hash!=="#"+view)location.hash=view;
setTimeout(function(){
if(!target){window.scrollTo(0,0);return}
window.scrollTo(0,target.getBoundingClientRect().top+window.pageYOffset-90);
target.classList.remove("flash");void target.offsetWidth;target.classList.add("flash");
},80);
}
function toContact(topic,text){
var s=$("#f-topic"),i;for(i=0;i<s.options.length;i++)if(s.options[i].text===topic)s.selectedIndex=i;
var m=$("#f-msg");m.value=text;m.dispatchEvent(new Event("input"));
go("contact",$("#contact-form"));
}
function copy(btn,text){
var done=function(ok){var o=btn.textContent;btn.textContent=ok?"Copied":"Select the text and copy it";setTimeout(function(){btn.textContent=o},2000)};
try{navigator.clipboard.writeText(text).then(function(){done(true)},function(){done(false)})}catch(e){done(false)}
}
function actions(list){return h("div",{class:"row-actions"},list.map(function(a){return h("button",{type:"button",class:"btn "+(a[2]||"btn-ghost"),text:a[0],onclick:a[1]})}))}

/* ---- 1. Migration readiness check ---- */
var RQ=[
["We know where all our files live today: file shares, old SharePoint sites and personal drives.","Start with an inventory of every source, its size and its owner."],
["Every shared folder or site has a named owner.","Assign an owner to each area before it moves, so someone can approve what goes where."],
["We have reviewed who has access to what within the last year.","Review permissions first. A migration copies old access problems into the new environment."],
["We know which content can be archived or deleted.","Agree what stays behind. Less content means a shorter and safer migration."],
["Our Microsoft 365 licences cover SharePoint, OneDrive and Teams for everyone affected.","Check licences per user before planning migration waves."],
["Staff have had training on Teams, OneDrive and SharePoint.","Plan short training sessions for each wave so people know where their files went."],
["We have written rules for sharing, naming and retention.","Write a one-page governance guide before creating new sites."],
["Sensitive content is identified and labelled.","Identify and label sensitive content, especially before turning on Copilot."]
];
function readiness(){
var root=$("#tool-ready");if(!root)return;
var ans=store.get("ready",{});
function draw(){
root.textContent="";
root.appendChild(h("h2",{text:"Migration readiness check"}));
root.appendChild(h("p",{text:"Eight questions, about two minutes. Your answers stay in this browser and give you a list of what to fix before a migration."}));
RQ.forEach(function(q,i){
var seg=h("div",{class:"seg",role:"group","aria-label":"Answer for question "+(i+1)});
[["Yes",2],["Partly",1],["No",0]].forEach(function(o){
seg.appendChild(h("button",{type:"button",text:o[0],"aria-pressed":String(ans[i]===o[1]),onclick:function(){ans[i]=o[1];store.set("ready",ans);draw()}}));
});
root.appendChild(h("div",{class:"q"},[h("span",{text:(i+1)+". "+q[0]}),seg]));
});
var n=Object.keys(ans).length,res=h("div",{class:"result","aria-live":"polite"});
if(n<RQ.length){
res.appendChild(h("span",{text:n+" of "+RQ.length+" answered. Answer every question to see your result."}));
}else{
var sum=0,gaps=[],i;for(i=0;i<RQ.length;i++){sum+=ans[i];if(ans[i]<2)gaps.push(RQ[i][1])}
var pct=Math.round(sum/(RQ.length*2)*100);
var level=pct>=75?"Ready to plan a migration":pct>=40?"Some groundwork first":"Start with an assessment";
res.appendChild(h("span",{class:"big",text:pct+"% ready: "+level}));
var m=h("div",{class:"meter"},[h("i")]);m.firstChild.style.width=pct+"%";res.appendChild(m);
if(gaps.length){res.appendChild(h("span",{text:"What to work on first:"}));res.appendChild(h("ul",{},gaps.map(function(g){return h("li",{text:g})})))}
else res.appendChild(h("span",{text:"No gaps found. You are in good shape to plan migration waves."}));
var text="Migration readiness check result: "+pct+"% ("+level+").\n"+(gaps.length?"Gaps to address:\n- "+gaps.join("\n- "):"No gaps found.")+"\n\nPlease contact me to discuss next steps.";
res.appendChild(actions([["Send my result with a request",function(){toContact("Cloud & Data Migration",text)},"btn-primary"],["Copy result",function(){copy(this,text)}],["Start over",function(){ans={};store.set("ready",ans);draw()}]]));
}
root.appendChild(res);
}
draw();
}

/* ---- 2. Copilot readiness checklist ---- */
var CK=[
["Data",[["Sites shared with everyone have been reviewed","Copilot can surface anything a person is able to open."],["Old and duplicate content is archived or deleted","Stale files lead to stale answers."],["Sensitive content is identified and labelled","Labels control what can be summarized and shared."]]],
["Security",[["Multi-factor authentication is on for all users",""],["External sharing is limited to where it is needed",""],["Access is granted through groups with owners who review it",""]]],
["People",[["A pilot group and their use cases are chosen","Start small with people who will give feedback."],["Staff guidelines for using AI output are written",""],["Training is scheduled before licences are assigned",""],["You have agreed how success will be measured",""]]]
];
function copilot(){
var root=$("#tool-copilot");if(!root)return;
var st=store.get("copilot",{}),total=0;CK.forEach(function(g){total+=g[1].length});
function draw(){
root.textContent="";
root.appendChild(h("h2",{text:"Microsoft 365 Copilot readiness checklist"}));
root.appendChild(h("p",{text:"Tick what is already in place. Progress is saved in this browser, so you can come back to it."}));
var done=0,open=[];
CK.forEach(function(g,gi){
root.appendChild(h("div",{class:"group-h",text:g[0]}));
g[1].forEach(function(it,ii){
var key=gi+"-"+ii,cb=h("input",{type:"checkbox",id:"ck-"+key});
cb.checked=!!st[key];if(cb.checked)done++;else open.push(it[0]);
cb.addEventListener("change",function(){st[key]=cb.checked;store.set("copilot",st);draw();var f=$("#ck-"+key);if(f)f.focus()});
root.appendChild(h("label",{class:"check","for":"ck-"+key},[cb,h("span",{text:it[0]},[])]));
if(it[1])root.lastChild.lastChild.appendChild(h("small",{text:it[1]}));
});
});
var m=h("div",{class:"meter"},[h("i")]);m.firstChild.style.width=Math.round(done/total*100)+"%";
root.appendChild(h("div",{class:"result","aria-live":"polite"},[h("span",{class:"big",text:done+" of "+total+" in place"}),m]));
var text="Copilot readiness checklist: "+done+" of "+total+" in place.\n"+(open.length?"Still open:\n- "+open.join("\n- "):"Everything is ticked.")+"\n\nPlease contact me about a readiness assessment.";
root.appendChild(actions([["Ask for a readiness assessment",function(){toContact("AI Readiness & Advisory",text)},"btn-primary"],["Print checklist",function(){window.print()}],["Reset",function(){st={};store.set("copilot",st);draw()}]]));
}
draw();
}

/* ---- 3. Project brief builder ---- */
var BF=[
["sources","What are you moving from?",true,["File shares","SharePoint on-premises","Google Drive or Dropbox","Personal drives","Something else"]],
["size","Roughly how much data?",false,["Under 100 GB","100 GB to 1 TB","1 to 5 TB","Over 5 TB","Not sure"]],
["users","How many people are affected?",false,["1 to 10","11 to 50","51 to 250","Over 250"]],
["goals","What do you want to achieve?",true,["Move files to SharePoint Online","Set up OneDrive","Roll out Microsoft Teams","Prepare for Microsoft 365 Copilot","Fix permissions and governance","Build a custom tool"]],
["when","When do you want to start?",false,["As soon as possible","Within 3 months","Within 6 months","This year","Just exploring"]]
];
function brief(){
var root=$("#tool-brief");if(!root)return;
var st=store.get("brief",{});
var pre=h("pre",{"aria-live":"polite"});
function text(){
var L={sources:"Moving from",size:"Approximate data",users:"People affected",goals:"Goals",when:"Timeline"};
return "Project brief\n"+BF.map(function(f){var v=st[f[0]];v=f[2]?(v&&v.length?v.join(", "):"not chosen yet"):(v||"not chosen yet");return L[f[0]]+": "+v}).join("\n");
}
function upd(){store.set("brief",st);pre.textContent=text()}
var left=h("div");
BF.forEach(function(f){
var box=h("div",{class:"opts",role:"group","aria-label":f[1]});
f[3].forEach(function(o,oi){
var id="bf-"+f[0]+"-"+oi,inp=h("input",{type:f[2]?"checkbox":"radio",name:"bf-"+f[0],id:id});
inp.checked=f[2]?(st[f[0]]||[]).indexOf(o)>=0:st[f[0]]===o;
inp.addEventListener("change",function(){
if(f[2]){var a=(st[f[0]]||[]).filter(function(x){return x!==o});if(inp.checked)a.push(o);st[f[0]]=a}else st[f[0]]=o;
upd();
});
box.appendChild(h("label",{class:"opt","for":id},[inp,h("span",{text:o})]));
});
left.appendChild(h("div",{},[h("span",{class:"fl",text:f[1]}),box]));
});
var right=h("div",{},[h("span",{class:"fl",text:"Your brief"}),pre,actions([["Send with my request",function(){toContact("Book a consultation",text())},"btn-primary"],["Copy brief",function(){copy(this,text())}],["Clear",function(){st={};store.set("brief",st);root.textContent="";brief()}]])]);
root.appendChild(h("h2",{text:"Project brief builder"}));
root.appendChild(h("p",{text:"Pick what applies and get a short brief you can send us or share inside your organization."}));
root.appendChild(h("div",{class:"brief-grid"},[left,right]));
upd();
}

/* ---- 4. Site search ---- */
function search(){
var btn=$("#search-btn");if(!btn)return;
var index=null,box=null,active=0,hits=[];
function build(){
index=[];
$$(".view").forEach(function(v){
var link=$('.nav a[href="#'+v.id+'"]'),name=link?link.textContent:(v.id==="privacy"?"Privacy":v.id);
$$("h1,h2,h3,summary,dt",v).forEach(function(el){
var extra="";
if(el.tagName==="SUMMARY")extra=el.parentNode.textContent;
else if(el.tagName==="DT")extra=el.parentNode.textContent;
else if(el.parentNode.classList.contains("panel")||el.parentNode.classList.contains("card-body"))extra=el.parentNode.textContent;
index.push({t:el.textContent.trim(),v:v.id,n:name,el:el,hay:(el.textContent+" "+extra+" "+name).toLowerCase()});
});
});
}
function close(){if(box){box.remove();box=null;btn.focus()}}
function pick(i){var r=hits[i];if(!r)return;close();var d=r.el.closest("details");if(d)d.open=true;go(r.v,r.el)}
function render(list,q){
list.textContent="";active=0;
var words=q.toLowerCase().split(/\s+/).filter(Boolean);
hits=words.length?index.filter(function(r){return words.every(function(w){return r.hay.indexOf(w)>=0})}).slice(0,8):[];
if(!words.length){list.appendChild(h("div",{class:"sx-empty",text:"Type to search services, products, guides, tools and glossary terms."}));return}
if(!hits.length){list.appendChild(h("div",{class:"sx-empty",text:"No results for “"+q+"”. Try a shorter word, such as migration or permissions."}));return}
hits.forEach(function(r,i){list.appendChild(h("button",{type:"button",class:"sx-item"+(i===0?" on":""),onclick:function(){pick(i)}},[h("span",{text:r.t}),h("small",{text:r.n})]))});
}
function open(){
if(box)return;if(!index)build();
var list=h("div",{class:"sx-list",role:"listbox"}),inp=h("input",{type:"search",id:"sx-input",placeholder:"Search this site","aria-label":"Search this site",autocomplete:"off"});
inp.addEventListener("input",function(){render(list,inp.value)});
inp.addEventListener("keydown",function(e){
var items=$$(".sx-item",list);
if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(!items.length)return;active=(active+(e.key==="ArrowDown"?1:items.length-1))%items.length;items.forEach(function(b,i){b.classList.toggle("on",i===active)});items[active].scrollIntoView({block:"nearest"})}
else if(e.key==="Enter"){e.preventDefault();pick(active)}
});
box=h("div",{class:"sx",role:"dialog","aria-modal":"true","aria-label":"Search"},[h("div",{class:"sx-box"},[inp,list])]);
box.addEventListener("click",function(e){if(e.target===box)close()});
document.body.appendChild(box);render(list,"");inp.focus();
}
btn.addEventListener("click",open);
document.addEventListener("keydown",function(e){
var typing=/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName||""));
if(e.key==="Escape"&&box){close();return}
if((e.key==="k"||e.key==="K")&&(e.ctrlKey||e.metaKey)){e.preventDefault();open()}
else if(e.key==="/"&&!typing){e.preventDefault();open()}
});
}

/* ---- 5. Glossary filter and print button on Resources ---- */
function resources(){
var dl=$("dl.gloss");if(!dl)return;
var none=h("p",{class:"sx-empty",text:"No matching terms.",hidden:""});
var inp=h("input",{type:"search",id:"gloss-filter",class:"filter",placeholder:"Filter terms, e.g. tenant","aria-label":"Filter glossary terms"});
inp.addEventListener("input",function(){
var q=inp.value.toLowerCase().trim(),shown=0;
$$("div",dl).forEach(function(d){var ok=!q||d.textContent.toLowerCase().indexOf(q)>=0;d.hidden=!ok;if(ok)shown++});
none.hidden=shown>0;
});
dl.parentNode.insertBefore(inp,dl);dl.parentNode.insertBefore(none,dl.nextSibling);
var head=$("#resources .page-head .wrap");
if(head)head.appendChild(actions([["Print the guides",function(){$$("#resources details").forEach(function(d){d.open=true});window.print()}]]));
}

/* ---- 6. Page helpers: progress bar, back to top, mobile booking bar ---- */
function helpers(){
var bar=h("div",{class:"progress","aria-hidden":"true"});
var top=h("button",{type:"button",class:"to-top","aria-label":"Back to top",hidden:"",onclick:function(){window.scrollTo(0,0)}});
top.innerHTML='<svg aria-hidden="true"><use href="#i-arrow"/></svg>';
var cta=h("div",{class:"m-cta"},[h("a",{class:"btn btn-primary",href:"#contact","data-topic":"Book a consultation",text:"Book a Consultation"})]);
document.body.appendChild(bar);document.body.appendChild(top);document.body.appendChild(cta);
function onScroll(){
var max=document.documentElement.scrollHeight-window.innerHeight,y=window.pageYOffset;
bar.style.width=(max>0?Math.min(100,y/max*100):0)+"%";top.hidden=y<600;
}
function onHash(){cta.hidden=location.hash==="#contact";setTimeout(onScroll,120)}
window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);
window.addEventListener("hashchange",onHash);onHash();
}

/* ---- 7. Contact form: saved draft, character count, email app link ---- */
function contact(){
var form=$("#contact-form");if(!form)return;
var ids=["f-name","f-email","f-company","f-msg"],draft=store.get("draft",{});
ids.forEach(function(id){var el=$("#"+id);if(draft[id]&&!el.value)el.value=draft[id];el.addEventListener("input",function(){draft[id]=el.value;store.set("draft",draft);if(id==="f-msg")count()})});
var msg=$("#f-msg"),c=h("div",{class:"count","aria-hidden":"true"});msg.parentNode.appendChild(c);
function count(){c.textContent=msg.value.length+" characters"}count();
form.addEventListener("submit",function(){
setTimeout(function(){
var ready=$("#f-ready"),email=(window.COMPANY&&window.COMPANY.email)||"";
if(ready.hidden||!email||$("#f-mailto"))return;
var body=$("#f-ready-text").textContent,subj=$("#f-topic").value;
$(".cta-actions",ready).appendChild(h("a",{id:"f-mailto",class:"btn btn-ghost",href:"mailto:"+email+"?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body),text:"Open in email app"}));
},0);
});
}

[readiness,copilot,brief,search,resources,helpers,contact].forEach(function(f){try{f()}catch(e){if(window.console)console.error(e)}});
})();
