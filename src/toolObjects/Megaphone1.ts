import * as THREE from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { Tools_Options } from '../config';
import $ from "jquery";
export class Megaphone {

    container:THREE.Object3D;
    clickableZone : THREE.Mesh;
    _player:any;
    _rotate!: THREE.Mesh;
    _move!: THREE.Mesh;
    _active:boolean = true;
    obMesh: Array<any> = [];
    scene:THREE.Scene;

    CurrentScale:number = 1;
    scaleCounter:number = 1;
    _index:number;
    constructor(scene:THREE.Scene,terrainZ:number,index:number) {
    this.scene = scene;
    this._index = index;
    this.container = new THREE.Object3D();
    this.container.name = "Megaphone"+this._index;
    this.scene.add(this.container);
    this.container.userData ={Me:this};
    this.container.position.set(0,terrainZ,0)

    this.addTools();
    this.addObj();

    $('#bt_scale').removeClass('flipped');
    $('#objTool').show();
    
    }showTools(){

        this._rotate.visible = true;
        this._move.visible = true;

        this._active = true;

    }hideTools(){

        this._rotate.visible = false;
        this._move.visible = false;

        this._active = false;
    }
    addTools(){
       //clickableZone
       this.clickableZone = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.33,
            0.33,
            0.7
            ),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          opacity: 0,
          transparent:true
        })
      )
        this.clickableZone.position.set(0, 1, 0);
        this.clickableZone.name = 'clickableZone';
        this.container.add(this.clickableZone);
         //rotation tool
        const textTureLoader = new THREE.TextureLoader()
        let texture = textTureLoader.load('../assets/images/rot.png')
        let circleMat = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          //transparent: true,
          //opacity: 0.5,
        })
        this._rotate = new THREE.Mesh(new THREE.CircleGeometry(0.75), circleMat);
        this._rotate.rotation.x = -Math.PI / 2;
        this._rotate.position.set(0, 0, 0);
        this._rotate.name = '_rotate';
        this.container.add(this._rotate);

        //moving tool
        this._move = new THREE.Mesh(
            new THREE.CircleGeometry(0.33),
            new THREE.MeshStandardMaterial({
              color: 0xffffff,
              transparent:true,
              opacity: 1,
            })
          )
          this._move.position.set(0,0.01, 0);
          this._move.name = '_move';
          this._move.rotation.x = -Math.PI / 2;
          this.container.add(this._move);
         


          /*body cylinder
          this._move = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.33,
                0.33,
                1.5
                ),
            new THREE.MeshStandardMaterial({
              color: 0xffffff,
              opacity: 1,
            })
          )
          this._move.position.set(0,0.75, 0);
          */
    }
    addObj(){
        //load the object
    
        new OBJLoader()
        .setPath('../assets/obj')
        .load(
          '/megaphone-001.obj',
          (object) => {
            this.container.add(object);
            object.receiveShadow = true
           // console.log(object)
            let boundingBox = new THREE.Box3().setFromObject(object);
            let height = Math.abs(boundingBox.min.y - boundingBox.max.y);
           // console.log(height);
            object.scale.setScalar( (1/height) *0.5)
            object.position.set(0, 0.01, 0)
          },
          this.onProgress
        )
    }
    onProgress(xhr: any) {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100
          console.log(percentComplete.toFixed(2) + '% downloaded')
        }
      }
      scaleObj(v:number){
        this.CurrentScale += v*this.scaleValue();
        this.container.scale.setScalar(this.CurrentScale);
    }
      scaleValue(){
        let Direction:number = 1;
        if(this.scaleCounter <= Tools_Options.maxScale){
        Direction=1;
        $('#bt_scale').removeClass('flipped');
      }
        else{
          Direction=-1;
          $('#bt_scale').addClass('flipped');
        }
        if(this.CurrentScale-0.1 <= Tools_Options.minScale){
          this.scaleCounter = Tools_Options.minScale; 
          Direction=1;
          $('#bt_scale').removeClass('flipped');
        }
        this.scaleCounter+=0.1;
        return Direction;
      }

       /** rmove from scene */
    destroy(){
      this.scene.remove(this.container);
    }

}