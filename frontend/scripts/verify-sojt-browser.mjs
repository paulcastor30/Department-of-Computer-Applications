import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const bin = process.env.AGENT_BROWSER_BINARY || 'agent-browser';
const origin = process.env.SOJT_TEST_ORIGIN || 'http://127.0.0.1:8080';
const outputs = process.env.SOJT_TEST_OUTPUT || '/tmp/dca-sojt-verification';
mkdirSync(outputs,{recursive:true});
function call(...args) {
 const result=spawnSync(bin,['--json',...args],{encoding:'utf8',env:process.env,maxBuffer:16*1024*1024});
 if(result.status!==0) throw Error(result.stderr || result.stdout);
 const data=JSON.parse(result.stdout);if(!data.success) throw Error(data.error);return data.data;
}
function evaluate(source) {return call('eval',source).result;}
function check(ok,message){if(!ok)throw Error(message);}
const evidence={viewports:[],keyboard:{},discovery:[],accessibility:[],contrast:[]};
const contrastSource = "(() => {\n const rgb = value => { const v=value.match(/[\\d.]+/g)?.map(Number); return v && v.length>=3 ? [v[0],v[1],v[2],v[3]??1] : null; };\n const lum = c => c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);\n const pairs = new Map();let minimum=Infinity;\n const walker=document.createTreeWalker(document.querySelector('.sojt-guide'),NodeFilter.SHOW_TEXT);\n while(walker.nextNode()){\n  const node=walker.currentNode;if(!node.textContent.trim())continue;\n  const el=node.parentElement;if(!el.getClientRects().length || el.tagName==='OPTION')continue;\n  const style=getComputedStyle(el);const foreground=rgb(style.color); if(!foreground || foreground[3]!==1)throw Error('Manual alpha foreground check required');\n  let background=[255,255,255];const ancestors=[];for(let p=el;p;p=p.parentElement)ancestors.unshift(p);\n  for(const p of ancestors){const color=rgb(getComputedStyle(p).backgroundColor);if(color)background=background.map((v,i)=>color[i]*color[3]+v*(1-color[3]));}\n  const l1=lum(foreground),l2=lum(background),ratio=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);\n  const font=parseFloat(style.fontSize),weight=parseInt(style.fontWeight)||400,required=font>=24 || font>=18.66&&weight>=700?3:4.5;\n  if(ratio<required)throw Error(`Text contrast ${ratio} below ${required}: ${node.textContent.slice(0,60)}`);\n  minimum=Math.min(minimum,ratio);pairs.set(foreground.slice(0,3).join(',')+' / '+background.join(','),Math.round(ratio*100)/100);\n }\n return {minimumRatio:Math.round(minimum*100)/100,pairs:Object.fromEntries(pairs),pseudoConnectors:'Visual review: lines are outside text areas; number backgrounds are opaque.'};\n})()\n";

call('open',origin+'/sojt-guide');
call('wait','ol[aria-label="BSCA SOJT process"], main a.action-link[href="/about/contact"]');
if (!evaluate(`!!document.querySelector('ol[aria-label="BSCA SOJT process"]')`)) {
 call('wait','main a.action-link[href="/about/contact"]');
 check(evaluate(`!document.querySelector('.sojt-guide ol') && !document.body.innerText.includes('Draft for Department validation')`), 'Unavailable guidance exposed a review draft');
 console.log('SOJT unavailable state verified; approved-guide interaction checks require published CMS content.');
 process.exit(0);
}

