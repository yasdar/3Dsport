import { bgs_data, equipments_Football, pitchesTextures, players_data } from "./config";
import $ from "jquery";
import gsap from "gsap";

export const DataUI:any={
    actualPanelId:'',
    actualBt:''
}
export const addEList = ()=>{
    for(let line:number = 0 ; line<equipments_Football.length; line++){
        let _name:string = equipments_Football[line].name;
        let col:string = 'col-6';
        if(equipments_Football[line].bigImage){
            col = 'col-12';
        }
      $('#equipmentsC').append('<div id="E_'+line+'" class="'+col+' m-0 mt-1 p-0 mb-1" ><img alt="'+_name+'" class="clickable" src="assets/obj/equipmentsFootBall/img/'+_name+'.png"></div>');    
    } 

}

export const addPitcheList = ()=>{
    for(let line:number = 0 ; line<pitchesTextures.length; line++){
        let _name:string = pitchesTextures[line].name;
        let col:string = 'col-12';
      $('#pitchesC').append('<div id="P_'+line+'" class="nonSelectedBt '+col+' m-0 mt-1 p-0 mb-1" ><img alt="'+_name+'" class="clickable" src="assets/obj/pitches/img/'+_name+'.png"></div>');    
     
    } 
}

export const addBgsList = ()=>{
    for(let b:number = 0 ; b<bgs_data.length; b++){
        let _name:string = bgs_data[b].name;
        let col:string = 'col-12';
      $('#bgsC').append('<div id="bg_'+b+'" class="nonSelectedBt '+col+' m-0 mt-1 p-0 mb-1" ><img alt="'+_name+'" class="clickable" src="assets/images/'+_name+'m.png"></div>');    
     
    } 
}


export const addPlayersList = ()=>{
    for(let p:number = 0 ; p<players_data.length; p++){
        let _name:string = players_data[p].name;
        let col:string = 'col-12';
      $('#playersC').append('<div id="PL_'+p+'" class="nonSelectedBt '+col+' m-0 mt-1 p-0 mb-1" ><img alt="'+_name+'" class="clickable" src="assets/obj/player2/img/'+_name+'.png"></div>');    
     
    } 
}

export const ActivateRightBt = ()=>{
const bt_panels:Array<any>=[
    {bt:'#EquipmentsBt',panel:'#equipments'},
    {bt:'#PitchesBt',panel:'#pitches'},
    {bt:'#PlayersBt',panel:'#players'},
    {bt:'#kitsBt',panel:'#kits'},
    {bt:'#bgsBt',panel:'#bgs'}
];
bt_panels.forEach((obj:any)=>{
//show equpments
$(obj.bt).on('pointerdown', (event: any) => {
   
    if(DataUI.actualPanelId.length>1){
        gsap.to(DataUI.actualPanelId, { left: '-12%', duration: 0.2 ,
        onComplete:()=>{
            DataUI.actualPanelId = '';
             $(DataUI.actualBt).removeClass('selectedBt');
             $(DataUI.actualBt).addClass('nonSelectedBt');
         }
    }); 
    }


    var left = $( obj.panel).css("left");
    if(left == "40px"){
        gsap.to( obj.panel, { left: '-12%', duration: 0.2 ,
        onComplete:()=>{
            $(DataUI.actualBt).removeClass('selectedBt');
            $(DataUI.actualBt).addClass('nonSelectedBt');
            DataUI.actualPanelId = '';
            }
    });
        $(obj.bt).removeClass('selectedBt');
        $(obj.bt).addClass('nonSelectedBt');
    }
    else{ 
        gsap.to( obj.panel, { left: '40px', duration: 0.2,
        onComplete:()=>{DataUI.actualPanelId =  obj.panel; DataUI.actualBt=obj.bt}
         });
        $(obj.bt).removeClass('nonSelectedBt')
        $(obj.bt).addClass('selectedBt')
    }
    });
})


}


export const handlePitcheselection = (index:number)=>{
    for(let p:number = 0 ; p<pitchesTextures.length; p++){
        $('#P_'+p).removeClass('selectedBt');
        $('#P_'+p).addClass('nonSelectedBt');
        }
    $('#P_'+index).removeClass('nonSelectedBt');
    $('#P_'+index).addClass('selectedBt');
}

export const handlePlayersselection = (index:number)=>{
   
    for(let p:number = 0 ; p<players_data.length; p++){
        $('#PL_'+p).removeClass('selectedBt');
        $('#PL_'+p).addClass('nonSelectedBt');
        }
    $('#PL_'+index).removeClass('nonSelectedBt');
    $('#PL_'+index).addClass('selectedBt');
}


export const handleBgsselection = (index:number)=>{
   
    for(let p:number = 0 ; p<bgs_data.length; p++){
        $('#bg_'+p).removeClass('selectedBt');
        $('#bg_'+p).addClass('nonSelectedBt');
        }
    $('#bg_'+index).removeClass('nonSelectedBt');
    $('#bg_'+index).addClass('selectedBt');
}
