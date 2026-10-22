import {rgb,linear} from '../src/color.js';
// Machado, Oliveira and Fernandes (2009), severity 1.0, linear RGB.
export const matrices = {
 protan:[[.152286,1.052583,-.204868],[.114503,.786281,.099216],[-.003882,-.048116,1.051998]],
 deutan:[[.367322,.860646,-.227968],[.280085,.672501,.047413],[-.011820,.042940,.968881]],
 tritan:[[1.255528,-.076749,-.178779],[-.078411,.930809,.147602],[.004733,.691367,.303900]]
};
export function simulatedLab(hex:string,matrix:number[][]):number[]{const r=rgb(hex)!.map(linear);const [x,y,z]=matrix.map(row=>Math.max(0,Math.min(1,row.reduce((s,v,i)=>s+v*r[i],0))));const l=Math.cbrt(.4122214708*x+.5363325363*y+.0514459929*z),m=Math.cbrt(.2119034982*x+.6806995451*y+.1073969566*z),s=Math.cbrt(.0883024619*x+.2817188376*y+.6299787005*z);return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s];}
export function distance(a:number[],b:number[]):number{return Math.hypot(...a.map((v,i)=>v-b[i]));}
