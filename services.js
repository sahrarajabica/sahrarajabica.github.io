/* SR-MS Solutions: one page per service, the service grid, and related navigation. Content lives in SV. */
(function(){
"use strict";
var S=window.SRMS;if(!S)return;
var $=S.$,$$=S.$$,h=S.h;
var SV=[
{id:"svc-migration",g:"Microsoft 365 and cloud",icon:"i-move",n:"Cloud & Data Migration",topic:"Cloud & Data Migration",
l:"Migrate your content, applications, and file shares to the cloud with minimal disruption.",
who:"Organizations still working from a file server, an older SharePoint version or scattered cloud drives.",
does:["SharePoint migration (on-prem to online)","File shares to SharePoint Online","Data migration to the cloud","Migration planning & governance"],
gets:["Inventory of sources, sizes and owners","Mapping of each source to its new home","Permission review and clean-up plan","Wave schedule with verification reports"],
steps:[["Assess","We inventory what you have and flag the risks."],["Plan","You approve what moves where, and when."],["Migrate","Content moves in verified waves, usually outside working hours."]]},
{id:"svc-m365",g:"Microsoft 365 and cloud",icon:"i-box",n:"Microsoft 365 Implementation",topic:"Microsoft 365 Implementation",
l:"Implement and optimize Microsoft 365 tools for a more connected, secure, and productive workplace.",
who:"Teams that own Microsoft 365 licences but use only part of what they pay for.",
does:["SharePoint Online implementation","OneDrive implementation","Microsoft Teams implementation","M365 tools integration & adoption"],
gets:["Site and team structure that matches how you work","Naming, sharing and retention settings agreed up front","Training sessions and short how-to guides","Handover documentation for your administrators"],
steps:[["Design","We agree a site, team and sharing structure that fits how you work."],["Build","We configure SharePoint, OneDrive and Teams and connect the tools you use."],["Adopt","We train your people and hand over clear documentation."]]},
{id:"svc-ai",g:"Microsoft 365 and cloud",icon:"i-spark",n:"AI Readiness & Advisory",topic:"AI Readiness & Advisory",
l:"Assess your readiness for AI and unlock the value of Microsoft 365 Copilot and AI capabilities securely and responsibly.",
who:"Organizations planning to use Microsoft 365 Copilot or other AI tools with their own content.",
does:["AI readiness assessment","Data & information readiness","Microsoft 365 Copilot readiness","Governance, security & risk review"],
gets:["Findings on oversharing and stale content","Prioritized list of fixes before rollout","Recommended pilot group and use cases","Usage and governance guidelines for staff"],
steps:[["Assess","We review your data, security settings and how people share."],["Fix","We help you close the gaps that would make AI answers wrong or risky."],["Pilot","A small group starts first, with clear guidelines and measures."]]},
{id:"svc-pm",g:"Projects and people",icon:"i-chart",n:"Project Management Services",topic:"Project Management Services",
l:"Hands-on project management for IT and business change, so your project has a plan, an owner and a finish line.",
who:"Organizations with an IT or change project to deliver and nobody free to run it.",
does:["Project planning: scope, schedule and budget","Coordination of your team, vendors and stakeholders","Risk and issue tracking with clear escalation","Regular status reports in plain language","Recovery of projects that are off track"],
gets:["A project plan with milestones and owners","A risk and issue log kept up to date","Status updates on an agreed schedule","A closing report with lessons learned"],
steps:[["Define","We agree goals, scope, roles and how success is measured."],["Run","We manage the plan, the people and the risks week by week."],["Close","We hand over, record what was delivered and review the lessons."]]},
{id:"svc-coaching",g:"Projects and people",icon:"i-people",n:"IT Coaching",topic:"IT Coaching",
l:"One-to-one and small-group coaching that builds skill and confidence in Microsoft 365 and everyday IT.",
who:"Business owners, managers, IT staff and career changers who learn best with a guide beside them.",
does:["One-to-one coaching for leaders and business owners","Coaching for IT staff taking on Microsoft 365 administration","Guidance on Microsoft certification paths and study plans","Hands-on sessions built around your own real tasks"],
gets:["A personal learning plan with clear goals","Coaching sessions on a schedule that suits you","Practice tasks between sessions","A progress review at the end of the plan"],
steps:[["Listen","We learn where you are now and what you want to be able to do."],["Coach","Regular sessions on real tasks, at your pace."],["Review","We check progress against your goals and set next steps."]]},
{id:"svc-training",g:"Projects and people",icon:"i-cal",n:"Training & Adoption",topic:"Training & Adoption",
l:"Practical training that helps your people use Teams, SharePoint, OneDrive and Copilot in their daily work.",
who:"Organizations rolling out new tools, and teams that never had proper training on the ones they have.",
does:["Workshops on Teams, SharePoint and OneDrive","Role-based sessions for staff, site owners and administrators","Short how-to guides written for your setup","Adoption planning with internal champions"],
gets:["A training plan matched to roles","Live sessions with time for questions","Quick reference guides to keep","A feedback summary after each session"],
steps:[["Plan","We find out who needs to learn what."],["Teach","Short, practical sessions using your own sites and files."],["Reinforce","Guides and follow-up sessions so the new habits stay."]]},
{id:"svc-support",g:"Ongoing help",icon:"i-shield",n:"Microsoft 365 Support",topic:"Microsoft 365 Support",
l:"Ongoing help to keep your Microsoft 365 environment tidy, secure and working for your team.",
who:"Small and mid-sized organizations without a full-time Microsoft 365 administrator.",
does:["User, licence and group administration","Site, team and permission requests","Regular health and security checks","Advice when Microsoft changes or adds features"],
gets:["A consistent point of contact who knows your setup","An agreed way to raise requests","Health check summaries on a regular schedule","Recommendations you can act on"],
steps:[["Onboard","We learn your environment and agree what is covered."],["Support","We handle requests and routine administration."],["Improve","Regular reviews turn recurring issues into lasting fixes."]]},
{id:"svc-consult",g:"Ongoing help",icon:"i-mail",n:"Consultations",topic:"Book a consultation",
l:"Not ready for a project? Start with a conversation. We consult for individuals and for organizations of any size.",
who:"Anyone with a Microsoft 365, migration or IT question who wants an informed second opinion.",
does:["Single sessions on one specific question","Structured assessments with written findings","Ongoing advisory as your environment grows"],
gets:["Clear answers in plain language","A short written summary","Recommended next steps, in order"],
steps:[["Book","Tell us what you need help with."],["Talk","We work through your situation together."],["Follow up","You receive a written summary and next steps."]]}
];
var BY={};SV.forEach(function(s){BY[s.id]=s});
function icon(id){var w=document.createElement("span");w.innerHTML='<svg aria-hidden="true"><use href="#'+id+'"/></svg>';return w.firstChild}
function ticks(list){return h("ul",{class:"ticks"},list.map(function(t){return h("li",{text:t})}))}
function more(text){var m=h("span",{class:"more",text:text});m.appendChild(icon("i-arrow"));return m}

function detail(s){
var v=document.getElementById(s.id);if(!v)return;
var back=h("a",{class:"back",href:"#services"},[icon("i-arrow"),h("span",{text:"All services"})]);
var cta=h("a",{class:"btn btn-primary",href:"#contact","data-topic":s.topic,text:"Book a consultation"});cta.appendChild(icon("i-arrow"));
v.appendChild(h("section",{class:"mesh page-head"},[h("div",{class:"wrap"},[back,h("p",{class:"label",text:s.g}),h("h1",{text:s.n}),h("p",{class:"lede",text:s.l}),h("div",{class:"row-actions"},[cta])])]));
var steps=h("ol",{class:"steps steps3"},s.steps.map(function(st,i){return h("li",{},[h("span",{class:"n",text:"0"+(i+1)}),h("h3",{text:st[0]}),h("p",{text:st[1]})])}));
var others=h("div",{class:"opts"},SV.filter(function(o){return o.id!==s.id}).map(function(o){return h("a",{class:"opt",href:"#"+o.id,text:o.n})}));
v.appendChild(h("section",{class:"section"},[h("div",{class:"wrap svc-body"},[
h("div",{class:"two"},[h("div",{class:"panel"},[h("h3",{text:"What we do"}),ticks(s.does)]),h("div",{class:"panel"},[h("h3",{text:"What you receive"}),ticks(s.gets)])]),
h("div",{class:"who"},[h("strong",{text:"Who it is for"}),h("span",{text:s.who})]),
h("div",{},[h("h2",{text:"How it works"}),steps]),
h("div",{},[h("span",{class:"fl",text:"Other services"}),others])
])]));
}
function grid(){
var root=$("#svc-grid");if(!root)return;
SV.forEach(function(s){
var top=h("div",{class:"card-top"},[h("span",{class:"ico"},[icon(s.icon)])]);
root.appendChild(h("a",{class:"card",href:"#"+s.id},[top,h("div",{class:"card-body"},[h("h3",{text:s.n}),h("p",{text:s.l}),more("Learn more")])]));
});
}
function topics(){
var sel=$("#f-topic");if(!sel)return;
var have={},last=sel.options[sel.options.length-1],i;for(i=0;i<sel.options.length;i++)have[sel.options[i].text]=1;
SV.forEach(function(s){if(!have[s.topic]){sel.insertBefore(h("option",{text:s.topic}),last);have[s.topic]=1}});
}
function footer(){
var first=$('.foot a[href="#svc-migration"]');if(!first)return;
var ul=first.closest("ul");ul.textContent="";
SV.forEach(function(s){ul.appendChild(h("li",{},[h("a",{href:"#"+s.id,text:s.n})]))});
}
function mark(){
var s=BY[(location.hash||"").replace("#","")];if(!s)return;
document.title=s.n+" | SR-MS Solutions Inc.";
var link=$('.nav a[href="#services"]');if(link)link.setAttribute("aria-current","page");
}
[function(){SV.forEach(detail)},grid,topics,footer,mark].forEach(function(f){try{f()}catch(e){if(window.console)console.error(e)}});
window.addEventListener("hashchange",mark);
})();
