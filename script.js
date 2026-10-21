// script.js: all behavior for the portfolio. Everything is inside one function so nothing leaks into the global scope.

(function(){
  // DATA: one object per project. t=title, d=description, c=filter category, art=cover recipe, v=[3 cover colors].
  // To add a project: add an object here AND a matching entry in `details` below.
  var projects=[
    {t:"iPKRAS",img:"images/001.png",d:"Registration and availability website for active PhilHealth members.",c:"sofdev",tags:"HTML, CSS, JavaScript, React, Selenium, SQL",art:"a2",v:["#e4572e","#f6e8c3","#1d2b53"]},
    {t:"TimeLine",img:"images/002.png",d:"A companion program created utilizing Java and JavaFX with the goal of helping its users efficiently use their time.",c:"sofdev",tags:"Java, JavaFX",art:"a1",v:["#0b3c5d","#ffb400","#7fb7d9"]},
    {t:"ValoVision",img:"images/003.png",d:"Accurate and real-time detection of agent heads in videogame gameplay footage using YoloV8",c:"ai/ml",tags:"Python, Computer Vision, Machine Learning, YoloV8",art:"a3",v:["#d9f0e6","#2a9d8f","#264653"]},
    {t:"Cyclone Prediction",img:"images/004.png",d:"Application of generative models to predict tropical cyclone paths in the Philippines.",c:"ai/ml",tags:"Python, Computer Vision, Machine Learning, GAN, ConvLSTM-CNN",art:"a2",v:["#2b2d42","#8d99ae","#edf2f4"]},
    {t:"IoT Farm",img:"images/005.png",d:"Automated IoT Vertical farm with both Software and Hardware implementation.",c:"others",tags:"Arduino, Web Development, HTML, CSS, JavaScript, Firebase",art:"a1",v:["#f2cc8f","#81b29a","#3d405b"]},
  ];
  // COVER IMAGES: looks for images/<slug>.jpg (e.g. images/tideline.jpg), or the path in a project's
  // optional `img` field (e.g. img:"images/my-photo.png"), and an optional `alt` for screen readers.
  // The CSS-drawn art is always rendered underneath, so if the image file is missing,
  // onerror removes the broken <img> and the art shows instead.
  function coverHTML(p){
    var src=p.img||"images/"+slug(p.t)+".jpg";
    var alt=(p.alt||p.t+" project preview").replace(/"/g,"&quot;");
    return '<div class="cover" style="--c1:'+p.v[0]+';--c2:'+p.v[1]+';--c3:'+p.v[2]+'">'+
      '<div class="art '+p.art+'"></div>'+
      '<img src="'+src+'" alt="'+alt+'" loading="lazy" onerror="this.remove()"></div>';
  }

  // Build the home page cards from the data above. Each links to #/work/<slug>.
  var grid=document.getElementById("grid"),empty=document.getElementById("empty");
  projects.forEach(function(p){
    var a=document.createElement("a");
    a.className="card";a.href="#/work/"+slug(p.t);a.dataset.c=p.c;
    a.setAttribute("aria-label",p.t+": "+p.d);
    a.innerHTML=coverHTML(p)+
      '<div class="body"><h3>'+p.t+'</h3><p>'+p.d+'</p><span class="meta">'+p.tags+'</span></div>';
    grid.appendChild(a);
  });

  // FILTERING: clicking a chip marks it pressed, then shows or hides cards by category.
  var chips=document.querySelectorAll(".chip");
  chips.forEach(function(ch){
    ch.addEventListener("click",function(){
      var f=ch.dataset.f,shown=0;
      chips.forEach(function(c){c.setAttribute("aria-pressed",c===ch?"true":"false")});
      grid.querySelectorAll(".card").forEach(function(card){
        var ok=f==="all"||card.dataset.c===f;
        card.hidden=!ok;if(ok)shown++;
      });
      empty.hidden=shown>0;
    });
  });

  // THEME TOGGLE: saves the choice in localStorage (in try/catch, since storage can be blocked).
  var root=document.documentElement;
  try{var saved=localStorage.getItem("theme");if(saved)root.setAttribute("data-theme",saved);}catch(e){}
  document.getElementById("theme").addEventListener("click",function(){
    var dark=root.getAttribute("data-theme")==="dark"||(!root.getAttribute("data-theme")&&matchMedia("(prefers-color-scheme: dark)").matches);
    var next=dark?"light":"dark";
    root.setAttribute("data-theme",next);
    try{localStorage.setItem("theme",next);}catch(e){}
  });

  // TOAST + COPY EMAIL: uses the Clipboard API, with a friendly fallback message.
  var toast=document.getElementById("toast"),timer;
  function say(m){toast.textContent=m;toast.classList.add("show");clearTimeout(timer);timer=setTimeout(function(){toast.classList.remove("show")},2200)}
  document.getElementById("copy").addEventListener("click",function(){
    var addr="joa.tibayan@gmail.com";
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(addr).then(function(){say("Email address copied")},function(){say("Copy failed. Use the email button instead.")});
    }else{say("Copy isn’t available here. Use the email button instead.")}
  });
  // Footer year stays current automatically.
  document.getElementById("year").textContent=new Date().getFullYear();

  /* Project pages: #/work/<slug> */
  // PROJECT PAGES (a tiny hash router): #/work/<slug> shows a case study; any other hash shows the home page.
  // slug() turns "Kapitbahay Market" into "kapitbahay-market".
  function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-")}
  // Case study text for each project, keyed by slug. Replace the placeholder copy and figures with your own.
  var details={
    "ipkras": {
           year:"2024"
          ,role:"Front-end and Back-end development"
          ,tools:"IntelliJ, Apache Tomcat, SourceTree, Figma, MySQL, Postman"
          ,lede:"Registration and availability website for active PhilHealth members."
          ,synopsis:"Contributed to full-stack registration and availment website serving 10,000+ users by integrating front-end and back-end technologies, including Java, " +
          "JavaScript, Bootstrap, SQL, JSP, and Servlets. Maintained codebase integrity through version control and collaborative development using Sourcetree and WampServer for " +
          "local development. Ensured API reliability and security through endpoint testing with Postman, validating accurate and consistent data exchanges. Implemented SQL transactions " +
          "and AJAX with Servlet methods within JSP files to facilitate secure database communication, while enhancing user security and accessibility through responsive interfaces. " +
          "Additionally, developed Selenium scripts to automate web scraping of 1,000+ client records per minute, accelerating data collection and reducing manual errors."
          ,techstack:"Java, JavaScript, Selenium, MySQL, Python, HTML, CSS"
    },
    "timeline": {
          year:"2021"
          ,role:"Developer and Designer"
          ,tools:"IntelliJ Idea"
          ,lede:"A companion program created utilizing Java and JavaFX with the goal of helping its users efficiently use their time. "
          ,synopsis:"A companion program created utilizing Java and JavaFX with the goal of helping its users efficiently use their time. Through functions such as: keeping track of their productivity; setting up their personal schedule, " +
          "and even giving randomly generated tips in helping manage their time efficiently. The designs aim to allow the user to create a 7-day schedule with all the chosen tasks to their liking, even allowing them to set a timer as a reminder and use a stopwatch to measure the elapsed time in completing a task."
          ,techstack:"Java, JavaFX"
    },
    "valovision": {
          year:"2024"
          ,role:"Hyperparameter Tuning, Annotation"
          ,tools:"PyCharm, Google Collab, CVAT"
          ,lede:"accurate and real-time detection of agent heads in videogame gameplay footage using YoloV8"
          ,synopsis:"Developed a computer vision system using YOLOv8 to detect and identify the heads of five selected Valorant agents: Cypher, KAY/O, Phoenix, Skye, and Viper. Collected 1,426 gameplay images and expanded the dataset to 2,351 images through " +
          "preprocessing and data augmentation to improve detection under varying distances and backgrounds. Trained and evaluated YOLOv8n and YOLOv8x, comparing their detection accuracy and processing speed. Results showed that YOLOv8x achieved higher accuracy " +
          "across all five agents, while YOLOv8n processed frames faster at 4–7 milliseconds per frame compared to YOLOv8x's 10 milliseconds. The project demonstrated the application of computer vision and deep learning in real-time game footage analysis, with " +
          "potential uses in target tracking, gameplay analysis, and player training."
          ,techstack:"Python, TensorFlow, PyTorch, Keras, Scikit, CVAT"
      },
    "cyclone-prediction": {
          year:"2024"
          ,role:"Training, Hyperparameter Tuning, Annotation"
          ,tools:"PyCharm, Google Collab, CVAT"
          ,lede:"A cash-flow dashboard that explains itself in plain sentences."
          ,synopsis:"Developed a deep learning model for tropical cyclone path prediction in the Philippines using a combination of ConvLSTM and Generative Adversarial Networks (GANs). Using 119 historical typhoon path images from PAGASA covering 2018 to 2024, " +
          "the project applied image preprocessing and Sobel edge detection to extract storm trajectories and convert them into coordinate data. The model used spatial and temporal patterns to generate potential future storm paths, with training optimized through " +
          "the Adam optimizer and hyperparameter tuning. Initial results showed that the model could identify and generate storm trajectory patterns, although further improvements in model architecture and training are needed to increase prediction accuracy. The project " +
          "explored the potential of generative deep learning models to support tropical cyclone forecasting and disaster preparedness in the Philippines."
          ,techstack:"Python, TensorFlow, PyTorch, Keras, Scikit, CVAT"
      },
    "iot-farm":{
          year:"2025"
          ,role:"SQL Implementation and Arduino Design"
          ,tools:"Firebase, Arduino"
          ,lede:"Automated IoT Vertical farm with both Software and Hardware implementation."
          ,synopsis:"Helped developed the back-end implementation and hardware implementation of a IoT Vertical farm. created the initial data required for Firebase and its connectivity to the website developed for the IoT Farm."
          ,techstack:"Firebase, JavaScript, HTML, CSS, Arduino"
    }
  };
  // home = the home <main>, page = the empty <main> that showProject() fills.
  var home=document.getElementById("top"),page=document.getElementById("project"),baseTitle=document.title;
  // Builds a previous/next link for the bottom of a project page.
  function card(p,label,cls){
    return '<a class="'+cls+'" href="#/work/'+slug(p.t)+'"><small>'+label+'</small><strong>'+p.t+'</strong></a>';
  }
  // Fills the project page, hides the home page, updates the tab title, scrolls to top,
  // and focuses the heading so screen readers announce the change.
  function showProject(i){
    var p=projects[i],d=details[slug(p.t)];
    var prev=projects[(i+projects.length-1)%projects.length],next=projects[(i+1)%projects.length];
    page.innerHTML='<div class="wrap detail"><a class="back" href="#work">Back to all work</a>'+
      '<h1 tabindex="-1">'+p.t+'</h1><p class="lede">'+d.lede+'</p>'+
      coverHTML(p)+
      '<dl class="facts"><div><dt>Role</dt><dd>'+d.role+'</dd></div><div><dt>Year</dt><dd>'+d.year+'</dd></div><div><dt>Tools</dt><dd>'+d.tools+'</dd></div></dl>'+
      '<div class="case"><div><h2>Synopsis</h2><p>'+d.synopsis+'</p></div><div><h2>Tech Stack</h2><p>'+d.techstack+'</p></div></div>'+
      '<div class="pager">'+card(prev,"Previous project","prev")+card(next,"Next project","next")+'</div>'+
      '<a class="btn" style="background:var(--accent);color:var(--on-accent);border-color:var(--accent)" href="#contact">Start a project like this</a></div>';
    home.hidden=true;page.hidden=false;
    document.title=p.t+" — Joshua Tibayan";
    window.scrollTo(0,0);
    page.querySelector("h1").focus({preventScroll:true});
  }
  // Reads location.hash: a valid project slug opens that page; otherwise show home and scroll to the section named in the hash.
  function route(){
    var m=location.hash.match(/^#\/work\/([a-z0-9-]+)/),i=-1;
    if(m)projects.forEach(function(p,n){if(slug(p.t)===m[1])i=n});
    if(i>-1){showProject(i);return}
    page.hidden=true;home.hidden=false;document.title=baseTitle;
    var id=location.hash.slice(1),el=id&&document.getElementById(id);
    if(el)el.scrollIntoView();else window.scrollTo(0,0);
  }
  // Re-route on every hash change (links, back/forward buttons). The line after handles opening a project link directly.
  window.addEventListener("hashchange",route);
  if(location.hash)route();
})();
