import $ from "jquery";
//import gsap from "gsap";
//import { GameState } from "./config";


import THREE, { PerspectiveCamera, Scene, WebGLRenderer,Mesh } from "three";

import { Terrain } from "./toolObjects/Terrain";
import { Camera } from "./Camera";

export class App
{
   
    private scene: Scene;
    private renderer: WebGLRenderer;
    public terrain:Terrain;
    public camera:Camera;
    public mousePosition : THREE.Vector2;
    public ray_caster : THREE.Raycaster;

    constructor()
    {
      //renderer
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0xff0000, 1); 
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        //add to web page
        const _div:HTMLElement|null =  document.getElementById('app');
        if(_div)
        _div.appendChild(this.renderer.domElement);

        //create scene
        this.scene = new Scene();
        const Bcolor = new THREE.Color(0x000000);
        this.scene.background = Bcolor

        this.showAxes();
        this.camera = new Camera(this.renderer);

        this.addGrid();
        this.addLight();
        this.terrain = new Terrain(this.scene);
       
        this.ray_caster = new THREE.Raycaster()

        this.addToolEvents();
      //listen too reseize
        window.addEventListener("resize", this.onWindowResize.bind(this), false);

        //looping
        this.animate();
    }

    private onWindowResize(): void
    {
        this.camera._camera.aspect = window.innerWidth / window.innerHeight;
        this.camera._camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate(): void
    {
        requestAnimationFrame(this.animate.bind(this));

        this.camera.update();
        this.update();
        this.renderer.render(this.scene, this.camera._camera);
    }
    private update(){
      

      
    }




    
    private showAxes(){
      const axesHelper: THREE.AxesHelper = new THREE.AxesHelper(15)
      this.scene.add(axesHelper)
      const Xcolor = new THREE.Color(0xffffff)
      const Ycolor = new THREE.Color(0x00ff00)
      const Zcolor = new THREE.Color(0x0000ff)
      axesHelper.setColors(Xcolor, Ycolor, Zcolor)
    }
    private addGrid() {
      const size = 14
      const divisions = 28
      const gridHelper = new THREE.GridHelper(
        size,
        divisions,
        new THREE.Color(0xffff00),
        new THREE.Color(0xffff00)
      )
      gridHelper.position.y = 0.4
      this.scene.add(gridHelper)
    }
    private addLight(){
      this.scene.add(new THREE.AmbientLight(0x3333))
      let directionalLight = new THREE.DirectionalLight(0xffffff)
      directionalLight.castShadow = true
      directionalLight.position.set(0, 7, 2)
      this.scene.add(directionalLight)
      directionalLight.shadow.camera.bottom = -4
      this.scene.add(new THREE.DirectionalLightHelper(directionalLight))
      //this.engine.scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
    }
    private addToolEvents(){
      this.mousePosition = new THREE.Vector2();
      //general movment
      $('#app').on('pointermove', (event:any) => {
        this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1
        console.log('pointermove')
      })
  
      $('#app').on('pointerdown', (event: any) => {
        console.log('pointerdown')
        this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1
      })
      $('#app').on('pointerup', (event: any) => {
        console.log('pointerup')
        this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1

      })



      //add an object
      $('#car').on('pointerdown', (event: any) => {
        console.log('addObj');
        //this.addObjectFix(new THREE.Vector3(3, 1, 0))
      })
    }

    private addObjectFix(p: THREE.Vector3) {
     /* const _ob1: any = new Ob1()
      _ob1.position.copy(p)
      this.engine.scene.add(_ob1)
  
      this.pickableObjects = _ob1.obMesh
      this.pickableObjects.push(this.terrain)
      this.pickableObjects.push(_ob1.obgCube)
      this.pickableObjects.push(_ob1.obgRot)*/
    }
}




$(function () {
  console.log('doc ready');
  new App();
});
