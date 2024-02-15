import * as THREE from 'three'

export class Terrain {
 _scene:THREE.Scene;
  constructor(scene:THREE.Scene) {
    this._scene  = scene;

    this.AddTerrainMesh();
  }
  AddTerrainMesh(){
    const geometry = new THREE.BoxGeometry(12, 0.2, 7) //12, 7, 0.2
    const textTureLoader = new THREE.TextureLoader()
    const materials = [
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/land.jpeg') }),
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/land.jpeg') }),
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/t2.jpeg') }),
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/t2.jpeg') }),
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/land.jpeg') }),
      new THREE.MeshBasicMaterial({ map: textTureLoader.load('../assets/images/land.jpeg') }),
    ]
    const terrainMesh = new THREE.Mesh(
      geometry, materials
    )
    this._scene.add(terrainMesh);
  }
}