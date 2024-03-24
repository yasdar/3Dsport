import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { pitchesTextures } from '../config';

export class Terrain {
 _scene:THREE.Scene;
 _terrainMesh0:THREE.Mesh;
 _terrainMesh:THREE.Mesh;
 terrainLimits:any;

 _terrainMeshTop:THREE.Mesh;
 tracagePath:string = '../assets/obj/pitches/obj';
 tracageOBJ:string = '/pitchmarks_0001_standard.glb';
 _currentOBj:any;
 _scaleFactor:number = 0.01;
  constructor(scene:THREE.Scene) {
    this._scene  = scene;

    this.AddTerrainMesh();
  }
  AddTerrainMesh(){
    const textTureLoader = new THREE.TextureLoader()
    //pitche background0
    const geometry0:THREE.BoxGeometry = new THREE.BoxGeometry(14, 0.2, 7.5)
    const matirail0 = [
      new THREE.MeshStandardMaterial({ color:0xffffff }),
      new THREE.MeshStandardMaterial({ color:0xffffff }),
      new THREE.MeshStandardMaterial({ color:0x00ff00}),
      new THREE.MeshStandardMaterial({ color:0xffffff }),
      new THREE.MeshStandardMaterial({ color:0xffffff }),
      new THREE.MeshStandardMaterial({ color:0xffffff }),
    ]
    this._terrainMesh0 = new THREE.Mesh(geometry0, matirail0);
    this._terrainMesh0.position.set(0,0,0)
    this._scene.add( this._terrainMesh0);

    const geometry1:THREE.BoxGeometry = new THREE.BoxGeometry(14, 0, 7.5) //12, 7, 0.2
    const material1 =new THREE.MeshStandardMaterial({ color:0x00ff00,transparent:true});
    this._terrainMesh = new THREE.Mesh(geometry1, material1);
    this._terrainMesh.position.set(0,0.11,0)
    
   
   
    this._terrainMesh.name ='terrain'
    this._scene.add( this._terrainMesh);

    this._terrainMesh.receiveShadow = true;
    this._terrainMesh.castShadow = true;

    this.terrainLimits={
      left:-geometry1.parameters.width/2,
      right:geometry1.parameters.width/2,
      up:-geometry1.parameters.depth/2,
      bottom:geometry1.parameters.depth/2,
      Y:0.2
    }



    

    //add tracage
    new GLTFLoader()
    .setPath(this.tracagePath)//'../assets/obj'
    .load(
      this.tracageOBJ,//'/pitchmarks_0001_standard
      (object) => {
        object.scene.name = this.tracageOBJ;
        console.log("loaded .glb Terrain")
        this._currentOBj = object;
       this.addLoadedObj(object.scene);
      },
      this.onProgress,this.onError
    )




   /*this.setPitcheTexture(pitchesTextures[1]);//chnane pitche textures
   this.setPitcheBorderColor(0xff0000);//change the entire color
   setTimeout(() => {
    this.setTracageColor(0x000000)
   }, 2000); */



  } onProgress(xhr: any) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100
    //  console.log(percentComplete.toFixed(2) + '% downloaded')
    }
  }
  onError(err: any){
    console.log("error loading!",err)
    }
  addLoadedObj(object:any){
   
    let boundingBox = new THREE.Box3().setFromObject(object);
    let width = Math.abs(boundingBox.min.x - boundingBox.max.x);

    // console.log(height);
     object.scale.setScalar(12/width);
     object.position.set(0, 0.12, 0);
     this._scene.add( object);
  }
  setPitcheBorderColor(color:number){
    this._terrainMesh0.traverse((node:any) =>{
      if (node.isMesh) {
          node.material[2].color.setHex(color);
    }
    });
  }
  setTracageColor(color:number){
    if( ! this._currentOBj ){return;}
    this._currentOBj.scene.traverse((node:any) =>{
      if (node.isMesh) {
          node.material.color.setHex(color);
    }
    });
  }

  setPitcheTexture(data:any){
    const textTureLoader = new THREE.TextureLoader()
    this._terrainMesh.traverse((node:any) =>{
      if (node.isMesh) {
          node.material.map = textTureLoader.load(data.texture);
          node.material.opacity = data.opacity;
          node.material.map.flipY = false;
        }
    });
  }

 

   

  
}