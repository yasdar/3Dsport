export function AngleBetweenTwoPointsInPlanXZ(
    p1: { x: number; y: number; z: number },
    ref: { x: number; y: number; z: number }
  ): number {
    let angle = Math.atan2(p1.x - ref.x, p1.z - ref.z)
    return angle;
  }



  export function distanceVector( v1:THREE.Vector3, v2:THREE.Vector3 )
{
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}