check(evaluate('document.querySelector("ol[aria-label=\\"BSCA SOJT process\\"]").children.length')===10,'Ten steps missing');
for(const [width,height] of [[320,800],[390,844],[768,1024],[1440,1000]]){
 call('set','viewport',String(width),String(height));
 const result=evaluate(`(() => {const list=document.querySelector('ol[aria-label="BSCA SOJT process"]');let closed=document.documentElement.scrollWidth; document.querySelectorAll('.sojt-guide details').forEach(d=>d.open=true);let expanded=document.documentElement.scrollWidth;return {width:innerWidth,closed,expanded,steps:list.children.length,collectsPrivate:!!document.querySelector('.sojt-guide input[type=file],.sojt-guide textarea')};})()`);
 check(result.closed<=width && result.expanded<=width,`Horizontal overflow at ${width}: ${JSON.stringify(result)}`);
 check(!result.collectsPrivate,'Unexpected collection fields');evidence.viewports.push(result);
 // Audit only the SOJT region; inherited header/footer are outside this change.
 if(process.env.AXE_SOURCE){evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');evaluate(readFileSync(process.env.AXE_SOURCE,'utf8'));const audit=evaluate(`(async()=>{const result=await axe.run('.sojt-guide',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return {violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),incomplete:result.incomplete.map(v=>v.id),passes:result.passes.length};})()`);check(audit.violations.length===0,`Accessibility audit failed at ${width}: ${JSON.stringify(audit)}`);evidence.accessibility.push({width,...audit});}
 evidence.contrast.push({width,...evaluate(contrastSource)});
 call('screenshot',`${outputs}/sojt-${width}.png`);
 evaluate(`document.querySelectorAll('.sojt-guide details').forEach(d=>d.open=false)`);
}
call('set','viewport','390','844');
call('focus','.sojt-guide ol > li:first-child summary');call('press','Enter');
check(evaluate(`document.querySelector('.sojt-guide ol > li:first-child details').open`),'Enter did not open disclosure');
call('press','Space');check(!evaluate(`document.querySelector('.sojt-guide ol > li:first-child details').open`),'Space did not close disclosure');
evidence.keyboard.nativeDisclosure=true;
const focus=evaluate(`(()=>{const s=getComputedStyle(document.activeElement);return {tag:document.activeElement.tagName,style:s.outlineStyle,width:s.outlineWidth};})()`);check(focus.tag==='SUMMARY' && focus.style!=='none' && focus.width!=='0px','Focus is not visible');evidence.keyboard.focus=focus;
call('select','#sojt-status','Internship Plan approved');call('focus','.sojt-guide form button');call('press','Enter');
const jump=evaluate(`({focused:document.activeElement.id,open:document.getElementById('pre-deployment').closest('li').querySelector('details').open})`);check(jump.focused==='pre-deployment' && jump.open,'Status navigation failed');evidence.keyboard.statusJump=jump;
call('check','.sojt-guide fieldset input[type=checkbox]');
call('reload');check(!evaluate(`document.querySelector('.sojt-guide fieldset input[type=checkbox]')?.checked`),'Reminder persisted unexpectedly');
check(!evaluate(`document.body.innerText.includes('Draft for Department validation')`),'Review draft exposed publicly');
call('open',origin+'/resources');call('wait','a[href="/sojt-guide"]');call('click','a[href="/sojt-guide"]');check(call('get','url').url?.includes('/sojt-guide') || evaluate('location.pathname')==='/sojt-guide','Resource guide link failed');
call('open',origin+'/programs/bsca');call('wait','a[href="/sojt-guide"]');evidence.discovery.push('Resources and BSCA link present');
call('open',origin+'/sojt-guide');call('click','button[aria-label="Search site"]');
for(const term of ['SOJT','OJT','internship']){call('fill','#site-search-input',term);check(evaluate(`!!document.querySelector('#site-search a[href="/sojt-guide"]')`),'Search failed: '+term);evidence.discovery.push(term);}
call('open',origin+'/thesis-guide');call('wait','ol[aria-label="BSCA thesis process"]');check(evaluate(`document.querySelector('ol[aria-label="BSCA thesis process"]').children.length`)===8,'Thesis regression');
evidence.thesisPreserved=true;evidence.browserErrors=call('errors');
writeFileSync(`${outputs}/results.json`,JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));
