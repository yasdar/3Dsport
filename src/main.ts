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
import { AngleBetweenTwoPointsInPlanXZ, distanceVector } from "./utils";
import { BaseObj } from "./toolObjects/BaseObj";
import { bgs_data, eqipments_Football_path, equipments_Football, pitchesTextures, players_data, players_path } from "./config";
import { ActivateRightBt, addBgsList, addEList, addPitcheList, addPlayersList, handleBgsselection, handlePitcheselection, handlePlayersselection } from "./UI";

export class App
{
    public gui:dat.GUI
    private canExport:boolean = true;
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
    selectedColorPitch:string='';
    selectedColorPlayer1:any={
      Shirt:'0xff0000',
      Shoulder:'0xfff000',
      Short:'0x0fff00',
      Socks:'0xfff000',
      SocksTop:'0x00ff00',
      SKin:'0xffdbac'
    };
    selectedColorPitchBorder:string='';
    selectedColorPitchLine:string='';
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
        this.renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
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

        this.setSceneBackground(bgs_data[0].url);
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

/*
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
        });*/



        //create Equipment list
        addEList();
      //listen to add equipment event
      for(let line:number = 0 ; line<equipments_Football.length; line++){
        $('#E_'+line).on('pointerdown',()=>{
        this.addEquipment(line,null);
        });
        }

        addPitcheList();

        //listen to add pitch event
        for(let p:number = 0 ; p<pitchesTextures.length; p++){
          $('#P_'+p).on('pointerdown',()=>{
           this.ApplyTerrainTexture(p);
          });
          }
         // apply default terrain textures
         this.ApplyTerrainTexture(0);

          //listen to player events
         addPlayersList();
         //listen to add pitch event
        for(let p:number = 0 ; p<players_data.length; p++){
          $('#PL_'+p).on('pointerdown',()=>{
            handlePlayersselection(p)
            this.addPlayer(p,null);
          });
          }

        addBgsList();
          //listen bg selection event
          for(let b:number = 0 ; b<bgs_data.length; b++){
            $('#bg_'+b).on('pointerdown',()=>{
              handleBgsselection(b)
              this.setSceneBackground(bgs_data[b].url);
            });
            }
       







