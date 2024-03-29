export const Tools_Options ={
    maxScale:2,
    minScale:0.5
}


/*export default class loadedData{
    static loadedObjIndexes:Array<{name:string,index:number}>=[];
    static loadedObjects:Array<any>=[];
}*/

export const eqipments_Football_path:string = "../assets/obj/equipmentsFootBall/obj";
export const equipments_Football =[

    {name:"flag",pathObj:"/equipment_0001_flag.glb",SC:0.6},
    {name:"football",pathObj:"/equipment_0002_football.glb",SC:0.2},

   // {name:"cone",pathObj:"/equipment_0003_cone.glb",SC:0.3},
    {name:"hurdle",pathObj:"/equipment_0005_hurdle.glb",SC:0.2},

    {name:"ladder",pathObj:"/equipment_0004_ladder.glb",SC:0.02,bigImage:true},

    {name:"disc",pathObj:"/equipment_0006_disc.glb",SC:0.05},
    {name:"pole",pathObj:"/equipment_0007_pole.glb",SC:0.7},

    {name:"mannequin",pathObj:"/equipment_0008_mannequin.glb",SC:0.5},
    {name:"minigoal",pathObj:"/equipment_0010_minigoal.glb",SC:0.33},

    {name:"goal",pathObj:"/equipment_0009_goal.glb",SC:0.555,bigImage:true},
   
    {name:"passingarc",pathObj:"/equipment_0011_passingarc.glb",SC:0.33},
    {name:"balanceball",pathObj:"/equipment_0012_balanceball.glb",SC:0.1},

    {name:"largehurdle",pathObj:"/equipment_0013_largehurdle.glb",SC:0.33},
    {name:"reboundboard1",pathObj:"/equipment_0014_reboundboard1.glb",SC:0.33},

    {name:"reboundboard2",pathObj:"/equipment_0015_reboundboard2.glb",SC:0.33},
    {name:"agilitycones",pathObj:"/equipment_0016_agilitycones.glb",SC:0.33},

    {name:"cartyre",pathObj:"/equipment_0024_cartyre.glb",SC:0.15},
    {name:"flatdiscmarker",pathObj:"/equipment_0031_flatdiscmarker.glb",SC:0.015},
    {name:"headtennisnet",pathObj:"/equipment_0034_headtennisnet.glb",SC:0.5,bigImage:true},

    {name:"speedrings",pathObj:"/equipment_0017_speedrings.glb",SC:0.04}
]


export const pitchesTextures=[
    {name:"grassIco",texture:'../assets/obj/pitches/img/grass.png',opacity:0.4},
    {name:"checkerIco",texture:'../assets/obj/pitches/img/checker.png',opacity:1},
    {name:"stripesIco",texture:'../assets/obj/pitches/img/stripes.png',opacity:1},
    {name:"circlesIco",texture:'../assets/obj/pitches/img/circles.png',opacity:1}
]


export const players_path:string = "../assets/obj/player2/Poses Obj";
export const players_data =[
    {name:"celebration2",pathObj:"/Celebration 2.obj",SC:0.55},
    {name:"celebration3",pathObj:"/Celebration 3.obj",SC:0.55},
    {name:"shooting",pathObj:"/Shooting.obj",SC:0.53},
    {name:"Stand On Ball",pathObj:"/Stand On Ball.obj",SC:0.60},
    {name:"tackle",pathObj:"/Tackle.obj",SC:0.25}
];


export const bgs_data =[
    {name:"bg1",url:'./assets/images/bg1.jpg'},
    {name:"bg2",url:'./assets/images/bg2.jpg'},
    {name:"bg3",url:'./assets/images/bg3.jpg'},
    {name:"bg4",url:'./assets/images/bg4.jpg'}
];