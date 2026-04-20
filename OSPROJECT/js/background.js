// ═══════════════════════════════════════
//  3D BACKGROUND — Three.js (Enhanced)
// ═══════════════════════════════════════
(function(){
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x030610, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 30);

  // ── FOG ──
  scene.fog = new THREE.FogExp2(0x030610, 0.018);

  // ── STAR FIELD ──
  const starGeo = new THREE.BufferGeometry();
  const starCount = 2200;
  const starPos = new Float32Array(starCount*3);
  const starCols = new Float32Array(starCount*3);
  for(let i=0;i<starCount;i++){
    starPos[i*3]   = (Math.random()-0.5)*220;
    starPos[i*3+1] = (Math.random()-0.5)*220;
    starPos[i*3+2] = (Math.random()-0.5)*220;
    // tint slightly cyan/purple randomly
    const t = Math.random();
    starCols[i*3]   = 0.5+t*0.5;
    starCols[i*3+1] = 0.7+t*0.2;
    starCols[i*3+2] = 1.0;
  }
  starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));
  starGeo.setAttribute('color',new THREE.BufferAttribute(starCols,3));
  const starMat = new THREE.PointsMaterial({size:0.16,vertexColors:true,transparent:true,opacity:0.75,sizeAttenuation:true});
  scene.add(new THREE.Points(starGeo, starMat));

  // ── FLOATING PARTICLES ──
  const partCount = 380;
  const partGeo = new THREE.BufferGeometry();
  const partPos = new Float32Array(partCount*3);
  const partCols = new Float32Array(partCount*3);
  const partVel = [];
  const palette = [
    [0,0.83,1],[0.66,0.33,0.97],[0,1,0.64],[1,0.42,0.21],[0.2,0.7,1]
  ];
  for(let i=0;i<partCount;i++){
    const r = 13+Math.random()*20;
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos(Math.random()*2-1);
    partPos[i*3]   = r*Math.sin(phi)*Math.cos(theta);
    partPos[i*3+1] = r*Math.sin(phi)*Math.sin(theta);
    partPos[i*3+2] = r*Math.cos(phi)-6;
    partVel.push({x:(Math.random()-0.5)*0.013,y:(Math.random()-0.5)*0.013,z:(Math.random()-0.5)*0.009});
    const c = palette[Math.floor(Math.random()*palette.length)];
    partCols[i*3]=c[0]; partCols[i*3+1]=c[1]; partCols[i*3+2]=c[2];
  }
  partGeo.setAttribute('position',new THREE.BufferAttribute(partPos,3));
  partGeo.setAttribute('color',new THREE.BufferAttribute(partCols,3));
  const partMat = new THREE.PointsMaterial({size:0.38,vertexColors:true,transparent:true,opacity:0.9,sizeAttenuation:true});
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // ── WIREFRAME GEOMETRIES ──
  function makeWire(geo,col,x,y,z){
    const mat = new THREE.MeshBasicMaterial({color:col,wireframe:true,opacity:0.08,transparent:true});
    const m = new THREE.Mesh(geo,mat);
    m.position.set(x,y,z);
    scene.add(m); return m;
  }
  const objs = [
    makeWire(new THREE.IcosahedronGeometry(5,1),   0x00d4ff, -15, 7, -12),
    makeWire(new THREE.OctahedronGeometry(4,0),    0xa855f7,  17,-6, -16),
    makeWire(new THREE.TorusGeometry(5.5,1.3,9,22),0x00ffa3,  0,-12,-22),
    makeWire(new THREE.IcosahedronGeometry(3,0),   0xff6b35, 11, 11, -13),
    makeWire(new THREE.OctahedronGeometry(5.5,1),  0x00d4ff,-20, -9, -24),
    makeWire(new THREE.IcosahedronGeometry(2.5,1), 0xa855f7,  8, -14,-10),
  ];

  // ── TORUS RINGS ──
  function makeRing(r,tube,col,x,y,z,rx,ry){
    const geo = new THREE.TorusGeometry(r,tube,6,60);
    const mat = new THREE.MeshBasicMaterial({color:col,opacity:0.045,transparent:true,side:THREE.DoubleSide});
    const m = new THREE.Mesh(geo,mat);
    m.position.set(x,y,z);m.rotation.set(rx,ry,0);
    scene.add(m); return m;
  }
  const rings = [
    makeRing(20,0.04,0x00d4ff, 0,0,-18, Math.PI/4, 0.3),
    makeRing(26,0.03,0xa855f7, 0,0,-22, 0.5,Math.PI/3),
    makeRing(15,0.05,0x00ffa3, 0,0,-11, Math.PI/2.5,Math.PI/5),
    makeRing(12,0.03,0xff6b35, 3,2,-8,  Math.PI/3, Math.PI/4),
  ];

  // ── GRID PLANE ──
  const grid = new THREE.GridHelper(100,50,0x001428,0x000c1e);
  grid.position.y = -22;
  grid.material.opacity = 0.28;
  grid.material.transparent = true;
  scene.add(grid);

  // ── CPU CORE CUBE (floating icon) ──
  const cubeGeo = new THREE.BoxGeometry(2.5,2.5,2.5);
  const cubeMat = new THREE.MeshBasicMaterial({color:0x00d4ff,wireframe:true,opacity:0.12,transparent:true});
  const cube = new THREE.Mesh(cubeGeo,cubeMat);
  cube.position.set(0,0,-5);
  scene.add(cube);

  // ── MOUSE PARALLAX ──
  let mx=0,my=0;
  document.addEventListener('mousemove',e=>{
    mx = (e.clientX/window.innerWidth-0.5)*2;
    my = (e.clientY/window.innerHeight-0.5)*2;
  });

  window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });

  // ── ANIMATE ──
  let t=0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.006;

    particles.rotation.y += 0.0009;
    particles.rotation.x += 0.0004;

    const pos = partGeo.attributes.position.array;
    for(let i=0;i<partCount;i++){
      pos[i*3]   += partVel[i].x;
      pos[i*3+1] += partVel[i].y;
      pos[i*3+2] += partVel[i].z;
      if(Math.abs(pos[i*3])>32)   partVel[i].x*=-1;
      if(Math.abs(pos[i*3+1])>32) partVel[i].y*=-1;
      if(Math.abs(pos[i*3+2])>28) partVel[i].z*=-1;
    }
    partGeo.attributes.position.needsUpdate=true;

    objs[0].rotation.x+=0.0035; objs[0].rotation.y+=0.006;
    objs[1].rotation.x-=0.005;  objs[1].rotation.z+=0.004;
    objs[2].rotation.x+=0.0025; objs[2].rotation.y-=0.005;
    objs[3].rotation.z+=0.007;  objs[3].rotation.x+=0.003;
    objs[4].rotation.y+=0.0035; objs[4].rotation.z-=0.006;
    objs[5].rotation.x-=0.004;  objs[5].rotation.y+=0.007;

    rings[0].rotation.z+=0.0012;
    rings[1].rotation.x+=0.0009;
    rings[2].rotation.y+=0.0014;
    rings[3].rotation.z-=0.0018;

    cube.rotation.x += 0.008;
    cube.rotation.y += 0.012;
    cube.rotation.z += 0.005;
    cube.material.opacity = 0.1 + Math.sin(t*1.5)*0.06;

    camera.position.x += (mx*1.6-camera.position.x)*0.04;
    camera.position.y += (-my*1.1-camera.position.y)*0.04;
    camera.lookAt(0,0,0);

    objs.forEach((obj,i)=>{
      obj.material.opacity = 0.06+Math.sin(t+i*1.4)*0.04;
    });

    renderer.render(scene,camera);
  }
  animate();
})();
