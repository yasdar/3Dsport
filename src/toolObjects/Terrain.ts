import * as THREE from 'three'

export class Terrain {
 _scene:THREE.Scene;
 _terrainMesh:THREE.Mesh;
 terrainLimits:any;
  constructor(scene:THREE.Scene) {
    this._scene  = scene;

    this.AddTerrainMesh();
  }
  AddTerrainMesh(){
    const geometry:THREE.BoxGeometry = new THREE.BoxGeometry(12, 0.2, 12*0.6476) //12, 7, 0.2
    const textTureLoader = new THREE.TextureLoader()
    const materials = [
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/land.jpeg') }),
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/land.jpeg') }),
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/Saha0.png') }),
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/land.jpeg') }),
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/land.jpeg') }),
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/land.jpeg') }),
    ]
    this._terrainMesh = new THREE.Mesh(geometry, materials);
    this._terrainMesh.name ='terrain'
    this._scene.add( this._terrainMesh);

    this.terrainLimits={
      left:-geometry.parameters.width/2,
      right:geometry.parameters.width/2,
      up:-geometry.parameters.depth/2,
      bottom:geometry.parameters.depth/2,
      Y:0.2
    }

  }
}