import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, } from '@angular/core'
import * as moment from 'moment'

@Component({
    selector: 'app-camera',
    templateUrl: './camera.component.html',
    styleUrls: ['./camera.component.css']
})


export class cameraComponent implements OnInit {
    _video:any
    _canvas:any
    _context:any
    _imgData:any
    _link:any
    capturedImg: string = ""

    @Output() closeCamera = new EventEmitter<string>()

    @HostListener('window:popstate', ['$event'])closeSelf() {
        // listen for popstate/back event

        // on "back", close camera
        // emit false for the event as no picture was taken
        this.closeCamera.emit(this.capturedImg)
    }

    constructor() {}

    ngOnInit() {
        // push a dummy history to block redirect from popstate
        history.pushState({
            action: "camera"
        }, null);
    }

    //once quit this page, stop camera
    ngOnDestroy() {
        this._video.srcObject.getTracks().forEach(element => {
            element.stop()
        })
        
        if(window.history.state.action === "camera"){
            history.back();
        }
    }

    @ViewChild('videoX', {static: false}) video:any 
    // note that "#video" is the name of the template variable in the video element

    ngAfterViewInit() {
        this._video = this.video.nativeElement
        //get window's height & width
        this._video.height = window.innerHeight
        this._video.width = window.innerWidth
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            //navigator.mediaDevices.getUserMedia({ video: true })
            navigator.mediaDevices.getUserMedia({ video: {
                facingMode: "environment"
            } })      
            .then(stream => {
                //this._video.src = window.URL.createObjectURL(stream)
                this._video.srcObject = stream
                this._video.play()
            })
            .catch(err => {
                //console.log('Native camera fail : ' + err )
            })
        }
    }  


    onCapturePhoto() {
        //console.log('this._video.src : ' + this._video.src )
        
        if(this._video) {
            this._canvas = document.getElementById('canvasTag')
            this._context = this._canvas.getContext('2d')

            if (this._canvas.width !== this._video.videoWidth || this._canvas.height !== this._video.videoHeight) {
                this._canvas.width  = this._video.videoWidth
                this._canvas.height = this._video.videoHeight
            }

            this._context.drawImage(this._video,0,0,this._video.videoWidth, this._video.videoHeight)

            //add datetime
            this._context.fillStyle = "red"
            this._context.font = "18pt Verdana"
            this._context.fillText(moment().format('DD MMM YYYY HH:mm'),10,30)
            
            this._imgData = this._canvas.toDataURL('image/jpeg')
            if(this._imgData !== 'data:,'){
                this.capturedImg = this._imgData
                history.back()
            } else {
                history.back()
            }
        }
    }    

    goBack() {
        //consume the fake history
        history.back()
    }
}


