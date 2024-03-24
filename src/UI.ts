import { equipments_Football, pitchesTextures } from "./config";
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
      $('#pitchesC').append('<div id="P_'+line+'" class="'+col+' m-0 mt-1 p-0 mb-1" ><img alt="'+_name+'" class="clickable" src="assets/obj/pitches/img/'+_name+'.png"></div>');    
     
    } 

}

export const ActivateRightBt = ()=>{
//show equpments
$('#EquipmentsBt').on('pointerdown', (event: any) => {

    if(DataUI.actualPanelId.length>1){
        gsap.to(DataUI.actualPanelId, { left: '-10%', duration: 0.2 ,
        onComplete:()=>{
            DataUI.actualPanelId = '';
             $(DataUI.actualBt).removeClass('selectedBt');
             $(DataUI.actualBt).addClass('nonSelectedBt');
         }
    }); 
    }


    var left = $("#equipments").css("left");
    if(left == "40px"){
        gsap.to("#equipments", { left: '-10%', duration: 0.2 ,
        onComplete:()=>{
            DataUI.actualPanelId = '';
        $(DataUI.actualBt).removeClass('selectedBt');
             $(DataUI.actualBt).addClass('nonSelectedBt');
            }
    });
        $("#EquipmentsBt").removeClass('selectedBt');
        $("#EquipmentsBt").addClass('nonSelectedBt');

    }
    else{ 
        gsap.to("#equipments", { left: '40px', duration: 0.2,
        onComplete:()=>{DataUI.actualPanelId = '#equipments'; DataUI.actualBt='#EquipmentsBt'}
         });
        $("#EquipmentsBt").removeClass('nonSelectedBt')
        $("#EquipmentsBt").addClass('selectedBt')
    }
    });




$('#PitchesBt').on('pointerdown', (event: any) => {
    if(DataUI.actualPanelId.length>1){
        gsap.to(DataUI.actualPanelId, { left: '-10%', duration: 0.2 ,
        onComplete:()=>{
            DataUI.actualPanelId = '';
        $("#EquipmentsBt").removeClass('selectedBt');
        $("#EquipmentsBt").addClass('nonSelectedBt');
     }
    }); 
    }

    var left = $("#pitches").css("left");
    if(left == "40px"){
        gsap.to("#pitches", { left: '-10%', duration: 0.2 ,
        onComplete:()=>{DataUI.actualPanelId = '';}
    });
        $("#PitchesBt").removeClass('selectedBt');
        $("#PitchesBt").addClass('nonSelectedBt');

    }
    else{ 
        gsap.to("#pitches", { left: '40px', duration: 0.2,
        onComplete:()=>{DataUI.actualPanelId = '#pitches'; DataUI.actualBt='#PitchesBt'}
         });
        $("#PitchesBt").removeClass('nonSelectedBt')
        $("#PitchesBt").addClass('selectedBt')
    }
    });

}