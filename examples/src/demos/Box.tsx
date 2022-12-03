import { forwardRef } from 'react';
import { useBox } from '@react-three/cannon';
import { BoxProps, Triplet } from '@react-three/cannon';
import { Object3D } from 'three';

export const Box = forwardRef<Object3D, BoxProps>((props, ref) => {
  const args: Triplet = [1, 1, 1];
  useBox(
    () => ({
      mass: 1.00,
      args,
      linearDamping: 0.7,
      ...props,
    }),
    ref
  );
  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={args} />
      <meshNormalMaterial />
    </mesh>
  );
});
