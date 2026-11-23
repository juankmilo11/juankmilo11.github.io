// Capture-chess material priors. King value is an objective priority, not tradeable material.
// Mobility, initiative, shields and king exposure are evaluated separately.
export const tacticalValues=Object.freeze({p:1,n:3.2,b:3.3,r:5,q:9,k:1000});
