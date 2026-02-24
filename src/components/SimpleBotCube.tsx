export function SimpleBotCube({ color = 'red', ...props }) {
  return (
    <mesh {...props} castShadow> 
      <boxGeometry args={[0.1, 0.6, 0.1]} />  {/* rough human proportions: width 0.4, height 1.8, depth 0.4 */}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}