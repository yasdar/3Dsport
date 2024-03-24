import $ from "jquery";
import * as dat from "dat.gui";
import * as skelotonUtils from "three/examples/jsm/utils/SkeletonUtils"
import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";
//import gsap from "gsap";
//import { GameState } from "./config";


import THREE, { PerspectiveCamera, Scene, WebGLRenderer,Mesh } from "three";

import { Terrain } from "./toolObjects/Terrain";
import { Camera } from "./Camera";
import { Player } from "./toolObjects/Player1";
import { Megaphone } from "./toolObjects/Megaphone1";
import { AngleBetweenTwoPointsInPlanXZ, distanceVector } from "./utils";
import { Ball } from "./toolObjects/Ball1";
import { BaseObj } from "./toolObjects/BaseObj";
import { eqipments_Football_path, equipments_Football } from "./config";
import { ActivateRightBt, addEList, addPitcheList } from "./UI";

export class App
{
    public gui:dat.GUI
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
    selectedColor:string = '';
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
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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


        this.gui = new dat.GUI();
        const _options={
          color:0xffffff,
          wireframe:false
        }
        
        this.gui.addColor(_options,"color").onChange((v)=>{
          console.log("v",v);
    this.addedObgetcs[this.addedObgetcs.length-1]._move.material.color.set(v)
        });

        this.gui.add(_options,"wireframe").onChange((v)=>{
          console.log("v",v);
          this.addedObgetcs[this.addedObgetcs.length-1]._move.material.wireframe=v;
        });



        //create Equipment list
        addEList();

        addPitcheList();
         //listen to add equipment event
        for(let line:number = 0 ; line<equipments_Football.length; line++){
        $('#E_'+line).on('pointerdown',()=>{
         this.addEquipment(line);
        });
        }


 //colorpicker
Coloris.init();
Coloris.coloris({
  el: "#coloris",
  themeMode: 'dark',
  alpha: false,
  margin: 20,
  closeButton: true,
  closeLabel: 'OK',
  clearButton: true,
  clearLabel: 'Clear',
  onChange: (color:any) =>{this.selectedColor = color}
});


document.addEventListener('close', event => {
  this.applyColor();
});


}
private applyColor(){
 
  if(this.selectedColor.length<1){return;}
  console.log("applyColor",this.selectedColor);
  if (this.lastSelectedObject.container &&  this.lastSelectedObject.container.userData.Me._active){
      //get object
    let model = this.lastSelectedObject.container.userData.Me._currentOBj.scene;
    //color as number
    let n_color:any = this.selectedColor.replace('#','0x');
    //apply color
      model.traverse((node:any) =>{
        if (node.isMesh) {
          console.log("Mesh",node.name)
          if( 
            node.name != 'flag' &&
            node.name != 'hole'&&
            node.name != 'steps'&&
            node.name != 'pole2'&&
            node.name != 'net'&&
            node.name != 'goal_2'
            ){
            node.material.color.setHex(n_color);
          }
          if( node.name.indexOf('football')!=-1 ){
           
            node.material.color.setHex(n_color);
            
            
          }
      }
      });
  }
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
      this.addedObgetcs.forEach((obg:BaseObj)=>{
        obg.update();
      })
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
      this.scene.add(new THREE.AmbientLight(0xffffff,1.5))
      let directionalLight = new THREE.DirectionalLight(0xffffff,1.5)
      directionalLight.castShadow = true
      directionalLight.position.set(0, 4, 4);
      directionalLight.target.position.set(0, 0, 0);
      this.scene.add(directionalLight)
      //directionalLight.shadow.camera.bottom = -4
      //this.scene.add(new THREE.DirectionalLightHelper(directionalLight))
      //this.scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
   
    }
    private addToolEvents(){
      this.mousePosition = new THREE.Vector2();
      //general movment
      $('#app').on('pointermove', (event:any) => {
        this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1
      })
  
      $('#app').on('pointerdown', (event: any) => {
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

          //Must
          $('.bottomTools').on('pointerdown', (event: any) => {
            console.log('ok .bottomTools')
            event.stopPropagation();
          });
           //Must
           $('.rightTools').on('pointerdown', (event: any) => {
            console.log('ok .rightTools')
            event.stopPropagation();
          });


          ActivateRightBt();
    }
    private addEquipment(id:number){
      console.log( equipments_Football[id].pathObj)
      this.highlightSelected();
      const mp:BaseObj = new BaseObj(
        this.scene,
        0.12,
        this.addedObgetcs.length,
        eqipments_Football_path,
        equipments_Football[id].pathObj,
        equipments_Football[id].SC);
      mp.container.position.z = Math.random()*2
      this.pickableObjects.push(mp._rotate);
      this.pickableObjects.push(mp._move);
      this.addedObgetcs.push(mp)
      this.lastSelectedObject={
        container:mp.container,
        Action:''
      }
    }

    private addPlayer() {
      this.highlightSelected();
      const player:Player = new Player(this.scene,0.2,this.addedObgetcs.length,
        '../assets/obj',
        '/char.gltf',1);//rp_mei_posed_001_30k.fbx
      player.container.position.x = Math.random()*2
      this.pickableObjects.push(player.clickableZone);
      this.pickableObjects.push(player._rotate);
      this.pickableObjects.push(player._move);
      this.addedObgetcs.push(player);


     /* setTimeout(() => {
        let objClone:any = skelotonUtils.clone(player._currentOBj);
        this.scene.add(objClone);
      }, 3000);*/

      




      this.lastSelectedObject={
        container:player.container,
        Action:''
      }
//console.log('pickableObjects',this.pickableObjects)
//console.log('addedObgetcs',this.addedObgetcs)
    }
    private addPlayer2() {
      this.highlightSelected();
      const player:Player = new Player(this.scene,0.2,this.addedObgetcs.length,
        '../assets/obj',
        '/uploads_files_2788856_char_Adam.fbx',17);
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
   new App();


   
});
