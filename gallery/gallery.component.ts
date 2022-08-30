import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { confirm } from 'devextreme/ui/dialog'
import { DxGalleryComponent } from 'devextreme-angular'

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})

export class galleryComponent implements OnInit, OnDestroy {
    isOpenCamera: boolean = false 
    isShowText: boolean = true

    @Input() allowCamera: boolean = false
    @Input() galleryDS: Array<any>
    @Output() closeGallery = new EventEmitter<boolean>()
    @Output() refreshGallery = new EventEmitter<string>()
    @Output() deleteImage = new EventEmitter<number>()
    @ViewChild("gallery", {static: false}) gallery: DxGalleryComponent

    constructor() {}
    
    //----- close self -----//
        goBack(event){
            // consume the fake history
            history.back();
        }
        
        //listen for popstate/back event
        @HostListener('window:popstate', ['$event'])closeSelf() {
            if(window.history.state.action === "gallery"){
                // if the history is self, ignore
            } else {
                // if history is not self, close self
                this.closeGallery.emit(true)
            }
        }
    //----- close self -----//

    ngOnInit() {
        // push a dummy history to block redirect from popstate/back
        history.pushState({
            action: "gallery"
        }, null);

        if(this.galleryDS.length < 1){
            // if no images, open camera as well
            this.openCamera()
        }
    }

    ngOnDestroy(){ //does not get triggered on page refresh ._.
    }

    //----- app-cameraComponent -----//
        openCamera(){
            if(this.allowCamera){
                this.isOpenCamera = true
            }
        }

        closeCamera(event){
            this.isOpenCamera = false //close camera regardless

            // check if new picture was added
            if(event){
                // refresh gallery if new picture was added
                this.refreshGallery.emit(event)
            } else {
                //no picture was added
                if(this.galleryDS.length < 1){
                    //if no picture in gallery, close gallery as well
                    history.back();
                }
            }
        }
    //----- app-cameraComponent -----//
     
    // ----- dx-gallery ----- //
        delImg(){
            confirm("Are you sure you want to delete this image?", "")
            .then( isDel => {
                if(isDel){
                    let itemToDel = this.gallery.instance.option("selectedItem")
                    this.deleteImage.emit(itemToDel.id) //emit picture ID to delete
                } else {
                    return
                }
            })
        }

        imgPrevious(){
            return this.gallery.instance.prevItem(true)
        }
        
        imgNext(){
            return this.gallery.instance.nextItem(true)
        }
        
        toggleText(){
            this.isShowText = !this.isShowText
        }
    // ----- dx-gallery ----- //

    // ----- dx-tile-view -----//
        goToImg(e){
            // change gallery image to the image selected on dx-tile-view
            let _selectedItem = e.itemIndex
            return this.gallery.instance.goToItem(_selectedItem, true)
        }

        isHighlight(data){
            // identify whether to highlight dx-tile-view item
            return data.id === this.gallery.instance.option("selectedItem").id
        }
    // ----- dx-tile-view -----//
}

