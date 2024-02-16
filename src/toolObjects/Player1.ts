import * as THREE from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
export class Player {

    container:THREE.Object3D;
    _player:any;
    _rotate!: THREE.Mesh;
    _move!: THREE.Mesh;

    obMesh: Array<any> = [];
    scene:THREE.Scene;

    constructor(scene:THREE.Scene,terrainZ:number) {
    this.scene = scene;
    this.container = new THREE.Object3D();
    this.container.name = "player";
    this.scene.add(this.container);
    this.container.position.set(0,terrainZ,0)

    this.addTools();
    this.addObj();

    }showTools(){

        this._rotate.visible = true;
        this._move.visible = true;

    }hideTools(){

        this._rotate.visible = false;
        this._move.visible = false;
    }
    addTools(){
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
          '/rp_mei_posed_001_30k.obj',
          (object) => {
            this.container.add(object);
            object.receiveShadow = true
           // console.log(object)
            let boundingBox = new THREE.Box3().setFromObject(object);
            let height = Math.abs(boundingBox.min.y - boundingBox.max.y);
           // console.log(height);
            object.scale.setScalar( (1/height) *1.5)
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
    

}