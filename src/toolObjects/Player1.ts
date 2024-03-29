import * as THREE from 'three'
import { BaseObj } from './BaseObj';
export class Player extends BaseObj{
    playerName:string;
    defaultColors:any;
    constructor(
      scene:THREE.Scene,
      terrainZ:number,
      index:number,
      path:string,
      pathObj:string,
      scaleFactor:number,
      currentcolor:any,
      cloneData:any) {
    super(scene,terrainZ,index,path,pathObj,scaleFactor,cloneData);
    this.isPlayer = true;
    this.playerName = 'player1';
    this.defaultColors = currentcolor;
    console.log("my name",this.container.name);
    }

    objectIsReady(): void {
      console.log('clone player Data',this.cloneData);
      //objectIsReady
      //apply existing colors
      let Shirt_color:any = this.defaultColors.Shirt.replace('#','0x');
      this.color_part("Shirt",Shirt_color);
      this.color_part("Collar",Shirt_color);

      let Shoulder_color:any = this.defaultColors.Shoulder.replace('#','0x');
      this.color_part("Shoulder",Shoulder_color);

      let Short_color:any = this.defaultColors.Short.replace('#','0x');
      this.color_part("Short",Short_color);
      
      let Socks_color:any = this.defaultColors.Socks.replace('#','0x');
      this.color_part("Socks",Socks_color);
      this.color_part("Bottom_Socks",Socks_color);

      let Upper_Socks_color:any = this.defaultColors.SocksTop.replace('#','0x');
      this.color_part("Upper_Socks",Upper_Socks_color);

      let SKin_color:any = this.defaultColors.SKin.replace('#','0x');
      this.color_part("Model",SKin_color);
      



     
      if(this.cloneData){
        //apply scale
        this.CurrentScale = this.cloneData.actual_CurrentScale;
        this.scaleCounter = this.cloneData.actual_scaleCounter;
        this.scaleObj(0);
        //apply rotation
        this.container.rotation.y = this.cloneData.rotation;
      }





      this.checkPlayerNodes();
    }
    checkPlayerNodes(){
        //console.log("@",obj);
       /* this.mixer = new THREE.AnimationMixer(this._currentOBj.scene)
        const clips = this._currentOBj.animations;
        const clip = THREE.AnimationClip.findByName(clips,'player16');
        console.log("clip",clip);
       const action = this.mixer.clipAction(clip);
       // console.log("action",action);
        action.play();
        action.repetitions = 0;*/

        //const textTureLoader = new THREE.TextureLoader()
      //just apply shadow
      /*
      let model = this._currentOBj;
      model.traverse((node:any) =>{
        if (node.isMesh) {
            console.log("Mesh",node.material)
            console.log("Mesh",node.material[8].name);
          }
      });
      */
    }

    color_part(part:string,color:any){
      let model = this._currentOBj;
      model.traverse((node:any) =>{
        if (node.isMesh) {

          node.material.forEach((m:any)=>{
            if(m.name.indexOf(part) != -1){
              m.color.setHex(color)
            }
          })
         // node.material[1].color.setHex(0x0fff00);//short
        }
      });












    }
}

