import $ from "jquery";
//import gsap from "gsap";
//import { GameState } from "./config";


import THREE, { PerspectiveCamera, Scene, WebGLRenderer,Mesh } from "three";

import { Terrain } from "./toolObjects/Terrain";
import { Camera } from "./Camera";
import { Player } from "./toolObjects/Player1";
import { AngleBetweenTwoPointsInPlanXZ } from "./utils";

export class App
{
   
    private scene: Scene;
    private renderer: WebGLRenderer;
    public terrain:Terrain;
    public camera:Camera;
    public mousePosition : THREE.Vector2;
    public ray_caster : THREE.Raycaster;
    pickableObjects: THREE.Mesh[] = []
    intersectedObject!: THREE.Object3D | null


    onDown:boolean = false;
    selectedObject:{
      container:THREE.Object3D|null,
      Action:string
    }
    terrainLimits:any;
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

       // this.addGrid();
        this.addLight();
        this.terrain = new Terrain(this.scene);
        this.terrainLimits = this.terrain.terrainLimits;
        this.selectedObject={container:null,Action:'0'}
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
      this.ray_caster.setFromCamera(this.mousePosition,this.camera._camera);
      const intersetcs = this.ray_caster.intersectObjects(this.pickableObjects);
      //pointerclick on rotate or move tools of an object
      if (intersetcs.length>0) {
      
        if( this.onDown  &&  this.selectedObject.Action == "0")
        {

          if(intersetcs[0].object.name =="terrain"){ 
           // console.log("on terrain -->",intersetcs[0].object.name)
          }else if(intersetcs[0].object.name =="_move" || intersetcs[0].object.name =="_rotate"){
            //console.log("on object with tool -->",intersetcs[0].object.name)
            this.selectedObject={
              container:intersetcs[0].object.parent,
              Action:intersetcs[0].object.name
            }
          }
         
          
        }

        
        
        
        

        this.manageSelected(intersetcs[0].point);
      }
      

    }
    private manageSelected(intersectionPoint:any){
      if(this.onDown && this.selectedObject.container){
        this.camera.controls.enabled = false;

        if(this.selectedObject.Action =='_rotate'){
          this.selectedObject.container.rotation.y =
                AngleBetweenTwoPointsInPlanXZ(
                  intersectionPoint,
                  this.selectedObject.container.position
                )
            }

        if(this.selectedObject.Action =='_move'){
          if( intersectionPoint.x < this.terrainLimits.left ){return}
          if( intersectionPoint.x > this.terrainLimits.right ){return}
          if( intersectionPoint.z < this.terrainLimits.up ){return}
          if( intersectionPoint.z > this.terrainLimits.bottom ){return}

          this.selectedObject.container.position.x = intersectionPoint.x;
          this.selectedObject.container.position.z = intersectionPoint.z;
        }


        }
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
        //console.log('pointermove')
      })
  
      $('#app').on('pointerdown', (event: any) => {
       // console.log('pointerdown')
        this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.onDown = true;
      })
      $('#app').on('pointerup', (event: any) => {
      //  console.log('pointerup')
        this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.onDown = false;
        this.camera.controls.enabled = true
        this.selectedObject= {container:null,Action:"0"};
      })



      //add an object
      $('#test1').on('pointerdown', (event: any) => {
        this.addObjectFix()
      })
    }

    private addObjectFix() {

      const player:Player = new Player(this.scene,0.2);
      this.pickableObjects.push(this.terrain._terrainMesh);
      this.pickableObjects.push(player._rotate);
      this.pickableObjects.push(player._move);

    }
}




$(function () {
  console.log('doc ready');
  new App();
});
