/*import { Howl } from "howler";
import { GlobalGameOptions } from "./config";
import $ from "jquery";

export class SoundManager {


    S_win:Howl;
    S_lose:Howl;
    S_BG:Howl;
    S_shooting:Howl;
    S_countdown:Howl;
    soundOn:boolean = false;
    soundsLib:any;
    constructor(){
        
        this.S_BG = new Howl({src:'./assets/audios/PenaltyBGS1.mp3',volume:0.2,loop:true});

        this.S_BG.once('load', ()=>{
            this.playAudio('BG');
        });


     
        this.S_win = new Howl({src:'./assets/audios/Mix with goal 2.mp3',volume:0.5,loop:false});
        this.S_lose = new Howl({src:'./assets/audios/aaa.mp3',volume:0.5,loop:false});

        this.S_shooting = new Howl({src:'./assets/audios/shooting.mp3',volume:0.5,loop:false});
        this.S_countdown = new Howl({src:'./assets/audios/Countdown.mp3',volume:0.5,loop:false});
        this.soundsLib=[];
        this.soundsLib['BG'] = this.S_BG;
        this.soundsLib['win'] = this.S_win;
        this.soundsLib['lose'] = this.S_lose;
        this.soundsLib['shooting'] = this.S_shooting;
        this.soundsLib['countdown'] = this.S_countdown;


        //listen to sound event
        $( document ).on( "sound",( event, arg1, arg2 )=> {
            this.ToggleBGS(GlobalGameOptions.SoundOn)
            
        });

       
       
    }
    playAudio(name:'win'|'BG'|'lose'|'shooting'|'countdown'){
        if(!GlobalGameOptions.SoundOn){return;}
        //if( !this.soundsLib[name].playing() || name =='contact' ){this.soundsLib[name].play();}
        this.soundsLib[name].play();
    }
    stopAudio(name:'win'|'BG'|'lose'|'shooting'|'countdown'){
        this.soundsLib[name].stop();
    }
    ToggleBGS(v:boolean){
        if(v){this.soundsLib['BG'].play();}else{this.soundsLib['BG'].stop();}
    }
   
}*/