import $ from "jquery";
//import gsap from "gsap";
//import { GameState } from "./config";


import THREE, { PerspectiveCamera, Scene, WebGLRenderer,Mesh } from "three";

import { Terrain } from "./toolObjects/Terrain";
import { Camera } from "./Camera";
import { Player } from "./toolObjects/Player1";
import { Megaphone } from "./toolObjects/Megaphone1";
import { AngleBetweenTwoPointsInPlanXZ, distanceVector } from "./utils";
import { Ball } from "./toolObjects/Ball1";

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
    addedObgetcs:Array<any> = [];

    onDown:boolean = false;
    selectedObject:{
      container:THREE.Object3D|null,
      Action:string
    };
    lastSelectedObject:{
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

        //this.showAxes();
        this.camera = new Camera(this.renderer);

       // this.addGrid();
        this.addLight();
        this.terrain = new Terrain(this.scene);
        this.terrainLimits = this.terrain.terrainLimits;
        this.pickableObjects.push(this.terrain._terrainMesh);
        this.selectedObject={container:null,Action:'0'}
        this.lastSelectedObject={container:null,Action:'0'}
        $('#objTool').hide();
        this.ray_caster = new THREE.Raycaster()

        this.addToolEvents();
        this.addedObgetcs = [];
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
           this.highlightSelected();
          }else if(
            intersetcs[0].object.name =="_move" || 
            intersetcs[0].object.name =="_rotate"|| 
            intersetcs[0].object.name =="clickableZone"
            ){
            console.log("on object with tool -->",intersetcs[0].object.name)
            this.selectedObject={
              container:intersetcs[0].object.parent,
              Action:intersetcs[0].object.name
            }
            this.lastSelectedObject={
              container:intersetcs[0].object.parent,
              Action:intersetcs[0].object.name
            }
            $('#objTool').show();
            this.highlightSelected();
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
                );
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
     // this.scene.add(new THREE.DirectionalLightHelper(directionalLight))
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
        this.addPlayer()
      })

      $('#test2').on('pointerdown', (event: any) => {
        this.addObject1()
      })


      $('#test3').on('pointerdown', (event: any) => {
        this.addObject2()
      })

      //object tool
      $('#bt_scale').on('pointerdown', (event: any) => {
      if (this.lastSelectedObject.container &&  this.lastSelectedObject.container.userData.Me._active){
        this.lastSelectedObject.container.userData.Me.scaleObj(0.1);
      }
      });


      $('#bt_flip').on('pointerdown', (event: any) => {
        if (this.lastSelectedObject.container &&  this.lastSelectedObject.container.userData.Me._active){
          this.lastSelectedObject.container.rotation.y += Math.PI;
        }
        });

        $('#bt_trash').on('pointerdown', (event: any) => {
          if (this.lastSelectedObject.container &&  this.lastSelectedObject.container.userData.Me._active){
            console.log('remove it');


            //remove from arrays
           /* const index1 =  this.pickableObjects.indexOf(this.lastSelectedObject.container.userData.Me.clickableZone);
            this.pickableObjects.splice(index1, 1);
            const index2 =  this.pickableObjects.indexOf(this.lastSelectedObject.container.userData.Me._rotate);
            this.pickableObjects.splice(index2, 1);
            const index3 =  this.pickableObjects.indexOf(this.lastSelectedObject.container.userData.Me._move);
            this.pickableObjects.splice(index3, 1);*/
            //  console.log(this.pickableObjects)
            //remove from scene
            this.lastSelectedObject.container.userData.Me.destroy();
            //remove the class instance
            this.addedObgetcs.splice(this.lastSelectedObject.container.userData.Me._index, 1);
            //refresh
           this.lastSelectedObject.container = null;
           this.selectedObject.container = null;
           $('#objTool').hide();
           this.highlightSelected();
          }
          });
        

    }
    private addObject1(){
      this.highlightSelected();
      const mp:Megaphone = new Megaphone(this.scene,0.2,this.addedObgetcs.length);
      mp.container.position.z = Math.random()*2
      this.pickableObjects.push(mp._rotate);
      this.pickableObjects.push(mp._move);
      this.addedObgetcs.push(mp)

      this.lastSelectedObject={
        container:mp.container,
        Action:''
      }
    }

    private addObject2(){
      this.highlightSelected();
      const ba:Ball = new Ball(this.scene,0.2,this.addedObgetcs.length);
      ba.container.position.z = Math.random()*2
      this.pickableObjects.push(ba._rotate);
      this.pickableObjects.push(ba._move);
      this.addedObgetcs.push(ba)

      this.lastSelectedObject={
        container:ba.container,
        Action:''
      }
    }

    private addPlayer() {
      this.highlightSelected();
      const player:Player = new Player(this.scene,0.2,this.addedObgetcs.length);
      player.container.position.x = Math.random()*2
      this.pickableObjects.push(player.clickableZone);
      this.pickableObjects.push(player._rotate);
      this.pickableObjects.push(player._move);
      this.addedObgetcs.push(player);

      this.lastSelectedObject={
        container:player.container,
        Action:''
      }
//console.log('pickableObjects',this.pickableObjects)
//console.log('addedObgetcs',this.addedObgetcs)
    }

    highlightSelected(){
      if(this.selectedObject.container){
        console.log(this.selectedObject.container.name)
        this.selectedObject.container.userData.Me.showTools();
      }

      this.addedObgetcs.forEach((ob:any)=>{
        if(ob.container.name != this.selectedObject.container?.name){
            ob.hideTools();
        }
      })
    }
}




$(function () {
  console.log('doc ready');
  new App();
});


/**To Do */
//common class for player/ball/megaphone and extend it
//change scene
//diviser le panneau a gauche joueurs / equipments 