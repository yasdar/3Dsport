import * as THREE from 'three'
import { BaseObj } from './BaseObj';
export class Player extends BaseObj{

   
    constructor(scene:THREE.Scene,terrainZ:number,index:number,path:string,pathObj:string,scaleFactor:number) {
    super(scene,terrainZ,index,path,pathObj,scaleFactor);
    console.log(this.container.name);
    }
}

