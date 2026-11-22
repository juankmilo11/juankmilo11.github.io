// Small render budgets keep the same rules and assets on less capable devices.
export function renderQuality({memory=8,cores=8,coarse=false,lite=false}={}){
  const constrained=lite||memory<=4||cores<=4;
  return {lite:constrained,pixelRatio:constrained?1:1.25,shadows:!constrained,shadowSize:coarse?512:1024,fps:constrained?30:coarse?45:60,idle:!constrained,antialias:!constrained};
}
export function deviceRenderQuality(lite=false){
  return renderQuality({memory:globalThis.navigator?.deviceMemory,cores:globalThis.navigator?.hardwareConcurrency,coarse:globalThis.matchMedia?.('(pointer:coarse)').matches,lite});
}