      this.addColoris();
    




}
setSceneBackground(imgUrl:string){
  if( !this.canExport ){return;}

  this.canExport = false
  var img = new Image();
  img.src = imgUrl;
  img.onload =  ()=> {
    this.scene.background = new THREE.TextureLoader().load(img.src);
  };

  setTimeout(() => {this.canExport = true;}, 3000);

}
private addColoris(){
  
Coloris.init();
Coloris.coloris({el: "#coloris",themeMode: 'dark',alpha: false,margin: 20});

document.addEventListener('close', event => {
  //console.log("close:",event.target)
  let c1:any = document.getElementsByClassName("coloris instance1")[0];
  let c2:any = document.getElementsByClassName("coloris instance2")[0];
  let c3:any = document.getElementsByClassName("coloris instance3")[0];
  let c4:any = document.getElementsByClassName("coloris instance4")[0];
  let c5:any = document.getElementsByClassName("coloris instance5")[0];
  let c6:any = document.getElementsByClassName("coloris instance6")[0];
  let c7:any = document.getElementsByClassName("coloris instance7")[0];
  let c8:any = document.getElementsByClassName("coloris instance8")[0];
  let c9:any = document.getElementsByClassName("coloris instance9")[0];
  let c10:any = document.getElementsByClassName("coloris instance10")[0];

 if(event.target ==  c1){this.applyColor();}
 else if(event.target ==  c2){
  let n_color:any = this.selectedColorPitchBorder.replace('#','0x');
  this.terrain.setPitcheBorderColor(n_color );
 }
 else if(event.target ==  c3){
  let n_color:any = this.selectedColorPitchLine.replace('#','0x');
  this.terrain.setTracageColor(n_color );
 }
 else if(event.target ==  c4){
  let n_color:any = this.selectedColorPitch.replace('#','0x');
  this.terrain.setpitchColor(n_color );
 }
 else if(event.target ==  c5){
  let n_color:any = this.selectedColorPlayer1.Shirt.replace('#','0x');
  this.applyPlayerColors(["Shirt","Collar"],n_color);
  $("#Shirt").css("border-color", this.selectedColorPlayer1.Shirt);
 }
 else if(event.target ==  c6){
  let n_color:any = this.selectedColorPlayer1.Shoulder.replace('#','0x');
  this.applyPlayerColors(["Shoulder"],n_color);
  $("#Shoulder").css("border-color", this.selectedColorPlayer1.Shoulder);
 }
 else if(event.target ==  c7){
  let n_color:any = this.selectedColorPlayer1.Short.replace('#','0x');
  this.applyPlayerColors(["Short"],n_color);
  $("#Short").css("border-color", this.selectedColorPlayer1.Short);
 }
 else if(event.target ==  c8){
  let n_color:any = this.selectedColorPlayer1.Socks.replace('#','0x');
  this.applyPlayerColors(["Socks","Bottom_Socks"],n_color);
  $("#Socks").css("border-color", this.selectedColorPlayer1.Socks);
 }
 else if(event.target ==  c9){
  let n_color:any = this.selectedColorPlayer1.SocksTop.replace('#','0x');
  this.applyPlayerColors(["Upper_Socks"],n_color);
  $("#SocksTop").css("border-color", this.selectedColorPlayer1.SocksTop);
 }
 else if(event.target ==  c10){
  let n_color:any = this.selectedColorPlayer1.SKin.replace('#','0x');
  this.applyPlayerColors(["Model"],n_color);
  $("#SKin").css("border-color", this.selectedColorPlayer1.SKin);
 }


});

//equipments
Coloris.setInstance('.instance1', {
  closeButton: true,
  closeLabel: 'OK',
  clearButton: true,
  clearLabel: 'Clear',
  onChange: (color:any) =>{this.selectedColor = color}
});
//border clors
const commonSwatches=[
  '#60db0d','#59D5E0','#E26EE5','#268b07','#e76f51',
  '#d62828','#F5DD61','#FAA300','#0096c7','#00b4d8','#48cae4'];
Coloris.setInstance('.instance2', {
  swatchesOnly: true,
  swatches: commonSwatches,
  onChange: (color:any) =>{
    this.selectedColorPitchBorder = color;
  }
});


//line color
Coloris.setInstance('.instance3', {
  swatchesOnly: true,
  swatches:commonSwatches,
  onChange: (color:any) =>{
    this.selectedColorPitchLine = color;
  }
});
//pitch color
Coloris.setInstance('.instance4', {
  swatchesOnly: true,
  swatches:commonSwatches,
  onChange: (color:any) =>{
    this.selectedColorPitch = color;
  }
});





const commonSwatchesPlayer =[
  '#0000ff','#ffff00','#00ff00','#268b07','#e76f51',
  '#d62828','#F5DD61','#FAA300','#0096c7','#FFFFFF','#000000'];
//Shirt Color
Coloris.setInstance('.instance5', {
  swatchesOnly: true,
  swatches:commonSwatchesPlayer,
  onChange: (color:any) =>{
    if(color.length<1){return;}
    this.selectedColorPlayer1.Shirt = color;
  }
});

//Shoulder Color
Coloris.setInstance('.instance6', {
  swatchesOnly: true,
  swatches:commonSwatchesPlayer,
  onChange: (color:any) =>{
    if(color.length<1){return;}
    this.selectedColorPlayer1.Shoulder = color;
  }
});
//Short Color
Coloris.setInstance('.instance7', {
  swatchesOnly: true,
  swatches:commonSwatchesPlayer,
  onChange: (color:any) =>{
    if(color.length<1){return;}
    this.selectedColorPlayer1.Short = color;
  }
});
//Socks Color
Coloris.setInstance('.instance8', {
  swatchesOnly: true,
  swatches:commonSwatchesPlayer,
  onChange: (color:any) =>{
    if(color.length<1){return;}
    this.selectedColorPlayer1.Socks = color;
  }
});
//SocksTop Color
Coloris.setInstance('.instance9', {
  swatchesOnly: true,
  swatches:commonSwatchesPlayer,
  onChange: (color:any) =>{
    if(color.length<1){return;}
    this.selectedColorPlayer1.SocksTop= color;
  }
});
//SocksTop Color
Coloris.setInstance('.instance10', {
  swatchesOnly: true,
  swatches:[
    '#fbf3ed','#f3d8c4','#c58c85', 
    '#ecbcb4', '#d1a3a4', '#a1665e', 
    '#503335','#3d210b'],
  onChange: (color:any) =>{
    if(color.length<1){return;}
    this.selectedColorPlayer1.SKin= color;
  }
});



}
applyPlayerColors(parts:Array<string>,n_color:any){
  if (this.lastSelectedObject.container &&  
    this.lastSelectedObject.container.userData.Me._active &&
    this.lastSelectedObject.container.userData.Me.isPlayer){
      let player:any = this.lastSelectedObject.container.userData.Me;
      parts.forEach((part:string)=>{
      player.color_part(part,n_color);
      player.color_part(part,n_color);
    })
    
  }
}
private applyColor(){
 
  if(this.selectedColor.length<1){return;}
  console.log("applyColor",this.selectedColor);
  if (this.lastSelectedObject.container &&  this.lastSelectedObject.container.userData.Me._active){
    // console.log('isPlayer',this.lastSelectedObject.container.userData.Me.isPlayer)
    if(this.lastSelectedObject.container.userData.Me.isPlayer){return;}
    this.lastSelectedObject.container.userData.Me.applyEquipmentColor(this.selectedColor)
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
      
      //export scene as png image
      $('#bt_save').on('pointerdown', (event: any) => {

        //collect equpment data to save
        console.log(this.addedObgetcs);

        let _id = 0;
        if(this.addedObgetcs[0].isPlayer){
          _id = this.addedObgetcs[0].playerid;
          console.log('save player');
        }
        if(this.addedObgetcs[0].isEquipment){
          _id = this.addedObgetcs[0].EquipmentId;
          console.log('save equipment');
        }

        let SaveObj:any={
          Id:_id,
          actual_CurrentScale:this.addedObgetcs[0].CurrentScale,
          actual_scaleCounter:this.addedObgetcs[0].scaleCounter,
          rotation:this.addedObgetcs[0].container.rotation.y,
          color:this.addedObgetcs[0].usedColor,
          position:{
            x:this.addedObgetcs[0].container.position.x,
            y:this.addedObgetcs[0].container.position.y,
            z:this.addedObgetcs[0].container.position.z}
        }
        console.log(SaveObj);

        //show saved data
        setTimeout(() => {
        //  this.addEquipment(this.addedObgetcs[0].EquipmentId,SaveObj);
          //set position
         // this.lastSelectedObject.container?.position.copy( SaveObj.position );
        }, 4000);
        
      
      
        });

      //export scene as png image
      $('#bt_export').on('pointerdown', (event: any) => {
        var dataURL = this.renderer.domElement.toDataURL();
        var link = document.createElement("a");
        link.download = "screen.png";
        link.href = dataURL;
        link.target = "_blank";
        link.click();
      });


      $('#bt_clone').on('pointerdown', (event: any) => {
        if (this.lastSelectedObject.container &&  this.lastSelectedObject.container.userData.Me._active){
          //clone equipment
        
            console.log("clone equipment");
            let id:number = this.lastSelectedObject.container.userData.Me.EquipmentId;
           
            let actual_rotation:number = 0;
            let actual_CurrentScale:number = 1;
            let actual_scaleCounter:number = 1;

            let actual_color =null;

            if(this.lastSelectedObject.container){

              actual_rotation = this.lastSelectedObject.container.rotation.y;
              actual_CurrentScale= this.lastSelectedObject.container.userData.Me.CurrentScale;
              actual_scaleCounter= this.lastSelectedObject.container.userData.Me.scaleCounter;
             

              //clone equipment
              if(this.lastSelectedObject.container.userData.Me.isEquipment){
              actual_color = this.lastSelectedObject.container.userData.Me.usedColor;
              
              let clonedbData:any={
                actual_CurrentScale:actual_CurrentScale,
                actual_scaleCounter:actual_scaleCounter,
                rotation: actual_rotation,
                color:actual_color
              }
               this.addEquipment(id,clonedbData);
              }


               //clone player
               if(this.lastSelectedObject.container.userData.Me.isPlayer){
              
                actual_color = this.lastSelectedObject.container.userData.Me.defaultColors;
                
                let clonedbData:any={
                  actual_CurrentScale:actual_CurrentScale,
                  actual_scaleCounter:actual_scaleCounter,
                  rotation: actual_rotation,
                }

                this.addPlayer(this.lastSelectedObject.container.userData.Me.playerid,clonedbData);
              }

            }

            
           
          







          
        }
        });

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
    private addEquipment(id:number,clonedbData:any){
      console.log( equipments_Football[id].pathObj)
      this.highlightSelected();
      const mp:BaseObj = new BaseObj(
        this.scene,
        0.2,
        this.addedObgetcs.length,
        eqipments_Football_path,
        equipments_Football[id].pathObj,
        equipments_Football[id].SC,clonedbData);

        mp.isEquipment = true;
        mp.EquipmentId = id;

      mp.container.position.z = Math.random()*2
      this.pickableObjects.push(mp._rotate);
      this.pickableObjects.push(mp._move);
      this.addedObgetcs.push(mp)
      this.lastSelectedObject={
        container:mp.container,
        Action:''
      }
    }
    private ApplyTerrainTexture(index:number){
      console.log('ApplyTerrainTexture',index);
      handlePitcheselection(index);
      this.terrain.setPitcheTexture(index);
    }

    private addPlayer(index:number,clonedbData:any) {
      this.highlightSelected();
      const player:Player = new Player(this.scene,0.2,this.addedObgetcs.length,
        players_path,
        players_data[index].pathObj,
        players_data[index].SC,
        this.selectedColorPlayer1,
        clonedbData
        );
        player.playerid = index;
      player.container.position.x = Math.random()*2;
      this.pickableObjects.push(player.clickableZone);
      this.pickableObjects.push(player._rotate);
      this.pickableObjects.push(player._move);
      this.addedObgetcs.push(player);

      
      this.lastSelectedObject={
        container:player.container,
        Action:''
      }
      //this.applyPlayerColors
     
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
