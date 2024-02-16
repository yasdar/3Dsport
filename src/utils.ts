export function AngleBetweenTwoPointsInPlanXZ(
    p1: { x: number; y: number; z: number },
    ref: { x: number; y: number; z: number }
  ): number {
    let angle = Math.atan2(p1.x - ref.x, p1.z - ref.z)
    return angle;
  }