const growth=document.querySelector('#growth');
const orbitSection=document.querySelector('.orbit-section');
const orbitModel=document.querySelector('#orbit-model');
const orbitCards=[...document.querySelectorAll('.orbit-card')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP=Boolean(window.gsap&&window.ScrollTrigger);

if(location.protocol==='file:'){
  const localNotice=document.createElement('aside');
  localNotice.className='local-preview-notice';
  localNotice.innerHTML='<strong>3D 本地预览需要启动器</strong><span>双击项目文件夹里的“打开本地网站.command”，骨骼模型就会正常加载。</span>';
  document.body.append(localNotice);
}

document.body.dataset.reduced=String(reduced);
if(hasGSAP)gsap.registerPlugin(ScrollTrigger);

let intro;
if(hasGSAP&&!reduced){
  intro=gsap.timeline({paused:true,defaults:{ease:'power3.out'}})
    .from('.title-line',{yPercent:105,autoAlpha:0,duration:1.15,stagger:.16},.8)
    .from('.positioning',{y:22,autoAlpha:0,duration:.75},1.28)
    .from('.site-header,.hero-bottom',{autoAlpha:0,duration:.8},1.62);
  growth.addEventListener('playing',()=>intro.play(),{once:true});
  setTimeout(()=>intro.play(),1800);
}

if(reduced){
  growth.removeAttribute('autoplay');
  growth.pause();
  growth.addEventListener('loadedmetadata',()=>{growth.currentTime=Math.max(0,growth.duration-.12)},{once:true});
}else{
  growth.play().catch(()=>intro?.progress(1));
}

document.querySelector('#replay').addEventListener('click',()=>{
  growth.currentTime=0;
  growth.play().catch(()=>{});
  intro?.restart();
  document.querySelector('#home').scrollIntoView({behavior:reduced?'auto':'smooth'});
});

const chapters=[
  {id:'ai-host',stage:'产品判断',title:'AI 主机产品设计',description:'核心 Agent 产品方案与记忆机制 0→1 前期设计。'},
  {id:'learning',stage:'企业提效',title:'新人学习与问答平台',description:'从模糊提效目标到 SaaS 学习平台与知识库 Agent。'},
  {id:'ai-memory',stage:'机制研究',title:'AI 记忆机制研究看板',description:'15 个开源方案、九个研究板块与交互式机制图解。'},
  {id:'workbench',stage:'工作流工具',title:'需求评审工作台',description:'把项目查询、需求差异、基线与评审记录放在一起。'},
  {id:'idol-skill',stage:'情感交互',title:'idol-skill',description:'分层记忆、情绪路由与 OOC 纠偏的开源陪伴 Agent。'}
];
let current=-1;

function positionOrbitCards(progress){
  const compact=innerWidth<768;
  const step=Math.PI*2/orbitCards.length;
  const travel=innerWidth*(compact?.4:.51);
  const states=orbitCards.map((card,index)=>{
    const angle=(progress*(orbitCards.length-1)-index)*step;
    const depth=(Math.cos(angle)+1)/2;
    return {card,index,angle,depth};
  });
  const visibleIndexes=new Set([...states].sort((a,b)=>b.depth-a.depth).slice(0,3).map(state=>state.index));
  states.forEach(({card,index,angle,depth})=>{
    const x=Math.sin(angle)*travel;
    const y=-Math.sin(angle)*(compact?42:88)-(1-depth)*(compact?8:18);
    const z=-(1-depth)*(compact?270:560);
    const scale=.38+Math.pow(depth,1.35)*.64;
    const rotationY=-Math.sin(angle)*58;
    const visible=visibleIndexes.has(index);
    const alpha=visible?.38+depth*.62:0;
    card.style.zIndex=String(Math.round(depth*100));
    card.classList.toggle('is-orbit-visible',visible);
    card.style.setProperty('--glass-light',String(.012+depth*.026));
    card.style.setProperty('--copy-alpha',String(compact?.04+Math.pow(depth,7)*.96:.08+Math.pow(depth,3)*.92));
    if(hasGSAP){
      gsap.set(card,{xPercent:-50,yPercent:-50,x,y,z,scale,rotationY,autoAlpha:alpha,transformOrigin:'50% 50%'});
    }else{
      card.style.opacity=String(alpha);
      card.style.transform=`translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${z}px) scale(${scale}) rotateY(${rotationY}deg)`;
    }
  });
}

function showChapter(value){
  const progress=Math.max(0,Math.min(1,value));
  const index=Math.min(chapters.length-1,Math.round(progress*(chapters.length-1)));
  positionOrbitCards(progress);
  document.querySelector('#progress').style.transform=`scaleX(${progress})`;
  orbitCards.forEach((card,cardIndex)=>{
    const active=cardIndex===index;
    card.classList.toggle('is-current',active);
    card.style.pointerEvents=active?'auto':'none';
    card.tabIndex=active?0:-1;
    card.setAttribute('aria-hidden',String(!active));
  });
  if(orbitModel){
    const compact=innerWidth<768;
    const scanY=(compact?16:20)-progress*(compact?42:54);
    const distance=(compact?90:78)-Math.sin(progress*Math.PI)*(compact?7:8);
    const boneScale=.96+Math.sin(progress*Math.PI)*.08;
    orbitModel.cameraOrbit=`${18+progress*320}deg 78deg ${distance}%`;
    if(hasGSAP)gsap.set(orbitModel,{y:`${scanY}vh`,scale:boneScale,transformOrigin:'50% 50%'});
    else orbitModel.style.transform=`translate3d(0,${scanY}vh,0) scale(${boneScale})`;
  }
  if(index!==current){
    current=index;
    const chapter=chapters[index];
    document.querySelector('#work-title').textContent=chapter.stage;
    document.querySelector('#chapter-title').textContent=chapter.title;
    document.querySelector('#chapter-description').textContent=chapter.description;
    document.querySelector('#chapter-open').dataset.project=chapter.id;
  }
}

if(reduced){
  orbitSection.classList.add('is-static');
  orbitCards.forEach(card=>{card.style.pointerEvents='auto';card.tabIndex=0;card.setAttribute('aria-hidden','false')});
}else{
  showChapter(0);
}

if(hasGSAP&&!reduced){
  gsap.to('.hero-copy',{yPercent:-18,autoAlpha:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 38%',scrub:true}});
  const orbitState={progress:0};
  gsap.to(orbitState,{
    progress:1,
    ease:'none',
    onUpdate:()=>showChapter(orbitState.progress),
    scrollTrigger:{trigger:orbitSection,start:'top top',end:()=>`+=${innerHeight*5.2}`,pin:'.orbit-sticky',scrub:1,invalidateOnRefresh:true}
  });
  ScrollTrigger.batch('.practice-media,.practice-links a',{
    start:'top 88%',
    once:true,
    interval:.08,
    batchMax:3,
    onEnter:items=>gsap.from(items,{y:34,autoAlpha:0,duration:.8,stagger:.1,ease:'power3.out',overwrite:'auto'})
  });
  gsap.from('.social-numbers>div',{y:38,autoAlpha:0,duration:.85,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.social-numbers',start:'top 78%',once:true}});
  gsap.from('.about-grid>*',{y:32,duration:.8,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.about-grid',start:'top 78%',once:true}});
  document.fonts.ready.then(()=>ScrollTrigger.refresh());
  addEventListener('load',()=>ScrollTrigger.refresh());
  orbitModel?.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
}

addEventListener('resize',()=>{
  if(!reduced)positionOrbitCards(Math.max(0,current)/(chapters.length-1));
});

let activeOverlay=null;
let overlayTrigger=null;
const main=document.querySelector('#main-content');
const siteHeader=document.querySelector('.site-header');

function setPageInert(value){
  if(value){main.setAttribute('inert','');siteHeader.setAttribute('inert','')}
  else{main.removeAttribute('inert');siteHeader.removeAttribute('inert')}
}

function revealOverlay(panel){
  activeOverlay=panel;
  panel.hidden=false;
  panel.scrollTop=0;
  document.body.classList.add('project-is-open');
  document.documentElement.style.overflow='hidden';
  setPageInert(true);
  if(hasGSAP&&!reduced){
    gsap.fromTo(panel,{autoAlpha:0,yPercent:3},{autoAlpha:1,yPercent:0,duration:.5,ease:'power3.out'});
    gsap.from(panel.querySelectorAll('.overlay-hero>*'),{y:34,autoAlpha:0,duration:.7,stagger:.08,ease:'power3.out',delay:.12});
  }
  panel.querySelector('[data-close-project]')?.focus();
}

function openProject(id,{push=true,trigger=document.activeElement}={}){
  const panel=document.querySelector(`[data-project-panel="${id}"]`);
  if(!panel)return;
  overlayTrigger=trigger;
  if(activeOverlay&&activeOverlay!==panel)activeOverlay.hidden=true;
  revealOverlay(panel);
  if(push&&history.state?.project!==id)history.pushState({project:id},'',`#project-${id}`);
}

function hideOverlay(){
  if(!activeOverlay)return;
  const panel=activeOverlay;
  const finish=()=>{
    panel.hidden=true;
    panel.removeAttribute('style');
    activeOverlay=null;
    document.body.classList.remove('project-is-open');
    document.documentElement.style.overflow='';
    setPageInert(false);
    overlayTrigger?.focus();
  };
  if(hasGSAP&&!reduced)gsap.to(panel,{autoAlpha:0,yPercent:2,duration:.3,ease:'power2.in',onComplete:finish});
  else finish();
}

document.querySelectorAll('[data-project]').forEach(control=>control.addEventListener('click',event=>{
  event.preventDefault();
  openProject(control.dataset.project,{trigger:control});
}));
document.querySelectorAll('[data-close-project]').forEach(button=>button.addEventListener('click',()=>{
  if(history.state?.project)history.back();
  else hideOverlay();
}));

addEventListener('popstate',event=>{
  if(event.state?.project)openProject(event.state.project,{push:false,trigger:overlayTrigger});
  else hideOverlay();
});

addEventListener('keydown',event=>{
  if(event.key==='Escape'&&activeOverlay){event.preventDefault();if(history.state?.project)history.back();else hideOverlay();return}
  if(event.key!=='Tab'||!activeOverlay)return;
  const focusable=[...activeOverlay.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')].filter(el=>el.offsetParent!==null);
  if(!focusable.length)return;
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
});

const initialProject=location.hash.startsWith('#project-')?location.hash.replace('#project-',''):'';
if(initialProject&&document.querySelector(`[data-project-panel="${initialProject}"]`))openProject(initialProject,{push:false,trigger:null});

const cinema=document.querySelector('#cinema');
const film=document.querySelector('#film');
let cinemaTrigger;
function openFilm(name,title,trigger){
  cinemaTrigger=trigger;
  film.src=`assets/${name}.mp4`;
  document.querySelector('#film-title').textContent=title;
  cinema.showModal();
  film.play().catch(()=>{});
}
document.querySelector('#watch-growth').addEventListener('click',event=>openFilm('growth','生长 / GROWTH',event.currentTarget));
document.querySelector('#watch-orbit').addEventListener('click',event=>openFilm('orbit','骨与轨道 / ORBIT',event.currentTarget));
document.querySelector('#close-cinema').addEventListener('click',()=>cinema.close());
cinema.addEventListener('click',event=>{if(event.target===cinema)cinema.close()});
cinema.addEventListener('close',()=>{film.pause();film.removeAttribute('src');film.load();cinemaTrigger?.focus()});
growth.addEventListener('error',()=>{});
film.addEventListener('error',()=>{if(film.getAttribute('src'))document.querySelector('#film-title').textContent='视频加载失败，请关闭后重试。'});
